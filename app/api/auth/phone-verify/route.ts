// Phone verification API - Disabled
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Phone verification is currently disabled' },
    { status: 503 }
  );
}