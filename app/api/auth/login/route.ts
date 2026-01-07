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
    const { userId, password } = body;

    // 缺少資料庫連線字串時，避免嘗試連線到 127.0.0.1:5432（Vercel 會失敗）
    if (!process.env.DATABASE_URL) {
      const response: AuthResponse = {
        success: false,
        message: '伺服器未設定資料庫連線，請聯絡管理員設定 DATABASE_URL 後再試',
        error: 'Missing DATABASE_URL in server environment'
      };
      return NextResponse.json(response, { status: 500 });
    }

    // 標準化：僅移除前後空白，避免自動補零造成編號不一致
    const memberIdCheck = (userId || '').trim();

    // 簡單的驗證
    if (!userId || !password) {
      const response: AuthResponse = {
        success: false,
        message: '請輸入員工編號和密碼',
        error: '缺少必要欄位'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 驗證使用者 (使用 employeeId 作為 username 來查詢)
    const user = await userDB.authenticateUser(memberIdCheck, password);

    if (!user) {
      const response: AuthResponse = {
        success: false,
        message: '員工編號或密碼錯誤',
        error: '驗證失敗'
      };
      return NextResponse.json(response, { status: 401 });
    }

    // 生成 JWT Token
    const token = generateToken({
      id: user.id,
      fullName: user.fullName,
      employeeId: user.employeeId,
      authposition: user.authposition,
      positionarea: user.positionarea,
      role: user.role
    });

    const response: AuthResponse = {
      success: true,
      message: '登入成功',
      user,
      token
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('登入錯誤:', error);
    const response: AuthResponse = {
      success: false,
      message: '登入失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
