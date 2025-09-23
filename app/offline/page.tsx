'use client';

export default function Offline() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25V6M12 18v3.75M21.75 12H18M6 12H2.25" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          目前無網路連線
        </h1>
        
        <p className="text-gray-600 mb-6">
          請檢查您的網路連線狀態，或稍後再試。
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200"
          >
            🔄 重新整理頁面
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-md transition duration-200"
          >
            ← 回到上一頁
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            離線功能
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✅ 瀏覽已載入的頁面</li>
            <li>✅ 查看快取的資料</li>
            <li>❌ 提交新的請假申請</li>
            <li>❌ 登入/註冊功能</li>
          </ul>
        </div>
        
        <div className="mt-6 text-xs text-gray-400">
          請假申請系統 - PWA 版本
        </div>
      </div>
    </div>
  );
}
