import { NextRequest, NextResponse } from 'next/server';
import { AuthResponse } from '@/app/types/auth';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { userDB } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      const response: AuthResponse = {
        success: false,
        message: '未提供認證 Token',
        error: '需要登入'
      };
      return NextResponse.json(response, { status: 401 });
    }

    const sessionUser = verifyToken(token);
    if (!sessionUser) {
      const response: AuthResponse = {
        success: false,
        message: 'Token 無效或已過期',
        error: '需要重新登入'
      };
      return NextResponse.json(response, { status: 401 });
    }

    // 從資料庫獲取最新的使用者資訊
    const user = await userDB.getUserById(sessionUser.id);
    if (!user) {
      const response: AuthResponse = {
        success: false,
        message: '找不到使用者',
        error: '使用者不存在'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: AuthResponse = {
      success: true,
      message: '成功獲取使用者資訊',
      user
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('獲取使用者資訊錯誤:', error);
    const response: AuthResponse = {
      success: false,
      message: '獲取使用者資訊失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
