"use client";

import Link from "next/link";
import { useAuth } from '@/app/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    !user ? (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {t('homepage.title')}
          </h1>
          <h6 className="text-m font-bold text-gray-800 mb-10">
            {t('homepage.guestSubtitle')}
          </h6>
          <div className="space-y-4">
            <Link
              href="/leave"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 text-center"
            >
              📝 {t('homepage.leaveApplication')}
            </Link>
            
            <div className="flex space-x-2">
              <Link
                href="/login"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 text-center"
              >
                🔑 {t('homepage.login')}
              </Link>
              {/* <Link
                href="/register"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 text-center"
              >
                📋 {t('homepage.register')}
              </Link> */}
            </div>
            
            {/* <div className="text-center pt-4">
              <Link 
                href="/reset-password" 
                className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition font-medium"
              >
                🔐 忘記密碼？
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
    ) : (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t('homepage.title')}
            </h1>
            <p className="text-gray-600 mb-10">
              {t('homepage.subtitle', { name: user?.fullName || 'User' })}
            </p>
            <div className="space-y-4">
              <Link
                href="/leave"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 text-center"
              >
                📝 {t('homepage.leaveApplication')}
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    )
  );
}
