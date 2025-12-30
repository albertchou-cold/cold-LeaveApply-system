import { NextResponse } from 'next/server';

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

