# Firebase Phone Authentication 完整整合指南

## 📱 Firebase Phone Auth 在 Next.js 中的完整實作

### 🚨 **重要注意事項**

Firebase Phone Authentication 需要針對不同平台做設定：

#### Web 應用程式 (您的情況)

- ✅ **相對簡單** - 只需要 reCAPTCHA 設定
- ✅ **無需行動裝置憑證**
- ⚠️ **但仍需 Firebase 專案完整設定**

#### 行動裝置應用 (如果未來需要)

- ❌ **iOS**: 需要 APNs 憑證、Apple Developer 帳戶
- ❌ **Android**: 需要 SHA-1 指紋、Google Play Console

## 🔧 **Step 1: Firebase 專案設定**

### 1.1 建立 Firebase 專案

```bash
1. 前往 https://console.firebase.google.com/
2. 點擊「建立專案」
3. 輸入專案名稱：「leave-apply-system」
4. 啟用 Google Analytics (建議)
5. 選擇 Analytics 帳戶 (或建立新的)
```

### 1.2 添加 Web 應用程式

```bash
1. 在專案概覽中，點擊 Web 圖示 (</>)
2. 輸入應用程式暱稱：「Leave System Web」
3. 勾選「同時為此應用程式設定 Firebase Hosting」(可選)
4. 點擊「註冊應用程式」
5. 複製配置物件備用
```

### 1.3 啟用 Authentication

```bash
1. 在左側選單選擇 Authentication
2. 點擊「開始使用」
3. 進入「Sign-in method」頁籤
4. 啟用「電話號碼」登入方式
5. 在「授權網域」中加入您的網域 (localhost:3000, your-domain.com)
```

## 🔧 **Step 2: 安裝 Firebase SDK**

```bash
npm install firebase
```

## 🔧 **Step 3: Firebase 配置檔案**

### 3.1 建立 Firebase 配置

```typescript
// lib/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firebase Authentication
export const auth = getAuth(app);

export default app;
```

### 3.2 環境變數設定

```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdefghijklmnop"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

## 🔧 **Step 4: Firebase Phone Auth 服務**

### 4.1 建立 Phone Auth 服務

```typescript
// lib/firebase-phone-auth.ts
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  ApplicationVerifier,
} from "firebase/auth";
import { auth } from "@/lib/firebase-config";

export class FirebasePhoneAuth {
  private static recaptchaVerifier: RecaptchaVerifier | null = null;
  private static confirmationResult: ConfirmationResult | null = null;

  // 初始化 reCAPTCHA
  static initializeRecaptcha(
    containerId: string = "recaptcha-container"
  ): RecaptchaVerifier {
    if (this.recaptchaVerifier) {
      return this.recaptchaVerifier;
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA 已解決");
      },
      "expired-callback": () => {
        console.log("reCAPTCHA 已過期");
        this.recaptchaVerifier = null;
      },
    });

    return this.recaptchaVerifier;
  }

  // 發送驗證碼
  static async sendVerificationCode(phoneNumber: string): Promise<{
    success: boolean;
    message: string;
    confirmationResult?: ConfirmationResult;
  }> {
    try {
      // 確保電話號碼格式正確 (台灣 +886)
      const formattedPhone = phoneNumber.startsWith("+886")
        ? phoneNumber
        : "+886" + phoneNumber.substring(1);

      // 初始化 reCAPTCHA
      const recaptchaVerifier = this.initializeRecaptcha();

      // 發送驗證碼
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier
      );

      // 存儲結果供後續驗證使用
      this.confirmationResult = confirmationResult;

      return {
        success: true,
        message: "驗證碼已發送至您的手機",
        confirmationResult,
      };
    } catch (error: any) {
      console.error("Firebase 發送驗證碼失敗:", error);

      // 重置 reCAPTCHA
      this.resetRecaptcha();

      if (error.code === "auth/invalid-phone-number") {
        return { success: false, message: "無效的電話號碼格式" };
      } else if (error.code === "auth/too-many-requests") {
        return { success: false, message: "請求過於頻繁，請稍後再試" };
      } else if (error.code === "auth/quota-exceeded") {
        return { success: false, message: "SMS 配額已用完" };
      }

      return { success: false, message: "發送失敗: " + error.message };
    }
  }

  // 驗證驗證碼
  static async verifyCode(code: string): Promise<{
    success: boolean;
    message: string;
    phoneNumber?: string;
  }> {
    if (!this.confirmationResult) {
      return {
        success: false,
        message: "請先發送驗證碼",
      };
    }

    try {
      const result = await this.confirmationResult.confirm(code);

      return {
        success: true,
        message: "驗證成功",
        phoneNumber: result.user.phoneNumber || undefined,
      };
    } catch (error: any) {
      console.error("Firebase 驗證失敗:", error);

      if (error.code === "auth/invalid-verification-code") {
        return { success: false, message: "驗證碼錯誤" };
      } else if (error.code === "auth/code-expired") {
        return { success: false, message: "驗證碼已過期，請重新發送" };
      }

      return { success: false, message: "驗證失敗: " + error.message };
    }
  }

  // 重置 reCAPTCHA
  static resetRecaptcha(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }

  // 清理資源
  static cleanup(): void {
    this.resetRecaptcha();
  }
}
```

## 🔧 **Step 5: 整合到忘記密碼系統**

### 5.1 修改 API 路由支援 Firebase

```typescript
// app/api/auth/forgot-password/route.ts (修改版)
import { NextRequest, NextResponse } from "next/server";
import { userDB } from "@/lib/database";
import { EmailService } from "@/lib/email-service";
import { TwilioService } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    const { email, phone, method } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "請提供電子郵件" },
        { status: 400 }
      );
    }

    const user = await userDB.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "如果該帳號存在，驗證碼已發送",
      });
    }

    // 生成驗證碼
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    try {
      if (method === "firebase" && phone) {
        // 使用 Firebase Phone Auth
        // 注意: Firebase 在客戶端處理，這裡只返回成功訊息
        return NextResponse.json({
          success: true,
          message: "請在前端完成 Firebase 驗證",
          method: "firebase",
          useFirebase: true,
        });
      } else if (method === "sms" && phone) {
        // 使用 Twilio SMS
        const result = await TwilioService.sendSMS(phone);
        return NextResponse.json({
          success: result.success,
          message: result.message,
          method: "twilio",
        });
      } else {
        // 預設使用 Email
        const result = await EmailService.sendVerificationCode(email);
        return NextResponse.json({
          success: result.success,
          message: result.success
            ? "驗證碼已發送至您的電子郵件"
            : "發送失敗，請稍後再試",
          method: "email",
        });
      }
    } catch (error) {
      console.error("發送驗證碼失敗:", error);
      return NextResponse.json(
        { success: false, message: "發送失敗，請稍後再試" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("處理忘記密碼請求失敗:", error);
    return NextResponse.json(
      { success: false, message: "系統錯誤，請稍後再試" },
      { status: 500 }
    );
  }
}
```

## 🔧 **Step 6: 前端整合 Firebase**

### 6.1 修改忘記密碼頁面

```tsx
// app/forgot-password/page.tsx (Firebase 支援版)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebasePhoneAuth } from '@/lib/firebase-phone-auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<'email' | 'sms' | 'firebase'>('email');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // 清理 Firebase 資源
    return () => {
      FirebasePhoneAuth.cleanup();
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (method === 'firebase' && phone) {
        // 使用 Firebase Phone Auth
        const result = await FirebasePhoneAuth.sendVerificationCode(phone);

        if (result.success) {
          setStep('verify');
          setMessage(result.message);
          setIsSuccess(true);
        } else {
          setMessage(result.message);
          setIsSuccess(false);
        }
      } else {
        // 使用其他方法 (Email/Twilio)
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, phone, method }),
        });

        const data = await response.json();
        setMessage(data.message);
        setIsSuccess(data.success);

        if (data.success && method === 'sms') {
          setStep('verify');
        }
      }
    } catch (error) {
      setMessage('發送失敗，請稍後再試');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (method === 'firebase') {
        // 驗證 Firebase 驗證碼
        const result = await FirebasePhoneAuth.verifyCode(verificationCode);

        if (result.success) {
          setMessage('驗證成功！請設定新密碼。');
          setIsSuccess(true);
          // 導向密碼重設頁面
          // router.push(\`/reset-password?token=firebase_verified&phone=\${result.phoneNumber}\`);
        } else {
          setMessage(result.message);
          setIsSuccess(false);
        }
      } else {
        // 處理其他驗證方法
        // TODO: 實作 Twilio/Email 驗證
      }
    } catch (error) {
      setMessage('驗證失敗，請重試');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          忘記密碼
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          選擇驗證方式找回密碼
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* reCAPTCHA 容器 */}
          <div id="recaptcha-container"></div>

          {message && (
            <div className={\`mb-4 p-4 rounded \${
              isSuccess
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }\`}>
              {message}
            </div>
          )}

          {step === 'input' ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              {/* 驗證方式選擇 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  選擇驗證方式
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={method === 'email'}
                      onChange={(e) => setMethod(e.target.value as any)}
                      className="mr-2"
                    />
                    📧 電子郵件驗證 (免費)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="firebase"
                      checked={method === 'firebase'}
                      onChange={(e) => setMethod(e.target.value as any)}
                      className="mr-2"
                    />
                    📱 Firebase 簡訊驗證 (免費額度)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="sms"
                      checked={method === 'sms'}
                      onChange={(e) => setMethod(e.target.value as any)}
                      className="mr-2"
                    />
                    💰 Twilio 簡訊驗證 (付費)
                  </label>
                </div>
              </div>

              {/* 電子郵件輸入 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  電子郵件地址
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="請輸入您的電子郵件"
                />
              </div>

              {/* 手機號碼輸入 (簡訊驗證時) */}
              {(method === 'firebase' || method === 'sms') && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    手機號碼
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0912345678"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {loading ? '發送中...' : '發送驗證碼'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  驗證碼
                </label>
                <input
                  id="code"
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="請輸入 6 位數驗證碼"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {loading ? '驗證中...' : '驗證'}
              </button>

              <button
                type="button"
                onClick={() => setStep('input')}
                className="w-full text-center text-blue-600 hover:text-blue-500"
              >
                返回重新發送
              </button>
            </form>
          )}

          <div className="text-center space-y-2 mt-6">
            <Link href="/login" className="block text-blue-600 hover:text-blue-500">
              返回登入頁面
            </Link>
            <Link href="/" className="block text-gray-600 hover:text-gray-500">
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🚨 **注意事項與限制**

### Web 版本限制

1. **reCAPTCHA 必須**: 每次發送都需要 reCAPTCHA 驗證
2. **網域限制**: 只能在授權網域使用
3. **配額限制**: 有每日/每月發送限制

### 安全考量

1. **電話號碼驗證**: 只能用於驗證，不是完整登入
2. **結合現有系統**: 需要與您的用戶資料庫整合
3. **錯誤處理**: 需要完整的錯誤處理機制

### 成本考量

1. **Firebase 免費額度**: 10,000 次驗證/月
2. **超過免費額度**: 需要付費
3. **替代方案**: Email 驗證作為備援

## 🎯 **實作建議**

### 階段性實作

1. **階段 1**: 先實作 Email 驗證 (簡單可靠)
2. **階段 2**: 再加入 Firebase (如果需要簡訊功能)
3. **階段 3**: 最後考慮 Twilio (付費但更可靠)

### 用戶體驗考量

- 讓用戶選擇驗證方式
- 提供清楚的成本說明
- 有備援方案 (Email)

要開始實作 Firebase 嗎？還是先專注在 Email 驗證？
