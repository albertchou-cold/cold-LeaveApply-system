import { NextRequest, NextResponse } from 'next/server';
import { LeaveApplicationResponse } from '@/app/types/leave';
import { leaveDB, initializeDatabase } from '@/lib/database';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';
import { SessionUser } from '@/app/types/auth';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = getTokenFromHeader(authHeader);
  let sessionUser: SessionUser | null = null;

  if (token) {
    sessionUser = verifyToken(token);

    console.log("user data  :" , sessionUser);
    if (sessionUser) {
      console.log('Current user in GET /leave:', sessionUser);
    } else {
      console.warn('Invalid token supplied to GET /leave');
    }
  } else {
    console.warn('No authorization header supplied to GET /leave');
  }

  // 必須有 token 才能查詢
  if (!sessionUser) {
    const response: LeaveApplicationResponse = {
      success: false,
      message: '未授權，請先登入',
      error: '缺少有效的驗證 token'
    };
    return NextResponse.json(response, { status: 401 });
  }

  try {
    // 強制只能查詢登入者自己的資料
    const employeeId = sessionUser.employeeId;

    const applications = await leaveDB.getApplicationsByEmployeeId(employeeId);

    // 過濾掉已同步的記錄
    // const filteredApplications = applications.filter(app => !app.is_synced);
    const filteredApplications = applications;

    const response: LeaveApplicationResponse = {
      success: true,
      message: '成功獲取請假申請',
      data: filteredApplications
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: LeaveApplicationResponse = {
      success: false,
      message: '獲取請假申請失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 確保資料庫表格存在
    await initializeDatabase();
    
    const body = await request.json();
    const { employeeId, employeeName, leaveType, startDate, endDate, reason , applyFolderLink, authposition, positionarea } = body;

    // 簡單的驗證
    if (!employeeId || !employeeName || !leaveType || !startDate || !endDate || !reason) {
      const response: LeaveApplicationResponse = {
        success: false,
        message: '缺少必要欄位',
        error: '請填寫所有必要欄位'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 驗證日期
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      const response: LeaveApplicationResponse = {
        success: false,
        message: '結束日期不能早於開始日期',
        error: '日期範圍無效'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const newApplication = await leaveDB.createApplication({
      employeeId,
      employeeName,
      leaveType,
      startDate,
      endDate,
      reason,
      applyFolderLink,
      authposition,
      positionarea,
      RandomUniqueId: crypto.randomUUID() 
    });

    if (!newApplication) {
      const response: LeaveApplicationResponse = {
        success: false,
        message: '提交請假申請失敗',
        error: '資料庫操作失敗'
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: LeaveApplicationResponse = {
      success: true,
      message: '請假申請提交成功',
      data: newApplication
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: LeaveApplicationResponse = {
      success: false,
      message: '提交請假申請失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
