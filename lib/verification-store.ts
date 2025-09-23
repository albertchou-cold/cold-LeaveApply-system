// 儲存驗證碼的記憶體快取（生產環境建議使用 Redis）
export const verificationCodes = new Map<string, {
  code: string;
  expires: number;
  attempts: number;
}>();

// 清理過期的驗證碼
export function cleanupExpiredCodes() {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (data.expires < now) {
      verificationCodes.delete(email);
    }
  }
}
