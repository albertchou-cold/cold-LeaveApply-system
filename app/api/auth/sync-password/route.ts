import { NextRequest, NextResponse } from 'next/server';
import { userDB } from '@/lib/database';
import bcrypt from 'bcryptjs';

// 外部系統密碼同步 API
export async function PUT(request: NextRequest) {
  try {
    const { apiKey, employeeId, newPassword } = await request.json();
    
    // 驗證 API Key (確保只有授權的系統可以調用)
    if (apiKey !== process.env.SYNC_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        message: '未授權的請求' 
      }, { status: 401 });
    }
    
    // 驗證必要欄位
    if (!employeeId || !newPassword) {
      return NextResponse.json({ 
        success: false, 
        message: '缺少必要欄位' 
      }, { status: 400 });
    }
    
    // 更新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await userDB.updatePasswordByEmployeeId(employeeId, hashedPassword);
    
    if (!result) {
      return NextResponse.json({ 
        success: false, 
        message: '用戶不存在或更新失敗' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '密碼同步成功',
      updatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('密碼同步錯誤:', error);
    return NextResponse.json({ 
      success: false, 
      message: '同步失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    }, { status: 500 });
  }
}
