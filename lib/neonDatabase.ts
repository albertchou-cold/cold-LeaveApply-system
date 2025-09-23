// Neon.tech 雲端資料庫配置
// 完成 Neon.tech 設定後，請移除註解並更新 .env.local

// Neon.tech 連線配置
// const neonConfig = {
//   將此配置移至 .env.local 檔案：
//   POSTGRES_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
//   POSTGRES_PRISMA_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require&pgbouncer=true&connect_timeout=15"
//   POSTGRES_URL_NON_POOLING="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
//   
//   connectionString: process.env.POSTGRES_URL || '',
//   ssl: {
//     rejectUnauthorized: false
//   },
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// };

// 註解：未來使用的 Neon 連線池
// const neonPool = new Pool(neonConfig);

// Neon.tech 資料庫表格創建腳本
/*
const createTablesSQL = `
-- 用戶表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 請假申請表
CREATE TABLE IF NOT EXISTS leave_applications (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    approved_by VARCHAR(100) NULL,
    rejected_at TIMESTAMP NULL,
    rejected_by VARCHAR(100) NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 創建索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_leave_applications_employee_id ON leave_applications(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications(status);
CREATE INDEX IF NOT EXISTS idx_leave_applications_dates ON leave_applications(start_date, end_date);

-- 插入預設管理員帳號（密碼: admin123）
INSERT INTO users (username, password_hash, full_name, employee_id, role) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系統管理員', 'ADMIN001', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 插入預設經理帳號（密碼: manager123）
INSERT INTO users (username, password_hash, full_name, employee_id, role) 
VALUES ('manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '部門經理', 'MGR001', 'manager')
ON CONFLICT (username) DO NOTHING;
`;
*/

// 註解：未來的資料庫操作函數
/*
export const neonDatabase = {
  // 初始化資料庫表格
  async initializeTables() {
    const client = await neonPool.connect();
    try {
      await client.query(createTablesSQL);
      console.log('Neon.tech 資料庫表格創建成功');
    } catch (error) {
      console.error('創建資料庫表格失敗:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  // 用戶相關操作
  async createUser(user: any) {
    const client = await neonPool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (username, password_hash, full_name, employee_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user.username, user.password_hash, user.full_name, user.employee_id, user.role]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findUserByUsername(username: string) {
    const client = await neonPool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async findUserById(id: number) {
    const client = await neonPool.connect();
    try {
      const result = await client.query('SELECT id, username, full_name, employee_id, role FROM users WHERE id = $1', [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  // 請假申請相關操作
  async createLeaveApplication(leave: any) {
    const client = await neonPool.connect();
    try {
      const result = await client.query(
        'INSERT INTO leave_applications (employee_id, employee_name, leave_type, start_date, end_date, reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [leave.employee_id, leave.employee_name, leave.leave_type, leave.start_date, leave.end_date, leave.reason]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async getLeaveApplications() {
    const client = await neonPool.connect();
    try {
      const result = await client.query('SELECT * FROM leave_applications ORDER BY applied_at DESC');
      return result.rows;
    } finally {
      client.release();
    }
  },

  async updateLeaveStatus(id: string, status: string, updateData: any) {
    const client = await neonPool.connect();
    try {
      let query = 'UPDATE leave_applications SET status = $1, updated_at = CURRENT_TIMESTAMP';
      const params = [status];
      let paramIndex = 2;

      if (status === 'APPROVED') {
        query += ', approved_at = CURRENT_TIMESTAMP, approved_by = $' + paramIndex;
        params.push(updateData.approved_by);
        paramIndex++;
      } else if (status === 'REJECTED') {
        query += ', rejected_at = CURRENT_TIMESTAMP, rejected_by = $' + paramIndex + ', rejection_reason = $' + (paramIndex + 1);
        params.push(updateData.rejected_by, updateData.rejection_reason);
        paramIndex += 2;
      }

      query += ' WHERE id = $' + paramIndex + ' RETURNING *';
      params.push(id);

      const result = await client.query(query, params);
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  async deleteLeaveApplication(id: string) {
    const client = await neonPool.connect();
    try {
      await client.query('DELETE FROM leave_applications WHERE id = $1', [id]);
      return true;
    } finally {
      client.release();
    }
  }
};
*/

// 未來的Neon資料庫配置檔案，暫時匯出null
const neonDatabase = null;
export default neonDatabase;
