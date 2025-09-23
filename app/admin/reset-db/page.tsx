// 資料庫管理工具
// 檔案位置: app/admin/reset-db/page.tsx

'use client';

import { useState } from 'react';

export default function ResetDatabase() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const resetDatabase = async () => {
    if (!confirm('確定要重置資料庫嗎？這將刪除所有資料！')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/reset-db', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('錯誤: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const clearLeaveApplications = async () => {
    if (!confirm('確定要清除所有請假記錄嗎？')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/clear-leaves', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('錯誤: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-6">
            🚨 資料庫管理工具
          </h1>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={clearLeaveApplications}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              {loading ? '處理中...' : '清除請假記錄'}
            </button>
            
            <button
              onClick={resetDatabase}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? '處理中...' : '重置整個資料庫'}
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">執行結果：</h3>
            <pre className="whitespace-pre-wrap text-sm">
              {result || '尚未執行任何操作'}
            </pre>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <h3 className="font-bold mb-2">注意事項：</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>清除請假記錄：只刪除 leave_applications 表格資料</li>
              <li>重置資料庫：刪除所有資料並重新初始化</li>
              <li>管理員帳號會被保留</li>
              <li>此操作無法復原，請謹慎使用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
