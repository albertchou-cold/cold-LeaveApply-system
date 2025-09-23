# Neon.tech 雲端資料庫設定指南

## 🗄️ 為什麼選擇 Neon.tech？

✅ **完全免費方案**：每月 3GB 儲存空間  
✅ **PostgreSQL 相容**：支援標準 SQL  
✅ **自動備份**：資料安全有保障  
✅ **全球 CDN**：快速存取  
✅ **與 Vercel 完美整合**

## 📝 設定步驟

### 第一步：註冊 Neon.tech

1. 前往 https://neon.tech
2. 點擊 "Sign up"
3. 使用 GitHub 帳號登入（推薦）

### 第二步：建立資料庫

1. **建立新專案**

   - Project Name: `leave-apply-system`
   - Database Name: `leave_db`
   - Region: 選擇 `US East (Ohio)` 或 `Europe (Frankfurt)`

2. **獲取連線字串**
   - 複製 "Connection string"
   - 格式：`postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/leave_db?sslmode=require`

### 第三步：設定環境變數

1. **在 Vercel Dashboard**
   - 進入您的專案設定
   - Environment Variables 頁面
   - 新增以下變數：

```
POSTGRES_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/leave_db?sslmode=require
POSTGRES_PRISMA_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/leave_db?sslmode=require&pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/leave_db?sslmode=require
```

### 第四步：啟用雲端資料庫

1. **修改 lib/neonDatabase.ts**

   - 移除檔案開頭的註解
   - 取消註解所有函數

2. **更新 API 路由**

   - 將 `import mockDatabase` 改為 `import { neonDatabase }`
   - 替換所有 `mockDatabase` 呼叫為 `neonDatabase`

3. **初始化資料庫**
   - 部署後第一次存取會自動建立表格
   - 或手動執行 SQL 腳本

## 🔄 遷移步驟（從 Mock 到 Neon）

### 程式碼修改清單

1. **API Routes 更新**

   ```typescript
   // 之前
   import { mockDatabase } from "@/lib/mockDatabase";

   // 更新為
   import { neonDatabase } from "@/lib/neonDatabase";
   ```

2. **函數呼叫更新**

   ```typescript
   // 之前
   const user = await mockDatabase.users.findByUsername(username);

   // 更新為
   const user = await neonDatabase.findUserByUsername(username);
   ```

### 需要修改的檔案

- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/me/route.ts`
- `app/api/leave/route.ts`
- `app/api/leave/[id]/route.ts`

## 📊 資料庫結構

### Users 表格

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Leave Applications 表格

```sql
CREATE TABLE leave_applications (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    approved_by VARCHAR(100) NULL,
    rejected_at TIMESTAMP NULL,
    rejected_by VARCHAR(100) NULL,
    rejection_reason TEXT NULL
);
```

## 🧪 測試資料庫連線

建立測試頁面 `app/test-db/page.tsx`：

```typescript
"use client";

import { useState } from "react";

export default function TestDatabase() {
  const [result, setResult] = useState("");

  const testConnection = async () => {
    try {
      const response = await fetch("/api/test-db");
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult("連線失敗: " + error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">資料庫連線測試</h1>
      <button
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        測試連線
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded">{result}</pre>
    </div>
  );
}
```

## 🚨 注意事項

1. **免費方案限制**

   - 3GB 儲存空間
   - 10,000 行資料限制
   - 每月 100 小時運算時間

2. **安全性**

   - 連線字串包含密碼，請妥善保管
   - 不要將環境變數提交到 Git

3. **效能優化**
   - 使用連線池提升效能
   - 建立適當的索引
   - 避免 N+1 查詢問題

## 🔄 回滾至 Mock 資料庫

如果需要回滾：

1. 註解掉 Neon 相關程式碼
2. 恢復 Mock 資料庫 import
3. 移除環境變數中的資料庫連線字串

---

💡 **準備好升級到雲端資料庫了嗎？按照此指南即可無縫遷移！**
