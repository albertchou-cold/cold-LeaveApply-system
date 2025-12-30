import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻譯資源
const resources = {
  zh: {
    translation: {
      // 通用
      "loading": "載入中...",
      "save": "儲存",
      "cancel": "取消",
      "confirm": "確認",
      "submit": "提交",
      "submitting": "提交中...",
      "delete": "刪除",
      "edit": "編輯",
      "view": "查看",
      "search": "搜尋",
      "filter": "篩選",
      "refresh": "重新整理",
      "back": "返回",
      "next": "下一步",
      "previous": "上一步",
      "close": "關閉",
      "language": "語言",
      "noInfo": "目前沒有請假申請記錄",
      "accountYet": "還沒有帳號? ",
      "inputSomething": "請輸入內容",
      "approve": "核准",
      "reject": "拒絕",
      
      // 首頁
      "homepage": {
        "title": "長庚國際能源請假申請系統",
        "subtitle": "歡迎回來，{{name}}！",
        "guestSubtitle": "企業請假申請與使用者管理系統",
        "leaveApplication": "請假申請系統",
        "login": "登入",
        "register": "註冊",
        "systemManagement": "系統管理"
      },
      
      // 導航
      "navigation": {
        "home": "首頁",
        "leave": "請假管理",
        "admin": "系統管理",
        "profile": "個人資料",
        "logout": "登出"
      },
      
      // 認證
      "auth": {
        "login": "登入",
        "register": "註冊",
        "logout": "登出",
        "employeeId": "員工編號",
        "password": "密碼",
        "confirmPassword": "確認密碼",
        "fullName": "姓名",
        "email": "電子郵件",
        "department": "部門",
        "role": "角色",
        "loginTitle": "系統登入",
        "registerTitle": "使用者註冊",
        "loginButton": "登入系統",
        "registerButton": "註冊帳號",
        "loginSubtitle": "請輸入您的員工編號和密碼",
        "registerSubtitle": "請填寫以下資訊完成註冊",
        "employeeIdPlaceholder": "例如: 001",
        "passwordPlaceholder": "請輸入密碼",
        "confirmPasswordPlaceholder": "請再次輸入密碼",
        "fullNamePlaceholder": "請輸入您的姓名",
        "emailPlaceholder": "example@company.com",
        "loginError": "登入失敗，請檢查員工編號和密碼",
        "loginSuccess": "登入成功！",
        "registerError": "註冊失敗，請檢查輸入資訊",
        "registerSuccess": "註冊成功！正在為您登入...",
        "passwordMismatch": "密碼確認不符",
        "requiredField": "此欄位為必填"
      },
      
      // 請假申請
      "leave": {
        "application": "請假申請",
        "applications": "請假申請列表",
        "newApplication": "新增請假申請",
        "employeeId": "員工編號",
        "employeeName": "員工姓名",
        "type": "請假類型",
        "startDate": "開始日期時間",
        "endDate": "結束日期時間",
        "reason": "請假原因",
        "reasonTips": "請先將檔案放置於GOOGLE雲端硬碟，並將連結放在此處",
        "applyFolderLink": "申請資料夾連結",
        "status": "狀態",
        "appliedAt": "申請時間",
        "approvedAt": "核准時間",
        "approvedBy": "核准人",
        "rejectedAt": "拒絕時間",
        "rejectedBy": "拒絕人",
        "rejectionReason": "拒絕原因",
        "submitting": "提交中...",
        "submitApplication": "提交申請",
        "employeeIdPlaceholder": "例如: EMP001",
        "employeeNamePlaceholder": "請輸入您的姓名",
        "reasonPlaceholder": "請詳細說明請假原因...",
        "applyFolderLinkPlaceholder": "請輸入申請資料夾連結...",
        "approve": "核准",
        "reject": "拒絕",
        "pending": "待審核",
        "approved": "已核准",
        "rejected": "已拒絕",
        "cancelled": "已取消",
        "types": {
          "annual": "年假",
          "sick": "病假", 
          "personal": "事假",
          "maternity": "產假",
          "paternity": "陪產假",
          "compensatory": "補休"
        },
        "folderLink": "請假證明連結",
      },

      // 請假申請列表
      "leaveApplyList": {
        "applyList": "請假申請列表",
        "applyTime": "申請時間",
        "leaveType": "請假類型",
        "leavePeriod": "請假期間",
        "leaveReason": "請假原因",
        "proveLink": "請假證明連結",
        "approvedAt": "核准時間",
        "approvedBy": "核准人",
        
      },
      
      // 請假類型
      "leaveTypes": {
        "事假": "事假",
        "家庭照顧假(第20條)": "家庭照顧假(第20條)",
        "生理假": "生理假",
        "未住院病假": "未住院病假",
        "住院病假": "住院病假",
        "婚假": "婚假",
        "喪假-1": "喪假-1",
        "喪假-2": "喪假-2",
        "喪假-3": "喪假-3",
        "產檢假": "產檢假",
        "產假-1": "產假-1",
        "產假-2": "產假-2",
        "產假-3": "產假-3",
        "產假-4": "產假-4",
        "陪產檢假(第15條)": "陪產檢假(第15條)",
        "撫育假": "撫育假",
        "哺(集)乳時間(第18條)": "哺(集)乳時間(第18條)",
        "公假": "公假",
        "法定投票假": "法定投票假",
        "特休假": "特休假",
        "補休假": "補休假",
        "普通傷病假留職停薪": "普通傷病假留職停薪",
        "育嬰假(育嬰留職停薪)(第16條)": "育嬰假(育嬰留職停薪)(第16條)",
        "其他": "其他"
      },
      //請假單主標題設定
      "titleLeave": {
        "title": "請假申請系統",
        "leaveApply" : "申請請假",
        "checkLeave" : "查看請假狀態",
        "manageLeaveApply": "管理請假申請",
      },
      
      // 管理員
      "admin": {
        "title": "系統管理",
        "userManagement": "使用者管理",
        "leaveManagement": "請假管理",
        "settings": "系統設定"
      },
      
      // 錯誤訊息
      "errors": {
        "general": "發生錯誤，請稍後再試",
        "network": "網路連線錯誤",
        "unauthorized": "未授權的操作",
        "notFound": "找不到資源",
        "validation": "輸入資料驗證失敗"
      },
      
      // 成功訊息
      "success": {
        "saved": "儲存成功",
        "deleted": "刪除成功",
        "updated": "更新成功",
        "created": "建立成功"
      },

      // 註冊頁面相關翻譯
      "registerPage": {
        
        "title": "註冊新帳號",
        "employeeId": "員工編號",
        "fullName": "姓名",
        "email": "電子郵件",
        "password": "密碼",
        "confirmPassword": "確認密碼",
        "registerButton": "註冊帳號",
        "successMessage": "註冊成功！正在為您登入...",
        "errorMessage": "註冊失敗，請檢查輸入資訊"
      }

    }
  },


  
  en: {
    translation: {
      // Common
      "loading": "Loading...",
      "save": "Save",
      "cancel": "Cancel",
      "confirm": "Confirm",
      "submit": "Submit",
      "submitting": "Submitting...",
      "delete": "Delete",
      "edit": "Edit",
      "view": "View",
      "search": "Search",
      "filter": "Filter",
      "refresh": "Refresh",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",
      "close": "Close",
      "language": "Language",
      "noInfo": "No leave application records found",
      "accountYet": "Don't have an account yet? ",
      "inputSomething": "input ... ",
      "approve": "approve",
      "reject": "reject",
      "linkTips" : "how to upload link?",
      
      // Homepage
      "homepage": {
        "title": "COLD electric Leave Application System",
        "subtitle": "Welcome back, {{name}}!",
        "guestSubtitle": "Enterprise Leave Application and User Management System",
        "leaveApplication": "Leave Application System",
        "login": "Login",
        "register": "Register",
        "systemManagement": "System Management"
      },
      
      // Navigation
      "navigation": {
        "home": "Home",
        "leave": "Leave Management",
        "admin": "System Admin",
        "profile": "Profile",
        "logout": "Logout"
      },
      
      // Authentication
      "auth": {
        "login": "Login",
        "register": "Register",
        "logout": "Logout",
        "employeeId": "Employee ID",
        "password": "Password",
        "confirmPassword": "Confirm Password",
        "fullName": "Full Name",
        "email": "Email",
        "department": "Department",
        "role": "Role",
        "loginTitle": "System Login",
        "registerTitle": "User Registration",
        "loginButton": "Login to System",
        "registerButton": "Create Account",
        "loginSubtitle": "Please enter your employee ID and password",
        "registerSubtitle": "Please fill in the following information to complete registration",
        "employeeIdPlaceholder": "e.g., 001",
        "passwordPlaceholder": "Enter your password",
        "confirmPasswordPlaceholder": "Re-enter your password",
        "fullNamePlaceholder": "Enter your full name",
        "emailPlaceholder": "example@company.com",
        "loginError": "Login failed, please check your employee ID and password",
        "loginSuccess": "Login successful!",
        "registerError": "Registration failed, please check your information",
        "registerSuccess": "Registration successful! Logging you in...",
        "passwordMismatch": "Password confirmation does not match",
        "requiredField": "This field is required"
      },
      
      // Leave Application
      "leave": {
        "application": "Leave Application",
        "applications": "Leave Applications",
        "newApplication": "New Leave Application",
        "employeeId": "Employee ID",
        "employeeName": "Employee Name",
        "type": "Leave Type",
        "startDate": "Start Date & Time",
        "endDate": "End Date & Time",
        "reason": "Reason",
        "reasonTips": "Please upload approved file to Google Drive and paste the link here",
        "applyFolderLink": "Application Folder Link",
        "status": "Status",
        "appliedAt": "Applied At",
        "approvedAt": "Approved At",
        "approvedBy": "Approved By",
        "rejectedAt": "Rejected At",
        "rejectedBy": "Rejected By",
        "rejectionReason": "Rejection Reason",
        "submitting": "Submitting...",
        "submitApplication": "Submit Application",
        "employeeIdPlaceholder": "e.g., EMP001",
        "employeeNamePlaceholder": "Enter your name",
        "reasonPlaceholder": "Please provide detailed reason for leave...",
        "applyFolderLinkPlaceholder": "Enter application folder link...",
        "approve": "Approve",
        "reject": "Reject",
        "pending": "Pending",
        "approved": "Approved",
        "rejected": "Rejected",
        "cancelled": "Cancelled",
        "types": {
          "annual": "Annual Leave",
          "sick": "Sick Leave",
          "personal": "Personal Leave",
          "maternity": "Maternity Leave",
          "paternity": "Paternity Leave",
          "compensatory": "Compensatory Leave",
        },
        "folderLink": "Application Folder Link",
        
      },

      // 請假申請列表
      "leaveApplyList": {
        "applyList": "Leave Application List",
        "applyTime": "Application Time",
        "leaveType": "Leave Type",
        "leavePeriod": "Leave Period",
        "leaveReason": "Leave Reason",
        "proveLink": "Leave Proof Link",
        "approvedAt": "Approved At",
        "approvedBy": "Approved By"
        
      },
      
      // Leave Types
      "leaveTypes": {
        "事假": "Personal Leave",
        "家庭照顧假(第20條)": "Family Care Leave (Article 20)",
        "生理假": "Menstrual Leave",
        "未住院病假": "Sick Leave (Non-hospitalized)",
        "住院病假": "Sick Leave (Hospitalized)",
        "婚假": "Marriage Leave",
        "喪假-1": "Bereavement Leave-1",
        "喪假-2": "Bereavement Leave-2",
        "喪假-3": "Bereavement Leave-3",
        "產檢假": "Prenatal Checkup Leave",
        "產假-1": "Maternity Leave-1",
        "產假-2": "Maternity Leave-2",
        "產假-3": "Maternity Leave-3",
        "產假-4": "Maternity Leave-4",
        "陪產檢假(第15條)": "Paternity Checkup Leave (Article 15)",
        "撫育假": "Parental Leave",
        "哺(集)乳時間(第18條)": "Breastfeeding Time (Article 18)",
        "公假": "Official Leave",
        "法定投票假": "Statutory Voting Leave",
        "特休假": "Annual Leave",
        "補休假": "Compensatory Leave",
        "普通傷病假留職停薪": "Ordinary Injury/Sickness Leave Without Pay",
        "育嬰假(育嬰留職停薪)(第16條)": "Parental Leave Without Pay (Article 16)",
        "其他": "Other"
      },

      "titleLeave": {
        "title": "Apply Leave System",
        "leaveApply" : "Leave Application",
        "checkLeave" : "Check Leave Status",
        "manageLeaveApply": "Manage Leave Applications",
      },
      
      // Admin
      "admin": {
        "title": "System Administration",
        "userManagement": "User Management",
        "leaveManagement": "Leave Management",
        "settings": "System Settings"
      },
      
      // Error Messages
      "errors": {
        "general": "An error occurred, please try again later",
        "network": "Network connection error",
        "unauthorized": "Unauthorized operation",
        "notFound": "Resource not found",
        "validation": "Input data validation failed"
      },
      
      // Success Messages
      "success": {
        "saved": "Saved successfully",
        "deleted": "Deleted successfully",
        "updated": "Updated successfully",
        "created": "Created successfully"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    lng: 'zh', // 預設語言
    
    interpolation: {
      escapeValue: false, // React 已經安全處理
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;
