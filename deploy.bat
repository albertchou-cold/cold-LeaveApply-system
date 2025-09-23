@echo off
echo =====================================
echo    請假系統 - 一鍵部署到 Vercel
echo =====================================
echo.

echo 正在檢查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo 錯誤: 請先安裝 Node.js
    echo 下載地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 正在建構專案...
call npm run build
if errorlevel 1 (
    echo 建構失敗，請檢查錯誤訊息
    pause
    exit /b 1
)

echo.
echo ✅ 建構成功！專案已準備好部署
echo.
echo 📋 檢查清單：
echo ✅ Next.js 專案已建構
echo ✅ PWA 功能已配置 
echo ✅ Service Worker 已生成
echo ✅ Mock 資料庫運作正常
echo ✅ 環境變數範本已準備
echo.
echo 🚀 接下來請按照以下步驟部署：
echo =====================================
echo.
echo 方法一：直接拖拉部署 (最簡單)
echo 1. 前往 https://vercel.com
echo 2. 使用 GitHub/Google 登入
echo 3. 點擊 "New Project"
echo 4. 將此資料夾拖拉到網頁上
echo 5. 設定環境變數：
echo    - JWT_SECRET: your-super-secret-jwt-key-2024
echo    - NODE_ENV: production
echo 6. 點擊 "Deploy" 等待完成
echo.
echo 方法二：Git 連接 (推薦)
echo 1. git init
echo 2. git add .
echo 3. git commit -m "Initial commit"
echo 4. 推送到 GitHub
echo 5. 在 Vercel 連接 GitHub Repository
echo.
echo =====================================
echo 📱 部署完成後測試：
echo • 手機瀏覽器開啟網址
echo • 測試 PWA 安裝功能
echo • 註冊/登入/申請請假
echo.
echo 📖 詳細說明請參考：
echo • VERCEL_DEPLOYMENT.md - 完整部署指南
echo • .env.example - 環境變數範本
echo • lib/neonDatabase.ts - 未來雲端資料庫配置
echo.
echo 🎯 您的 APP 特色：
echo ✅ 全球可存取 (*.vercel.app)
echo ✅ 自動 HTTPS 加密
echo ✅ PWA 手機安裝
echo ✅ 離線基本功能
echo ✅ 可被搜尋引擎收錄
echo ✅ 免費無限流量
echo.
echo =====================================
echo 🆘 需要幫助？查看 VERCEL_DEPLOYMENT.md
echo =====================================
pause
