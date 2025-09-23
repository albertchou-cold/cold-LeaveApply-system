'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyLeavePage() {
  const router = useRouter();

  useEffect(() => {
    // 隱藏管理請假申請頁面 - 重定向到首頁
    router.push('/');
  }, [router]);

  // 返回空的載入畫面
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">正在重定向...</p>
      </div>
    </div>
  );
}
