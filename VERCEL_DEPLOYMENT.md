# Vercel 部署完整指南

## 📋 部署前準備檢查清單

✅ 專案已建構成功  
✅ PWA 配置完成  
✅ Mock 資料庫運作正常  
✅ 環境變數範本已準備

## 🚀 Vercel 部署步驟

### 方法一：拖拉部署（最簡單）

1. **前往 Vercel**

   - 打開 https://vercel.com
   - 使用 GitHub/Google 帳號註冊/登入

2. **上傳專案**

   - 點擊 "New Project"
   - 選擇 "Browse All Templates"
   - 將整個專案資料夾拖拉到頁面上

3. **設定專案**

   - Project Name: `leave-apply-system` (或您想要的名稱)
   - Framework: 會自動偵測為 Next.js
   - Root Directory: `.` (預設即可)

4. **環境變數設定**

   - 在部署設定頁面，找到 "Environment Variables"
   - 新增：`JWT_SECRET` = `your-super-secret-jwt-key-2024-leave-system`
   - 新增：`NODE_ENV` = `production`

5. **部署**
   - 點擊 "Deploy"
   - 等待 2-3 分鐘建構完成

### 方法二：Git 連接（推薦長期使用）

1. **建立 Git Repository**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub**

   - 在 GitHub 建立新的 repository
   - 按照 GitHub 指示推送程式碼

3. **在 Vercel 連接 GitHub**
   - 選擇 "Import Git Repository"
   - 授權 Vercel 存取您的 GitHub
   - 選擇剛建立的 repository

## 🌐 部署後獲得的網址

部署成功後，您會獲得：

- **主要網址**: `your-project-name.vercel.app`
- **預覽網址**: 每次更新會產生新的預覽網址
- **自訂網域**: 可以設定自己的網域名稱

## 📱 手機測試步驟

1. **開啟網址**

   - 在手機瀏覽器輸入您的 Vercel 網址

2. **測試 PWA 安裝**

   - iOS Safari: 分享 → 加入主畫面
   - Android Chrome: 選單 → 安裝應用程式

3. **測試功能**
   - 註冊新帳號
   - 登入系統
   - 申請請假
   - 查看我的請假

## ⚙️ 環境變數管理

在 Vercel Dashboard:

1. 進入您的專案
2. 點擊 "Settings" 標籤
3. 選擇 "Environment Variables"
4. 新增必要的變數：

```
JWT_SECRET=your-super-secret-jwt-key-2024-leave-system
NODE_ENV=production
```

## 🔄 自動部署設定

如果使用 Git 連接：

- 每次推送到 `main` 分支會自動部署
- Pull Request 會產生預覽網址
- 支援多個環境（開發/測試/正式）

## 🗄️ 未來 Neon.tech 資料庫整合

當您準備好使用雲端資料庫時：

1. **註冊 Neon.tech**

   - 前往 https://neon.tech
   - 建立免費帳號

2. **建立資料庫**

   - 選擇區域（建議選擇離您較近的）
   - 記錄連線字串

3. **更新環境變數**

   - 在 Vercel 設定中新增 `POSTGRES_URL`
   - 取消註解 `lib/neonDatabase.ts` 中的程式碼
   - 更新 API 路由使用 Neon 資料庫

4. **初始化資料庫**
   - 執行資料庫遷移腳本
   - 匯入初始資料

## 🎯 完成後的功能

✅ 全球可存取的網址  
✅ HTTPS 安全連線  
✅ PWA 手機安裝  
✅ 自動備份和版本控制  
✅ 無限流量（Vercel 免費方案）  
✅ 自動 CDN 加速

## 🆘 常見問題

**Q: 部署失敗怎麼辦？**
A: 檢查 Vercel 的建構日誌，通常是環境變數或程式碼錯誤

**Q: 網址可以自訂嗎？**
A: 可以，在專案設定中可以設定自訂網域

**Q: 如何更新程式碼？**
A: 如果用 Git，直接推送新程式碼。如果是拖拉，重新上傳資料夾

**Q: 資料會消失嗎？**
A: 目前使用 Mock 資料，重新部署會重置。整合 Neon.tech 後資料會永久保存

---

🎉 **準備好了嗎？開始部署您的請假系統到全世界！**
