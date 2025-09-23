'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: 輸入郵件 2: 輸入驗證碼和新密碼
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // 發送驗證碼
  const sendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('請輸入郵件地址');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setStep(2); // 進入第二步：輸入驗證碼
      } else {
        setError(data.message || '發送失敗');
      }
    } catch {
      setError('網路錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 重置密碼
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword || !confirmPassword) {
      setError('請填寫所有欄位');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('兩次輸入的密碼不一致');
      return;
    }

    if (newPassword.length < 6) {
      setError('密碼長度至少需要 6 位');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('密碼重置成功！即將跳轉到登入頁面...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || '重置失敗');
      }
    } catch {
      setError('網路錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">重置密碼</h1>
          <p className="text-gray-600">
            {step === 1 ? '輸入您的郵件地址以接收驗證碼' : '輸入驗證碼並設定新密碼'}
          </p>
        </div>

        {/* 步驟 1: 輸入郵件地址 */}
        {step === 1 && (
          <form onSubmit={sendVerificationCode} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                郵件地址
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="請輸入您的郵件地址"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '發送中...' : '發送驗證碼'}
            </button>
          </form>
        )}

        {/* 步驟 2: 輸入驗證碼和新密碼 */}
        {step === 2 && (
          <form onSubmit={resetPassword} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              驗證碼已發送至：<strong>{email}</strong>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                驗證碼
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="請輸入 6 位數驗證碼"
                maxLength={6}
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                新密碼
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="請輸入新密碼（至少 6 位）"
                minLength={6}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                確認新密碼
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="請再次輸入新密碼"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                返回
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? '重置中...' : '重置密碼'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={sendVerificationCode}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 text-sm underline"
              >
                重新發送驗證碼
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link 
            href="/login" 
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← 返回登入頁面
          </Link>
        </div>
      </div>
    </div>
  );
}
