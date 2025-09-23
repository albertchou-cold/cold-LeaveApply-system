// # Firebase Phone Authentication 完整整合指南

// ## 📱 Firebase Phone Auth 在 Next.js 中的完整實作

// ### 🚨 **重要注意事項**

// Firebase Phone Authentication 需要針對不同平台做設定：

// #### Web 應用程式 (您的情況)
// - ✅ **相對簡單** - 只需要 reCAPTCHA 設定
// - ✅ **無需行動裝置憑證**
// - ⚠️ **但仍需 Firebase 專案完整設定**

// #### 行動裝置應用 (如果未來需要)
// - ❌ **iOS**: 需要 APNs 憑證、Apple Developer 帳戶
// - ❌ **Android**: 需要 SHA-1 指紋、Google Play Console

// ## 🔧 **Step 1: Firebase 專案設定**

// ### 1.1 建立 Firebase 專案

// ```bash
// 1. 前往 https://console.firebase.google.com/
// 2. 點擊「建立專案」
// 3. 輸入專案名稱：「leave-apply-system」
// 4. 啟用 Google Analytics (建議)
// 5. 選擇 Analytics 帳戶 (或建立新的)
// ```

// ### 1.2 添加 Web 應用程式

// ```bash
// 1. 在專案概覽中，點擊 Web 圖示 (</>)
// 2. 輸入應用程式暱稱：「Leave System Web」
// 3. 勾選「同時為此應用程式設定 Firebase Hosting」(可選)
// 4. 點擊「註冊應用程式」
// 5. 複製配置物件備用
// ```

// ### 1.3 啟用 Authentication

// ```bash
// 1. 在左側選單選擇 Authentication
// 2. 點擊「開始使用」
// 3. 進入「Sign-in method」頁籤
// 4. 啟用「電話號碼」登入方式
// 5. 在「授權網域」中加入您的網域 (localhost:3000, your-domain.com)
// ```

// ## 🔧 **Step 2: 安裝 Firebase SDK**

// ```bash
// npm install firebase
// ```

// ## 🔧 **Step 3: Firebase 配置檔案**

// ### 3.1 建立 Firebase 配置

// <function_calls>
// <invoke name="create_file">
// <parameter name="content">// lib/firebase-config.ts
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
// };

// // 初始化 Firebase
// const app = initializeApp(firebaseConfig);

// // 初始化 Firebase Authentication
// export const auth = getAuth(app);

// export default app;
