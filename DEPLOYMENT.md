# 部署說明 - 免費雲端方案

## 方案一：Vercel (最推薦)

✅ 完全免費
✅ 自動 HTTPS
✅ 全球 CDN
✅ 自動部署
✅ 支援 PWA

### 部署步驟：

1. 前往 https://vercel.com
2. 使用 GitHub 帳號註冊/登入
3. 點擊 "New Project"
4. 上傳您的專案資料夾或連接 Git
5. Vercel 會自動偵測 Next.js 並部署
6. 完成後會得到一個 `.vercel.app` 網址

### 特點：

- 網址格式：`your-project.vercel.app`
- 支援自訂網域名稱
- 自動 SSL 憑證
- 全球快速存取

---

## 方案二：Netlify

✅ 免費版每月 100GB 流量
✅ 自動 HTTPS
✅ 全球 CDN

### 部署步驟：

1. 前往 https://netlify.com
2. 註冊帳號
3. 拖拉您的 `.next` 資料夾到網站
4. 或連接 Git 自動部署

---

## 方案三：GitHub Pages + GitHub Actions

✅ 完全免費
✅ 與 GitHub 整合

### 需要額外設定 Static Export：

```javascript
// next.config.ts 需要修改
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

---

## 手機安裝 PWA 步驟：

### iOS (Safari):

1. 開啟您的網站
2. 點擊分享按鈕 📤
3. 選擇「加入主畫面」
4. 確認安裝

### Android (Chrome):

1. 開啟您的網站
2. 點擊右上角選單 ⋮
3. 選擇「安裝應用程式」或「加到主畫面」
4. 確認安裝

---

## 建議流程：

1. **立即使用**: 部署到 Vercel (5 分鐘內完成)
2. **測試**: 在手機瀏覽器開啟網址
3. **安裝**: 將 PWA 加入主畫面
4. **分享**: 網址可以直接分享給其他人

## 網址特性：

- 可以被 Google 搜索到
- 支援分享連結
- 手機瀏覽器直接開啟
- 可安裝為手機 APP
- 離線基本功能可用
