import twilio from 'twilio';

// 簡化的 Twilio 驗證服務
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export class TwilioService {
  // 發送 SMS 驗證碼
  static async sendSMS(phoneNumber: string): Promise<{
    success: boolean;
    message: string;
  }> {
    if (!client || !serviceId) {
      return {
        success: false,
        message: 'Twilio 服務未配置'
      };
    }

    try {
      const formattedPhone = phoneNumber.startsWith('+886') 
        ? phoneNumber 
        : '+886' + phoneNumber.substring(1);

      await client.verify.v2
        .services(serviceId)
        .verifications
        .create({
          to: formattedPhone,
          channel: 'sms',
          locale: 'zh-TW'
        });

      return {
        success: true,
        message: '驗證碼已發送到您的手機'
      };

    } catch (error: unknown) {
      console.error('Twilio SMS 發送失敗:', error);
      
      // 類型安全的錯誤處理
      if (error && typeof error === 'object' && 'code' in error) {
        const twilioError = error as { code: number; message?: string };
        
        if (twilioError.code === 60200) {
          return { success: false, message: '手機號碼格式錯誤' };
        } else if (twilioError.code === 60203) {
          return { success: false, message: '發送頻率太快，請稍後再試' };
        }
      }
      
      return { success: false, message: 'SMS 發送失敗' };
    }
  }

  // 驗證 SMS 驗證碼
  static async verifySMS(phoneNumber: string, code: string): Promise<{
    success: boolean;
    message: string;
  }> {
    if (!client || !serviceId) {
      return {
        success: false,
        message: 'Twilio 服務未配置'
      };
    }

    try {
      const formattedPhone = phoneNumber.startsWith('+886') 
        ? phoneNumber 
        : '+886' + phoneNumber.substring(1);

      const verificationCheck = await client.verify.v2
        .services(serviceId)
        .verificationChecks
        .create({
          to: formattedPhone,
          code: code
        });

      return {
        success: verificationCheck.status === 'approved',
        message: verificationCheck.status === 'approved' 
          ? '驗證成功' 
          : '驗證碼錯誤或已過期'
      };

    } catch (error) {
      console.error('Twilio 驗證失敗:', error);
      return { success: false, message: '驗證失敗' };
    }
  }
}
