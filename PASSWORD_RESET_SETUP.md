# 密碼重設系統設定指南

## 概述

已建立簡化的雙重驗證密碼重設系統，結合免費的 Email 服務和付費的 Twilio SMS 服務。

## 🔧 設定步驟

### 1. 郵件 SMTP 設定 (免費，必須設定)

現在支援 **任何郵件服務商**！不再限制於 Gmail。

1. **選擇郵件服務商**

   - Gmail, Outlook, Yahoo, 企業郵件等
   - 任何支援 SMTP 的郵件服務

2. **準備郵件帳號**

   - Gmail: 需要應用程式密碼 (啟用兩步驟驗證後設定)
   - Outlook: 使用帳戶密碼即可
   - 企業郵件: 聯絡管理員取得 SMTP 設定

3. **環境變數設定**

   ```env
   # 通用 SMTP 設定
   SMTP_HOST="smtp.gmail.com"                    # 您的 SMTP 伺服器
   SMTP_PORT="587"                               # 連接埠
   SMTP_SECURE="false"                           # 587用false, 465用true
   SMTP_USER="your-email@gmail.com"              # 郵件帳號
   SMTP_PASSWORD="your-app-password"             # 郵件密碼
   SMTP_FROM_EMAIL="your-email@gmail.com"        # 發件人地址
   SMTP_FROM_NAME="請假系統"                      # 發件人名稱
   ```

4. **📋 詳細設定指南**
   - 參考 `UNIVERSAL_EMAIL_SETUP.md` 查看各種郵件服務商的設定範例
   - 包含 Gmail、Outlook、Yahoo、企業郵件等完整設定

### 2. SMS 驗證選項 (多種方案)

#### 選項 A: Firebase Phone Auth (免費，推薦！)

1. **完全免費額度**

   - 10,000 次驗證/月 (永久免費)
   - 適合小型到中型應用
   - Google 服務，穩定性高

2. **Web 版設定步驟 (簡單)**

   - 前往 [Firebase Console](https://console.firebase.google.com/)
   - 創建專案並啟用 Authentication
   - 啟用電話號碼登入方式
   - 設定 reCAPTCHA (自動處理)
   - 取得 Web 配置金鑰

3. **環境變數設定**

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
   ```

4. **⚠️ 行動裝置注意事項**
   - iOS: 需要 APNs 憑證設定
   - Android: 需要 SHA-1 指紋設定
   - **Web 版本無需額外設定** ✅

#### 選項 B: Twilio (付費，有試用額度)

1. **註冊 Twilio 帳戶**

   - 前往 [Twilio Console](https://console.twilio.com/)
   - 註冊並取得免費 $15 試用額度

2. **建立 Verify 服務**

   - 前往 Console → Verify → Services
   - 點擊「Create new Service」
   - 輸入服務名稱，例如：「Leave System」
   - 複製 Service SID

3. **環境變數設定**
   ```env
   TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxx"
   TWILIO_AUTH_TOKEN="your_auth_token"
   TWILIO_VERIFY_SERVICE_SID="VAxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

#### 選項 C: 台灣本土服務商 (付費)

**三竹資訊** - 價格約 NT$1.2-1.8/則  
**簡訊王** - 價格約 NT$1.0-1.5/則  
**詳細比較**: 參考 `SMS_ALTERNATIVES_TAIWAN.md`

## 📱 使用方式

### 前端呼叫範例

```javascript
// 使用 Firebase Phone Auth (免費，推薦)
const response = await fetch("/api/auth/forgot-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    phone: "+886912345678",
    method: "firebase",
  }),
});

// 使用 Email 驗證 (免費)
const response = await fetch("/api/auth/forgot-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    method: "email",
  }),
});

// 使用 Twilio SMS 驗證 (付費)
const response = await fetch("/api/auth/forgot-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    phone: "+886912345678",
    method: "sms",
  }),
});
```

### 智能降級機制

- **優先順序**: Firebase (免費) → Twilio (付費) → Email (免費)
- 如果選擇 Firebase 但未設定 → 自動使用 Email
- 如果 Firebase 發送失敗 → 自動降級到 Email
- Email 為最終備援，確保系統基本功能可用

## 💰 成本分析

### Firebase Phone Auth (推薦！)

- ✅ **完全免費** (10,000 次/月)
- ✅ 適合小型到中型應用
- ✅ Google 服務，穩定性極高
- ✅ 即時收到
- ✅ 用戶體驗最佳

### Email (通用 SMTP)

- ✅ **完全免費** (大部分服務商)
- ✅ **支援所有郵件服務商** - Gmail, Outlook, Yahoo, 企業郵件等
- ✅ **設定靈活** - 不再限制於特定服務
- ✅ **企業友善** - 可使用公司網域郵件
- ❌ 較慢（用戶需檢查信箱）

### Twilio SMS

- ❌ **付費服務**
- 台灣 SMS: ~$0.05 USD/則
- 免費試用額度: $15 (約 300 則)
- ✅ 即時收到
- ✅ 用戶體驗較佳

### 台灣本土服務

- ❌ **付費服務**
- 三竹資訊: ~NT$1.2-1.8/則
- 簡訊王: ~NT$1.0-1.5/則
- ✅ 中文支援完整
- ✅ 在地化服務
- 📋 詳細比較: 參考 `SMS_ALTERNATIVES_TAIWAN.md`

## 🛡️ 安全特性

1. **防止用戶枚舉攻擊**

   - 即使帳號不存在也返回成功訊息

2. **驗證碼時效性**

   - Email: 驗證碼 10 分鐘有效
   - SMS: Twilio 預設 10 分鐘有效

3. **密碼雜湊**
   - 使用 bcrypt 單向雜湊
   - 重設時建立新密碼，無法恢復舊密碼

## 🚀 部署建議

### 開發環境

- 僅設定 SMTP 即可進行開發
- 在 console 中可看到驗證碼（用於測試）

### 正式環境

- **必須**設定 SMTP 郵件服務
- **建議**設定 Twilio（提升用戶體驗）
- 移除 console.log 中的敏感資訊

## 📁 相關檔案

- `lib/email-service.ts` - Email 驗證服務
- `lib/twilio.ts` - SMS 驗證服務
- `app/api/auth/forgot-password/route.ts` - 密碼重設 API
- `.env.example` - 環境變數範例

## 🔄 後續開發

1. 建立密碼重設前端頁面
2. 實作驗證碼驗證 API
3. 建立新密碼設定頁面
4. 添加驗證碼存儲到資料庫
5. 建立管理員密碼重設功能（如需要）

這個系統提供了靈活的驗證方式，可以根據預算選擇使用免費的 Email 或付費的 SMS 服務。
