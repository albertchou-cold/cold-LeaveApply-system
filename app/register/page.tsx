'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRegistrationRequest, UserRole } from '@/app/types/auth';
import "../data.json"
import memberInfo from '../data.json';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserRegistrationRequest>({
    email: '',
    password: '',
    fullName: '',
    employeeId: '',
    authposition: [],
    positionarea: [],
    // department: '',
    role: UserRole.EMPLOYEE,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [memberId , setMemberId] = useState<string>('');
  const [employeeName, setEmployeeName] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const { name, value } = e.target;
    setFormData(prev => {
      let newRole = prev.role;
      switch (memberId) {
        case '349':
          newRole = UserRole.MANAGER;
          break;
        default:
          newRole = UserRole.EMPLOYEE;
      }

      return {
        ...prev,
        [name]: value,
        role: newRole
      };
    });
  };

  const handleFindEmployeeName = (inputValue = memberId, shouldPadZeros = false) => {
    let foundEmployeeName = "";
    let searchId = inputValue;
    
    // 只有在明確要求時才補零（例如失去焦點時）
    if (shouldPadZeros && inputValue && inputValue.length < 3) {
      searchId = inputValue.padStart(3, '0'); // 補零到3位數
      setMemberId(searchId);
    }
    
    // 查找員工姓名 - 先試原始輸入，如果找不到再試補零版本
    Object.entries(memberInfo.memberInfo).forEach(([id, empName]) => {
      if (id === searchId) {
        foundEmployeeName = empName;
      }
    });
    
    // 如果沒找到且長度小於3，也試試補零版本
    if (!foundEmployeeName && inputValue.length < 3) {
      const paddedId = inputValue.padStart(3, '0');
      Object.entries(memberInfo.memberInfo).forEach(([id, empName]) => {
        if (id === paddedId) {
          foundEmployeeName = empName;
        }
      });
    }
    
    setEmployeeName(foundEmployeeName);
    setFormData(prev => {
      return {
        ...prev,
        employeeId: searchId,
        fullName: foundEmployeeName
      };
    });
  }

  // 當輸入框失去焦點時才補零
  const handleEmployeeIdBlur = () => {
    handleFindEmployeeName(memberId, true); // 傳入 true 表示要補零
  }

  // 輸入時實時搜索但不補零
  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMemberId(value);
    handleFindEmployeeName(value, false); // 實時搜索但不補零
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 驗證密碼確認
    if (formData.password !== confirmPassword) {
      setError('密碼與確認密碼不符');
      return;
    }
    setLoading(true);
    
    console.log('提交的表單數據:', formData);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // 儲存 token 到 localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        alert('註冊成功！');
        router.push('/login'); // 導向登入頁面
      } else {
        setError(data.message || '註冊失敗');
      }
    } catch (error) {
      setError('註冊失敗: ' + (error instanceof Error ? error.message : '未知錯誤'));
    } finally {
      setLoading(false);
    }
  };

const departments = [
  "財務處",
  "法務專利處",
  "安衛環處",
  "生產管理組",
  "馬達組",
  "廠務處",
  "設備保養處",
  "模組與產品製造處",
  "產品測試處",
  "電芯製造處",
  "品保處",
  "研發二處",
  "研發一處",
  "管理二處",
  "管理一處"
];



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          建立新帳號
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          或{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            登入現有帳號
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
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                員工編號 *
              </label>
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                required
                value={memberId}
                onChange={handleEmployeeIdChange}
                onBlur={handleEmployeeIdBlur}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如：158 或 1"
              />
              {employeeName && (
                <p className="mt-1 text-sm text-green-600">✓ 找到員工: {employeeName}</p>
              )}
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                真實姓名 *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                disabled
                value={employeeName}
                required
                readOnly
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="請輸入員工編號自動帶出姓名"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                電子郵件 *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                // required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="請輸入電子郵件"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密碼 *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="請輸入密碼（至少6個字元）"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                確認密碼 *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="請再次輸入密碼"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                部門 *
              </label>
              <select
                id="authposition"
                name="authposition"
                required
                value={formData.authposition}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">請選擇部門</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {loading ? '註冊中...' : '註冊'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
