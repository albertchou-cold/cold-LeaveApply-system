'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 此頁面已被 /reset-password 取代
// 自動重定向到新的重設密碼頁面
export default function ForgotPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 立即重定向到新的重設密碼頁面
    router.replace('/reset-password');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在重定向到新的重設密碼頁面...</p>
            <p className="text-sm text-gray-500 mt-2">
              如果沒有自動跳轉，請 
              <a href="/reset-password" className="text-blue-600 hover:text-blue-500 underline">
                點擊這裡
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
