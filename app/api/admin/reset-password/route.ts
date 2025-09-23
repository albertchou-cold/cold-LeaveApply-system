import { NextResponse } from 'next/server';

// 管理員重置用戶密碼功能 - 暫時停用
// 保留代碼以備未來使用

export async function POST() {
  return NextResponse.json({
    success: false,
    message: '此功能暫時停用',
    status: 'disabled'
  }, { status: 503 }); // 503 Service Unavailable
}

export async function PUT() {
  return NextResponse.json({
    success: false,
    message: '批量重置功能暫時停用',
    status: 'disabled'
  }, { status: 503 });
}

/*
=== 保留的原始代碼 (已停用) ===

import { userDB } from '@/lib/database';

// 管理員重置用戶密碼
async function postHandler(request: NextRequest) {
  try {
    const { employeeId, tempPassword, adminEmployeeId } = await request.json();

    if (!employeeId || !adminEmployeeId) {
      return NextResponse.json({
        success: false,
        message: '缺少必要參數'
      }, { status: 400 });
    }

    // 驗證管理員權限 (可以加入更嚴格的驗證)
    const admin = await userDB.getUserByEmployeeId(adminEmployeeId);
    if (!admin || !['admin', 'manager'].includes(admin.role)) {
      return NextResponse.json({
        success: false,
        message: '權限不足'
      }, { status: 403 });
    }

    // 執行密碼重置
    const result = await userDB.adminResetPassword(employeeId, tempPassword);

    if (result.success) {
      // 記錄操作日誌
      console.log(`管理員 ${adminEmployeeId} 重置了員工 ${employeeId} 的密碼`);
      
      return NextResponse.json({
        success: true,
        message: result.message,
        tempPassword: result.tempPassword,
        resetTime: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 404 });
    }

  } catch (error) {
    console.error('管理員重置密碼 API 錯誤:', error);
    return NextResponse.json({
      success: false,
      message: '重置失敗'
    }, { status: 500 });
  }
}

// 批量重置密碼
async function putHandler(request: NextRequest) {
  try {
    const { employeeIds, adminEmployeeId } = await request.json();

    if (!employeeIds || !Array.isArray(employeeIds) || !adminEmployeeId) {
      return NextResponse.json({
        success: false,
        message: '無效的參數'
      }, { status: 400 });
    }

    // 驗證管理員權限
    const admin = await userDB.getUserByEmployeeId(adminEmployeeId);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: '只有系統管理員可以批量重置密碼'
      }, { status: 403 });
    }

    const results = [];
    
    for (const employeeId of employeeIds) {
      const result = await userDB.adminResetPassword(employeeId);
      results.push({
        employeeId,
        ...result
      });
    }

    return NextResponse.json({
      success: true,
      message: `成功處理 ${employeeIds.length} 個員工的密碼重置`,
      results
    });

  } catch (error) {
    console.error('批量重置密碼 API 錯誤:', error);
    return NextResponse.json({
      success: false,
      message: '批量重置失敗'
    }, { status: 500 });
  }
}

*/
