'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserLoginRequest } from '@/app/types/auth';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<UserLoginRequest>({
    userId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    

      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // 使用 useAuth 的 login 函數
        login(data.user, data.token);
        alert(t('auth.loginSuccess'));
        router.push('/leave'); // 導向請假系統
      } else {
        setError(data.message || t('auth.loginError'));
      }
    } catch (error) {
      setError(t('auth.loginError') + ': ' + (error instanceof Error ? error.message : '未知錯誤'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('auth.loginTitle')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("accountYet")}{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            {t('auth.register')}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                {t('auth.employeeId')}
              </label>
              <input
                id="userId"
                name="userId"
                type="text"
                required
                value={formData.userId}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.employeeIdPlaceholder')}
              />
            </div>

            <div className='mb-20'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>

            <div >
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {loading ? t('loading') : t('auth.loginButton')}
              </button>
            </div>
            
            {/* <div className="text-center">
              <Link 
                href="/reset-password" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                忘記密碼？
              </Link>
            </div> */}
          </form>

          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
