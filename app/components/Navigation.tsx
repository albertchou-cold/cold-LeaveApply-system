'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-gray-800">{t('loading')}</div>
          </div>
        </div>
      </nav>
    );
  }

  

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-800">
            <svg width="113" height="20" viewBox="0 0 113 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.39718 7.85478V7.85954V11.5929V12.2095C4.39718 13.1619 4.78776 14.0738 5.48296 14.7476C6.17816 15.4214 7.119 15.8 8.10161 15.8H31.8635V20.0072H11.6439C9.78187 20.0072 7.99844 19.2905 6.68174 18.0143L4.39718 15.8L2.22807 13.6976L1.42233 12.9167C0.550265 12.0714 0.05896 10.9238 0.05896 9.7262C0.05896 8.53097 0.550265 7.38097 1.42233 6.53573L2.22807 5.75478L6.68174 1.43811C7.99844 0.161918 9.78187 -0.554749 11.6439 -0.554749H31.8635V3.65239H8.10161C7.119 3.65239 6.17816 4.03097 5.48296 4.70477C4.78776 5.37858 4.39718 6.29049 4.39718 7.24287V7.85478ZM106.267 1.43811L110.72 5.75478V5.75716L111.526 6.53811C112.398 7.38335 112.889 8.53097 112.889 9.72859C112.889 10.9238 112.398 12.0738 111.526 12.9191L110.72 13.7L108.551 15.8024L106.267 18.0167C104.95 19.2929 103.167 20.0095 101.304 20.0095H81.0848V-0.554749H101.304C103.167 -0.554749 104.95 0.161918 106.267 1.43811ZM85.4255 15.8024H104.847C105.829 15.8024 106.77 15.4238 107.465 14.75C108.161 14.0762 108.551 13.1643 108.551 12.2119V11.5953V7.85716V7.24049C108.551 6.28811 108.161 5.3762 107.465 4.70239C106.77 4.02858 105.829 3.65001 104.847 3.65001H85.4255V15.8024ZM70.6054 14.7524C69.9102 14.0786 69.5196 13.1667 69.5196 12.2143V11.5976V-0.554749H65.1789V9.24287C65.1789 10.75 65.7955 12.1953 66.896 13.2595L67.348 13.6976L69.5171 15.8L72.0989 18.3024C73.224 19.3929 74.7495 20.0048 76.3413 20.0048H76.7639H78.8077V15.7976H73.2215C72.2389 15.7976 71.2981 15.4191 70.6029 14.7453L70.6054 14.7524ZM56.2887 1.43811L60.7424 5.75478L61.5482 6.53573C62.4202 7.38097 62.9115 8.52858 62.9115 9.7262C62.9115 10.9214 62.4202 12.0714 61.5482 12.9167L60.7424 13.6976L56.2887 18.0143C54.9721 19.2905 53.1886 20.0072 51.3266 20.0072H42.8393C40.9772 20.0072 39.1938 19.2905 37.8771 18.0143L35.5926 15.8L33.4234 13.6976L32.6177 12.9167C31.7456 12.0714 31.2543 10.9238 31.2543 9.7262C31.2543 8.53097 31.7456 7.38097 32.6177 6.53573L33.4234 5.75478L37.8771 1.43811C39.1938 0.161918 40.9772 -0.554749 42.8393 -0.554749H51.3266C53.1886 -0.554749 54.9721 0.161918 56.2887 1.43811ZM39.297 15.8024H54.8689C55.8515 15.8024 56.7923 15.4238 57.4875 14.75C58.1827 14.0762 58.5733 13.1643 58.5733 12.2119V11.5953V7.85716V7.24049C58.5733 6.28811 58.1827 5.3762 57.4875 4.70239C56.7923 4.02858 55.8515 3.65001 54.8689 3.65001H39.297C38.3144 3.65001 37.3735 4.02858 36.6783 4.70239C35.9831 5.3762 35.5926 6.28811 35.5926 7.24049V7.85716V11.5953V12.2119C35.5926 13.1643 35.9831 14.0762 36.6783 14.75C37.3735 15.4238 38.3144 15.8024 39.297 15.8024Z" fill="currentColor"></path>
            </svg>
          </Link>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <>
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    pathname === '/'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {t('navigation.home')}
                </Link>
                <Link
                  href="/leave"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    pathname === '/leave'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {t('navigation.leave')}
                </Link>
                {/* <Link
                  href="/my-leave"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    pathname === '/my-leave'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {t('leave.applications')}
                </Link> */}
                
                {/* 用戶信息顯示在右上方 */}
                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium text-gray-800">{user.fullName}</div>
                    <div className="text-xs text-gray-500">
                      {user.employeeId} · {user.role === 'admin' ? t('auth.role') : user.role === 'manager' ? 'Manager' : 'Employee'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition duration-200"
                  >
                    {t('navigation.logout')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    pathname === '/login'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    pathname === '/register'
                      ? 'bg-green-100 text-green-700'
                      : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                  }`}
                >
                  {t('auth.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
