# 通用郵件 SMTP 設定指南

## 📧 支援的郵件服務商

此系統現在支援 **任何 SMTP 郵件服務**，不再限制於 Gmail！

### 🌟 **主要優勢**

- ✅ **支援所有郵件服務商** - Gmail, Outlook, Yahoo, 企業郵件等
- ✅ **無服務商限制** - 可用任何 SMTP 伺服器
- ✅ **企業郵件友善** - 支援自有網域郵件
- ✅ **靈活設定** - 完全可自訂的 SMTP 參數

## 🔧 **常見郵件服務商設定**

### Gmail

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASSWORD="your-gmail-app-password"  # 需要應用程式密碼
SMTP_FROM_EMAIL="your-gmail@gmail.com"
SMTP_FROM_NAME="請假系統"
```

**Gmail 設定步驟**:

1. 啟用兩步驟驗證
2. 產生應用程式密碼
3. 使用應用程式密碼，不是帳戶密碼

### Microsoft Outlook/Hotmail

```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@outlook.com"
SMTP_PASSWORD="your-outlook-password"
SMTP_FROM_EMAIL="your-email@outlook.com"
SMTP_FROM_NAME="請假系統"
```

### Yahoo Mail

```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@yahoo.com"
SMTP_PASSWORD="your-yahoo-app-password"  # 需要應用程式密碼
SMTP_FROM_EMAIL="your-email@yahoo.com"
SMTP_FROM_NAME="請假系統"
```

### 企業郵件 (cPanel/WHM)

```env
SMTP_HOST="mail.your-domain.com"
SMTP_PORT="587"                    # 或 465, 25
SMTP_SECURE="false"               # 587用false, 465用true
SMTP_USER="noreply@your-domain.com"
SMTP_PASSWORD="your-email-password"
SMTP_FROM_EMAIL="noreply@your-domain.com"
SMTP_FROM_NAME="Your Company 請假系統"
```

### QQ 郵箱 (中國用戶)

```env
SMTP_HOST="smtp.qq.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-qq-number@qq.com"
SMTP_PASSWORD="your-qq-authorization-code"  # 需要授權碼
SMTP_FROM_EMAIL="your-qq-number@qq.com"
SMTP_FROM_NAME="請假系統"
```

### 163 郵箱 (中國用戶)

```env
SMTP_HOST="smtp.163.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@163.com"
SMTP_PASSWORD="your-163-authorization-code"  # 需要授權碼
SMTP_FROM_EMAIL="your-email@163.com"
SMTP_FROM_NAME="請假系統"
```

## ⚙️ **SMTP 參數說明**

### 基本參數

- **SMTP_HOST**: SMTP 伺服器地址
- **SMTP_PORT**: 連接埠 (587=TLS, 465=SSL, 25=無加密)
- **SMTP_USER**: 郵件帳號
- **SMTP_PASSWORD**: 郵件密碼或應用程式密碼

### 安全設定

- **SMTP_SECURE**:
  - `"true"` → 使用 SSL (通常配合 port 465)
  - `"false"` → 使用 TLS 或無加密 (通常配合 port 587)
- **SMTP_REQUIRE_TLS**:
  - `"true"` → 強制使用 TLS 加密
  - `"false"` → 不強制，但會自動偵測

### 顯示設定

- **SMTP_FROM_EMAIL**: 發件人郵件地址
- **SMTP_FROM_NAME**: 發件人顯示名稱

## 🚀 **快速設定步驟**

### 步驟 1: 選擇郵件服務商

選擇您要使用的郵件服務商，並查看上方對應的設定範例。

### 步驟 2: 準備郵件帳號

- 確保有可用的郵件帳號
- 如果是 Gmail/Yahoo，需要設定應用程式密碼
- 如果是企業郵件，確認 SMTP 設定

### 步驟 3: 複製環境變數

```bash
cp .env.example .env.local
```

### 步驟 4: 填入 SMTP 設定

根據您的郵件服務商，修改 `.env.local` 中的 SMTP 設定。

### 步驟 5: 測試發送

重啟應用並測試忘記密碼功能。

## 🔍 **疑難排解**

### 常見錯誤 1: 認證失敗

```
Error: Invalid login: 535 Authentication failed
```

**解決方法**:

- 檢查帳號密碼是否正確
- Gmail/Yahoo 需要使用應用程式密碼，不是帳戶密碼
- 確認是否啟用了兩步驟驗證

### 常見錯誤 2: 連接被拒

```
Error: Connection refused
```

**解決方法**:

- 檢查 SMTP_HOST 和 SMTP_PORT 是否正確
- 嘗試不同的連接埠 (587, 465, 25)
- 檢查防火牆設定

### 常見錯誤 3: TLS/SSL 錯誤

```
Error: unable to verify the first certificate
```

**解決方法**:

- 檢查 SMTP_SECURE 設定
- port 587 通常用 `SMTP_SECURE="false"`
- port 465 通常用 `SMTP_SECURE="true"`

### 常見錯誤 4: 被標記為垃圾郵件

**解決方法**:

- 使用企業網域郵件而非免費郵件
- 設定 SPF/DKIM 記錄
- 避免在主旨或內容中使用可疑字詞

## 📊 **推薦服務商比較**

| 服務商   | 免費額度 | 設定難度 | 企業友善   | 送達率     |
| -------- | -------- | -------- | ---------- | ---------- |
| Gmail    | 免費     | ⭐⭐⭐   | ⭐⭐       | ⭐⭐⭐⭐⭐ |
| Outlook  | 免費     | ⭐⭐⭐⭐ | ⭐⭐⭐     | ⭐⭐⭐⭐   |
| 企業郵件 | 付費     | ⭐⭐     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| Yahoo    | 免費     | ⭐⭐     | ⭐⭐       | ⭐⭐⭐     |

## 💡 **最佳實踐建議**

### 企業環境

- 使用企業網域郵件 (如 `noreply@yourcompany.com`)
- 設定專用的系統郵件帳號
- 配置 SPF 和 DKIM 記錄

### 個人/小型專案

- Gmail 或 Outlook 免費帳號已足夠
- 記得使用應用程式密碼
- 定期檢查是否被標記為垃圾郵件

### 安全考量

- 不要在程式碼中寫死郵件密碼
- 使用環境變數儲存敏感資訊
- 定期更換應用程式密碼

現在您可以使用任何郵件服務商了！🎉
