'use client';

import { useState } from 'react';

interface PhoneVerifyProps {
  onVerified: (phoneNumber: string) => void;
  className?: string;
}

export default function PhoneVerify({ onVerified, className = '' }: PhoneVerifyProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 發送驗證碼
  const sendVerificationCode = async (type: 'sms' | 'voice' | 'whatsapp' = 'sms') => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/phone-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, type })
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        setStep('verify');
        startCountdown();
      }

    } catch {
      setMessage('發送失敗，請檢查網路連線');
    } finally {
      setLoading(false);
    }
  };

  // 驗證驗證碼
  const verifyCode = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/phone-verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code: verificationCode })
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        onVerified(phoneNumber);
      }

    } catch {
      setMessage('驗證失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  // 倒數計時
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {step === 'phone' && (
        <>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              手機號碼 *
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="例: 0912345678"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button
              onClick={() => sendVerificationCode('sms')}
              disabled={loading || !phoneNumber}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              📱 {loading ? '發送中...' : '簡訊'}
            </button>

            <button
              onClick={() => sendVerificationCode('whatsapp')}
              disabled={loading || !phoneNumber}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              💬 WhatsApp
            </button>
            
            <button
              onClick={() => sendVerificationCode('voice')}
              disabled={loading || !phoneNumber}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              📞 語音
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            推薦使用 WhatsApp - 免費、快速、可靠
          </p>
        </>
      )}

      {step === 'verify' && (
        <>
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
              驗證碼 *
            </label>
            <input
              id="verificationCode"
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              placeholder="請輸入6位數驗證碼"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              驗證碼已發送至 {phoneNumber}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={verifyCode}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? '驗證中...' : '驗證'}
            </button>

            <button
              onClick={() => sendVerificationCode('sms')}
              disabled={countdown > 0 || loading}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
            >
              {countdown > 0 ? `${countdown}s` : '重新發送'}
            </button>

            <button
              onClick={() => setStep('phone')}
              className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
            >
              修改號碼
            </button>
          </div>
        </>
      )}

      {message && (
        <div className={`p-3 rounded ${
          message.includes('成功') || message.includes('已發送') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
