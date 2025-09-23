# 台灣地區 SMS 服務商比較 📱

## 免費或接近免費的 SMS 服務選項

### 🆓 完全免費方案

#### 1. **Firebase Phone Authentication**

- ✅ **免費額度**: 10,000 次驗證/月 (永久免費)
- ✅ **適用場景**: OTP 驗證碼 (完全符合需求)
- ✅ **覆蓋範圍**: 全球包含台灣
- ✅ **集成難度**: 中等 (Google 服務)
- ❌ **限制**: 只能用於電話驗證，不能發送自定義訊息

#### 2. **AWS SNS 免費層**

- ✅ **免費額度**: 100 SMS/月 (永久免費)
- ✅ **台灣支援**: 是
- ✅ **適用場景**: 小型應用驗證
- ❌ **限制**: 額度很少，超過後較貴

### 💰 低成本付費方案

#### 1. **Twilio** (國際服務)

- 💵 **台灣 SMS**: ~$0.05 USD/則 (~NT$1.5)
- ✅ **免費試用**: $15 USD (約 300 則)
- ✅ **穩定性**: 極高
- ✅ **API 品質**: 業界標準
- ✅ **全球覆蓋**: 最廣

#### 2. **三竹資訊 (Mitake)**

- 💵 **價格**: 約 NT$1.2-1.8/則 (依量而定)
- ✅ **台灣本土**: 服務在地化
- ✅ **中文支援**: 完整
- ✅ **企業客戶**: 眾多
- ❌ **無免費額度**

#### 3. **簡訊王 (KOT SMS)**

- 💵 **價格**: 約 NT$1.0-1.5/則
- ✅ **台灣本土**: 在地服務
- ✅ **API 支援**: 有
- ❌ **無免費額度**

#### 4. **Infobip** (國際服務)

- 💵 **台灣 SMS**: ~$0.04-0.06 USD/則
- ✅ **企業級**: 穩定性高
- ✅ **全球服務**: 覆蓋廣
- ❌ **無免費額度**

### 🎯 建議方案組合

#### 方案 A: 完全免費 (推薦給小型應用)

```
1. 主力: Firebase Phone Auth (10,000次/月)
2. 備用: Email 驗證 (Gmail SMTP)
3. 成本: $0
```

#### 方案 B: 混合免費+付費 (推薦給中型應用)

```
1. 主力: Firebase Phone Auth (10,000次/月)
2. 超量: Twilio ($15 試用 + 後續付費)
3. 備用: Email 驗證
4. 成本: 前期 $0，後期按需付費
```

#### 方案 C: 本土化服務 (推薦給企業應用)

```
1. 主力: 三竹資訊 (本土化服務)
2. 備用: Email 驗證
3. 成本: ~NT$1.2/則起
```

## 🔧 實作建議

### Firebase Phone Auth 整合範例

```typescript
// lib/firebase-auth.ts
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase-config";

export class FirebasePhoneAuth {
  static async sendVerificationCode(phoneNumber: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // 設置 reCAPTCHA 驗證器
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA 通過
          },
        }
      );

      // 發送驗證碼
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );

      // 存儲確認結果供後續使用
      window.confirmationResult = confirmationResult;

      return {
        success: true,
        message: "驗證碼已發送",
      };
    } catch (error) {
      console.error("Firebase 發送失敗:", error);
      return {
        success: false,
        message: "發送失敗",
      };
    }
  }

  static async verifyCode(code: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const result = await window.confirmationResult.confirm(code);
      return {
        success: !!result.user,
        message: "驗證成功",
      };
    } catch (error) {
      return {
        success: false,
        message: "驗證碼錯誤",
      };
    }
  }
}
```

### 多層級備援方案

```typescript
// lib/multi-tier-sms.ts
export class MultiTierSMSService {
  static async sendVerificationCode(phone: string, email: string) {
    // 1. 嘗試 Firebase (免費)
    try {
      const firebaseResult = await FirebasePhoneAuth.sendVerificationCode(
        phone
      );
      if (firebaseResult.success) {
        return { ...firebaseResult, method: "firebase", cost: 0 };
      }
    } catch (error) {
      console.log("Firebase 失敗，嘗試下一個");
    }

    // 2. 嘗試 Twilio (付費)
    try {
      const twilioResult = await TwilioService.sendSMS(phone);
      if (twilioResult.success) {
        return { ...twilioResult, method: "twilio", cost: 0.05 };
      }
    } catch (error) {
      console.log("Twilio 失敗，降級到 Email");
    }

    // 3. 降級到 Email (免費)
    const emailResult = await EmailService.sendVerificationCode(email);
    return {
      ...emailResult,
      method: "email",
      cost: 0,
      fallback: true,
      message: "簡訊發送失敗，驗證碼已發送至 Email",
    };
  }
}
```

## 📊 成本效益分析

| 服務商              | 免費額度  | 付費價格      | 穩定性     | 設定難度   | 推薦度     |
| ------------------- | --------- | ------------- | ---------- | ---------- | ---------- |
| Firebase Phone Auth | 10,000/月 | 無            | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ |
| AWS SNS             | 100/月    | ~$0.75/100 則 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐⭐     |
| Twilio              | $15 試用  | ~$0.05/則     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| 三竹資訊            | 無        | ~NT$1.2/則    | ⭐⭐⭐⭐   | ⭐⭐⭐     | ⭐⭐⭐     |
| Gmail SMTP          | 無限      | 免費          | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🏆 最終建議

對於您的小型應用，**最佳方案**：

1. **主力**: Firebase Phone Authentication (10,000 免費額度)
2. **備用**: Gmail SMTP Email 驗證 (完全免費)
3. **優點**: 完全免費，每月可處理 10,000 次驗證

這個組合可以讓您：

- ✅ 零成本運營
- ✅ 高可靠性 (Google 服務)
- ✅ 用戶體驗佳 (即時簡訊)
- ✅ 有備援方案 (Email)

需要我幫您實作 Firebase Phone Authentication 嗎？
