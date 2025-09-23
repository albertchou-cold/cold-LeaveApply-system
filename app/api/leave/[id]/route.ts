import { NextRequest, NextResponse } from 'next/server';
import { LeaveApplicationResponse, LeaveStatus } from '@/app/types/leave';
import { leaveDB } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = await leaveDB.getApplicationById(id);

    if (!application) {
      const response: LeaveApplicationResponse = {
        success: false,
        message: '找不到該請假申請',
        error: '請假申請不存在'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: LeaveApplicationResponse = {
      success: true,
      message: '成功獲取請假申請',
      data: application
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, managerId } = body;

    // 驗證狀態
    if (!Object.values(LeaveStatus).includes(status)) {
      const response: LeaveApplicationResponse = {
        success: false,
        message: '無效的狀態',
        error: '請提供有效的狀態值'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const updatedApplication = await leaveDB.updateApplicationStatus(
      id,
      status,
      managerId,
      // rejectionReason
    );

    if (!updatedApplication) {
      const response: LeaveApplicationResponse = {
        success: false,
        message: '找不到該請假申請',
        error: '請假申請不存在'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: LeaveApplicationResponse = {
      success: true,
      message: '請假申請狀態更新成功',
      data: updatedApplication
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: LeaveApplicationResponse = {
      success: false,
      message: '更新請假申請失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await leaveDB.deleteApplication();

    // 假設 deleteApplication 若找不到會丟出錯誤，否則直接回傳成功

    const response: LeaveApplicationResponse = {
      success: true,
      message: '請假申請刪除成功'
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: LeaveApplicationResponse = {
      success: false,
      message: '刪除請假申請失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    };

    return NextResponse.json(response, { status: 500 });
  }
}
