import { LeaveApplication, LeaveStatus, LeaveType } from '@/app/types/leave';
import { User, UserRole, UserRegistrationRequest } from '@/app/types/auth';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import schedule from 'node-schedule';

// 連接到 Neon.tech PostgreSQL 資料庫
if (!process.env.DATABASE_URL) {
  // 顯式提醒：在無 DATABASE_URL 時，pg 會預設嘗試連 127.0.0.1:5432
  console.error('ENV ERROR: DATABASE_URL is not set. The app may try to connect to 127.0.0.1:5432 and fail on Vercel.');
}

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 初始化資料庫表格（啟動時執行一次）
export async function initializeDatabase() {
  try {
    console.log('🔍 檢查資料庫表格...');
    
    // 建立使用者表格
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        department VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP NULL , 
        is_synced BOOLEAN DEFAULT FALSE,
        synced_at TIMESTAMP NULL
      )
    `);
    
    // 建立請假申請表格
    await db.query(`
      CREATE TABLE IF NOT EXISTS leave_applications (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(50) NOT NULL,
        employee_name VARCHAR(100) NOT NULL,
        leave_type VARCHAR(50) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(20) DEFAULT '待審核',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP NULL,
        approved_by VARCHAR(50) NULL,
        rejected_at TIMESTAMP NULL,
        rejected_by VARCHAR(50) NULL,
        rejection_reason TEXT NULL,
        apply_folder_link TEXT NULL,
        department VARCHAR(100) NOT NULL,
        RandomUniqueId VARCHAR(255) UNIQUE NOT NULL,
        is_synced BOOLEAN DEFAULT FALSE,
        synced_at TIMESTAMP NULL,
        FOREIGN KEY (employee_id) REFERENCES users(employee_id)
      )
    `);
    
    // 檢查並更新 leave_applications 表格的日期欄位類型
    try {
      const columnCheck = await db.query(
        `SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'leave_applications' 
        AND column_name IN ('start_date', 'end_date')
        AND data_type = 'date'
      `);
      
      if (columnCheck.rows.length > 0) {
        console.log('🔄 更新請假表格日期欄位為日期時間類型...');
        await db.query(`
          ALTER TABLE leave_applications 
          ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::timestamp,
          ALTER COLUMN end_date TYPE TIMESTAMP USING end_date::timestamp
        `);
        console.log('✅ 日期欄位更新完成');
      }
    } catch {
      console.log('ℹ️ 日期欄位已是正確類型或表格不存在');
    }

    // 檢查並添加 RandomUniqueId 欄位
    try {
      const randomIdColumnCheck = await db.query(
        `SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'leave_applications' 
        AND column_name = 'randomuniqueid'
      `);
      
      if (randomIdColumnCheck.rows.length === 0) {
        console.log('🔄 添加 RandomUniqueId 欄位到請假申請表格...');
        await db.query(`
          ALTER TABLE leave_applications 
          ADD COLUMN RandomUniqueId VARCHAR(255) UNIQUE
        `);
        console.log('✅ RandomUniqueId 欄位添加完成');
      }
    } catch (error) {
      console.log('ℹ️ RandomUniqueId 欄位可能已存在或表格不存在:', error);
    }
    
    // 檢查是否需要插入初始管理員使用者
    const userCountResult = await db.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(userCountResult.rows[0].count);
    
    if (userCount === 0) {
      console.log('👤 建立初始管理員使用者...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(`
        INSERT INTO users (
          email, 
          password_hash, 
          full_name, 
          employee_id, 
          department, 
          role
        ) VALUES 
        ('admin@company.com', $1, '系統管理員', 'ADMIN001', '資訊部', 'admin'),
        ('manager@company.com', $2, '人事經理', 'MANAGER001', '人事部', 'manager')
      `, [hashedPassword, await bcrypt.hash('manager123', 10)]);
      console.log('✅ 初始管理員使用者已建立');
      console.log('📋 預設帳號：admin / admin123, manager / manager123');
    }
    
    console.log('✅ 資料庫初始化完成');
  } catch (error) {
    console.error('❌ 資料庫初始化失敗:', error);
  }
}

export const leaveDB = {
  // 獲取所有請假申請
  getAllApplications: async (): Promise<LeaveApplication[]> => {
    try {
      const result = await db.query(`
        SELECT 
          id::text,
          employee_id as "employeeId",
          employee_name as "employeeName",
          leave_type as "leaveType",
          start_date::text as "startDate",
          end_date::text as "endDate",
          reason,
          status,
          applied_at::text as "appliedAt",
          approved_at::text as "approvedAt",
          approved_by as "approvedBy",
          rejected_at::text as "rejectedAt",
          rejected_by as "rejectedBy",
          apply_folder_link as "applyFolderLink",
          department,
          is_synced
        FROM leave_applications 
        ORDER BY applied_at DESC
      `);
      
      return result.rows.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        employeeId: row.employeeId as string,
        employeeName: row.employeeName as string,
        leaveType: row.leaveType as LeaveType,
        startDate: row.startDate as string,
        endDate: row.endDate as string,
        reason: row.reason as string,
        applyFolderLink: row.applyFolderLink as string,
        status: row.status as LeaveStatus,
        appliedAt: row.appliedAt as string,
        approvedAt: (row.approvedAt as string | null) || undefined,
        approvedBy: (row.approvedBy as string | null) || undefined,
        rejectedAt: (row.rejectedAt as string | null) || undefined,
        rejectedBy: (row.rejectedBy as string | null) || undefined,
        // rejectionReason: (row.rejectionReason as string | null) || undefined,
        department: row.department as string,
        RandomUniqueId: row.RandomUniqueId as string,
        is_synced: row.is_synced as boolean
      }));
    } catch (error) {
      console.error('獲取請假申請失敗:', error);
      return [];
    }
  },

  // 根據ID獲取請假申請
  getApplicationById: async (id: string): Promise<LeaveApplication | null> => {
    try {
      const result = await db.query(`
        SELECT 
          id::text,
          employee_id as "employeeId",
          employee_name as "employeeName",
          leave_type as "leaveType",
          start_date::text as "startDate",
          end_date::text as "endDate",
          reason,
          status,
          applied_at::text as "appliedAt",
          approved_at::text as "approvedAt",
          approved_by as "approvedBy",
          rejected_at::text as "rejectedAt",
          rejected_by as "rejectedBy",
          apply_folder_link as "applyFolderLink",
          department as "department"
        FROM leave_applications 
        WHERE id = $1
      `, [id]);
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        ...row,
        leaveType: row.leaveType as LeaveType,
        status: row.status as LeaveStatus
      };
    } catch (error) {
      console.error('獲取請假申請失敗:', error);
      return null;
    }
  },

  // 根據員工ID獲取請假申請
  getApplicationsByEmployeeId: async (employeeId: string): Promise<LeaveApplication[]> => {
    try {
      const result = await db.query(`
        SELECT 
          id::text,
          employee_id as "employeeId",
          employee_name as "employeeName",
          leave_type as "leaveType",
          start_date::text as "startDate",
          end_date::text as "endDate",
          reason,
          status,
          applied_at::text as "appliedAt",
          approved_at::text as "approvedAt",
          approved_by as "approvedBy",
          rejected_at::text as "rejectedAt",
          rejected_by as "rejectedBy",
          apply_folder_link as "applyFolderLink",
          department as "department",
          RandomUniqueId,
          is_synced
        FROM leave_applications 
        WHERE employee_id = $1
        ORDER BY applied_at DESC
      `, [employeeId]);
      
      return result.rows.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        employeeId: row.employeeId as string,
        employeeName: row.employeeName as string,
        leaveType: row.leaveType as LeaveType,
        startDate: row.startDate as string,
        endDate: row.endDate as string,
        reason: row.reason as string,
        applyFolderLink: row.applyFolderLink as string,
        status: row.status as LeaveStatus,
        appliedAt: row.appliedAt as string,
        approvedAt: (row.approvedAt as string | null) || undefined,
        approvedBy: (row.approvedBy as string | null) || undefined,
        rejectedAt: (row.rejectedAt as string | null) || undefined,
        rejectedBy: (row.rejectedBy as string | null) || undefined,
        // rejectionReason: (row.rejectionReason as string | null) || undefined,
        department: row.department as string,
        RandomUniqueId: row.RandomUniqueId as string,
        is_synced: row.is_synced as boolean
      }));
    } catch (error) {
      console.error('獲取員工請假申請失敗:', error);
      return [];
    }
  },

  // 創建新的請假申請
  createApplication: async (application: Omit<LeaveApplication, 'id' | 'status' | 'appliedAt' | 'is_synced'>): Promise<LeaveApplication | null> => {
    try {
      const result = await db.query(`
        INSERT INTO leave_applications (
          employee_id, employee_name, leave_type, start_date, end_date, reason, apply_folder_link, department, RandomUniqueId
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING 
          id::text,
          employee_id as "employeeId",
          employee_name as "employeeName",
          leave_type as "leaveType",
          start_date::text as "startDate",
          end_date::text as "endDate",
          reason,
          status,
          applied_at::text as "appliedAt",
          approved_at::text as "approvedAt",
          approved_by as "approvedBy",
          rejected_at::text as "rejectedAt",
          rejected_by as "rejectedBy",
          apply_folder_link as "applyFolderLink",
          department as "department",
          RandomUniqueId,
          is_synced
      `, [
        application.employeeId,
        application.employeeName,
        application.leaveType,
        application.startDate,
        application.endDate,
        application.reason,
        application.applyFolderLink,
        application.department,
        application.RandomUniqueId,
      ]);
      
      const row = result.rows[0];
      return {
        ...row,
        leaveType: row.leaveType as LeaveType,
        status: row.status as LeaveStatus,
        is_synced: row.is_synced as boolean
      };
    } catch (error) {
      console.error('創建請假申請失敗:', error);
      return null;
    }
  },

  // 更新請假申請狀態
  updateApplicationStatus: async (
    id: string,
    status: LeaveStatus,
    managerId?: string,
    // rejectionReason?: string
  ): Promise<LeaveApplication | null> => {
    try {
      let query = '';
      let params: (string | undefined)[] = [];

      if (status === LeaveStatus.APPROVED) {
        query = `
          UPDATE leave_applications 
          SET status = $1, approved_at = CURRENT_TIMESTAMP, approved_by = $2
          WHERE id = $3
        `;
        params = [status, managerId, id];
      } else if (status === LeaveStatus.REJECTED) {
        query = `
          UPDATE leave_applications
          SET status = $1, rejected_at = CURRENT_TIMESTAMP, rejected_by = $2
          WHERE id = $3
        `;
        params = [status, managerId, id];
      } else {
        query = `UPDATE leave_applications SET status = $1 WHERE id = $2`;
        params = [status, id];
      }

      await db.query(query, params);
      
      // 返回更新後的記錄
      return await leaveDB.getApplicationById(id);
    } catch (error) {
      console.error('更新請假申請狀態失敗:', error);
      return null;
    }
  },


  // 刪除請假申請
  deleteApplication: async () => {
    schedule.scheduleJob("0 0 14 * * 2", async () => {
    try {
      const result = await db.query(`
        DELETE FROM leave_applications 
            WHERE randomuniqueid IS NOT NULL 
              AND is_synced = true
              AND synced_at IS NOT NULL
        `);

       // 檢查刪除結果
      if ((result?.rowCount ?? 0) > 0) {
        console.log(`成功刪除 ${(result?.rowCount ?? 0)} 筆已同步的請假申請`);
      } else {
        console.log('沒有找到需要刪除的已同步請假申請');
      }

    } catch (error) {
      console.error('刪除請假申請失敗:', error);
      return false;
    }
  });
}};


// 使用者管理功能
export const userDB = {
  // 註冊新使用者
  createUser: async (userData: UserRegistrationRequest): Promise<User | null> => {
    try {
      // 檢查電子郵件或員工編號是否已存在（任何一個重複都不可註冊）
      const duplicateCheck = await db.query(
        'SELECT id FROM users WHERE email = $1 OR employee_id = $2',
        [userData.email, userData.employeeId]
      );

      if (duplicateCheck.rows.length > 0) {
        console.warn('⚠️ 嘗試建立已存在的使用者', {
          email: userData.email,
          employeeId: userData.employeeId
        });
        return null; // 讓上層決定回應（409 Conflict）
      }

      // 加密密碼
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // 插入新使用者
      const result = await db.query(`
        INSERT INTO users (
          email, password_hash, full_name, employee_id, department, role
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING 
          id::text,
          email,
          full_name as "fullName",
          employee_id as "employeeId",
          department,
          role,
          created_at::text as "createdAt"
      `, [
        userData.email,
        hashedPassword,
        userData.fullName,
        userData.employeeId,
        userData.department,
        userData.role
      ]);

      const row = result.rows[0];
      return {
        ...row,
        role: row.role as UserRole
      };
    } catch (error: unknown) {
      // 對常見的唯一性違反錯誤做更明確的日志標記
      if (error instanceof Error && /duplicate key value violates unique constraint/i.test(error.message)) {
        console.error('❌ 資料庫唯一性約束錯誤 (email 或 employee_id 重複):', error.message);
        return null;
      }
      console.error('建立使用者失敗 (可能是資料庫連線或其他問題):', error);
      return null;
    }
  },

  // 使用者登入驗證
  authenticateUser: async (memberIdCheck: string, password: string): Promise<User | null> => {
    try {
      const result = await db.query(`
        SELECT 
          id::text,
          employee_id as "memberId",
          email,
          password_hash,
          full_name as "fullName",
          employee_id as "employeeId",
          department,
          role,
          created_at::text as "createdAt",
          last_login_at::text as "lastLoginAt"
        FROM users 
        WHERE employee_id = $1
      `, [memberIdCheck]);

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return null;
      }

      // 更新最後登入時間
      await db.query(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // 移除密碼雜湊值並返回使用者資料
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash: _, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        role: userWithoutPassword.role as UserRole,
        lastLoginAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('使用者驗證失敗:', error);
      return null;
    }
  },

  // 根據ID獲取使用者
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const result = await db.query(`
        SELECT 
          id::text,
          email,
          full_name as "fullName",
          employee_id as "employeeId",
          department,
          role,
          created_at::text as "createdAt",
          last_login_at::text as "lastLoginAt"
        FROM users 
        WHERE id = $1
      `, [id]);

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        ...row,
        role: row.role as UserRole
      };
    } catch (error) {
      console.error('獲取使用者失敗:', error);
      return null;
    }
  },

  // 根據員工編號獲取使用者
  getUserByEmployeeId: async (employeeId: string): Promise<User | null> => {
    try {
      const result = await db.query(`
        SELECT 
          id::text,
          email,
          full_name as "fullName",
          employee_id as "employeeId",
          department,
          role,
          created_at::text as "createdAt",
          last_login_at::text as "lastLoginAt"
        FROM users 
        WHERE employee_id = $1
      `, [employeeId]);

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        ...row,
        role: row.role as UserRole
      };
    } catch (error) {
      console.error('獲取使用者失敗:', error);
      return null;
    }
  },

  // 獲取所有使用者
  getAllUsers: async (): Promise<User[]> => {
    try {
      const result = await db.query(`
        SELECT 
          id::text,
          email,
          full_name as "fullName",
          employee_id as "employeeId",
          department,
          role,
          created_at::text as "createdAt",
          last_login_at::text as "lastLoginAt"
        FROM users 
        ORDER BY created_at DESC
      `);

      return result.rows.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        email: row.email as string,
        fullName: row.fullName as string,
        employeeId: row.employeeId as string,
        department: row.department as string,
        role: row.role as UserRole,
        createdAt: row.createdAt as string,
        lastLoginAt: (row.lastLoginAt as string | null) || undefined
      }));
    } catch (error) {
      console.error('獲取使用者列表失敗:', error);
      return [];
    }
  },

  // 通過電子郵件獲取使用者
  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const result = await db.query(`
        SELECT 
          id::text,
          email,
          full_name as "fullName",
          employee_id as "employeeId",
          department,
          role,
          created_at::text as "createdAt",
          last_login_at::text as "lastLoginAt"
        FROM users 
        WHERE email = $1
      `, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        ...row,
        role: row.role as UserRole,
        lastLoginAt: (row.lastLoginAt as string | null) || undefined
      };
    } catch (error) {
      console.error('通過電子郵件獲取使用者失敗:', error);
      return null;
    }
  },

  // 通過手機號碼獲取使用者
  getUserByPhone: async (phoneNumber: string): Promise<User | null> => {
    try {
      const result = await db.query(`
        SELECT 
          id::text,
          email,
          full_name as "fullName",
          employee_id as "employeeId",
          department,
          role,
          phone_number as "phoneNumber",
          created_at::text as "createdAt",
          last_login_at::text as "lastLoginAt"
        FROM users 
        WHERE phone_number = $1
      `, [phoneNumber]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        ...row,
        role: row.role as UserRole,
        lastLoginAt: (row.lastLoginAt as string | null) || undefined
      };
    } catch (error) {
      console.error('通過手機號碼獲取使用者失敗:', error);
      return null;
    }
  },

  // 通過員工編號更新密碼
  updatePasswordByEmployeeId: async (employeeId: string, hashedPassword: string): Promise<boolean> => {
    try {
      const result = await db.query(
        'UPDATE users SET password_hash = $1 WHERE employee_id = $2',
        [hashedPassword, employeeId]
      );
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('更新密碼失敗:', error);
      return false;
    }
  },

  // 通過電子郵件更新密碼
  updatePasswordByEmail: async (email: string, newPassword: string): Promise<boolean> => {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await db.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2',
        [hashedPassword, email]
      );
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('更新密碼失敗:', error);
      return false;
    }
  }
};
