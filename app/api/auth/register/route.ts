import { NextRequest, NextResponse } from 'next/server';
import { AuthResponse } from '@/app/types/auth';
import { generateToken } from '@/lib/auth';
import { userDB, initializeDatabase } from '@/lib/database';

// 確保在首次請求時初始化資料庫
let isInitialized = false;

export async function POST(request: NextRequest) {
  try {
    // 初始化資料庫（僅第一次）
    if (!isInitialized) {
      await initializeDatabase();
      isInitialized = true;
    }

    const body = await request.json();
    const { email, password, fullName, employeeId, department, role } = body;

    console.log('後端收到的數據:', { email, password: '***', fullName, employeeId, department, role });


    let normalizedEmployeeId = employeeId;
    if (normalizedEmployeeId.length < 3) {
      normalizedEmployeeId = normalizedEmployeeId.padStart(3, '0');
    }

    if (
      // !email ||
       !password || !fullName || !employeeId || !department || !role) {
      const response: AuthResponse = {
        success: false,
        message: '所有欄位都是必填的',
        error: '請填寫所有必要欄位'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 密碼強度驗證
    if (password.length < 6) {
      const response: AuthResponse = {
        success: false,
        message: '密碼長度至少需要6個字元',
        error: '密碼過短'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 電子郵件格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response: AuthResponse = {
        success: false,
        message: '請輸入有效的電子郵件地址',
        error: '電子郵件格式無效'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 前端已經處理過員工編號標準化，直接使用傳入的值
    console.log('使用的員工編號:', normalizedEmployeeId);

    // 建立新使用者
    const newUser = await userDB.createUser({
      email,
      password,
      fullName, 
      employeeId: normalizedEmployeeId,
      department,
      role,
    });

    if (!newUser) {
      const response: AuthResponse = {
        success: false,
        message: `註冊失敗，員工編號 ${employeeId} 可能已存在，請使用不同的員工編號`,
        error: '使用者建立失敗 - 可能是重複的員工編號'
      };
      return NextResponse.json(response, { status: 409 });
    }

    // 生成 JWT Token
    const token = generateToken({
      id: newUser.id,
      fullName: newUser.fullName,
      employeeId: newUser.employeeId,
      department: newUser.department,
      role: newUser.role
    });

    const response: AuthResponse = {
      success: true,
      message: '註冊成功',
      user: newUser,
      token
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('註冊錯誤:', error);
    const response: AuthResponse = {
      success: false,
      message: '註冊失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
