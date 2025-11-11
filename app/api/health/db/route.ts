import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

// 簡單的資料庫健康檢查：連線並執行 SELECT 1
export async function GET() {
  try {
    const result = await db.query('SELECT 1 as ok');
    return NextResponse.json({
      status: 'healthy',
      db: 'connected',
      result: result.rows?.[0] ?? null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      db: 'disconnected',
      error: error instanceof Error ? error.message : 'unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
