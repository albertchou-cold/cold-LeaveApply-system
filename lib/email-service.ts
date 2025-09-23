import nodemailer from 'nodemailer';

// 通用 Email 驗證服務 - 支援任何 SMTP 伺服器
export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // 發送驗證碼
  static async sendVerificationCode(email: string): Promise<{
    success: boolean;
    message: string;
    code?: string;
  }> {
    try {
      // 調試：列出環境變數
      console.log('📧 SMTP 環境變數檢查:');
      console.log('SMTP_USER:', process.env.SMTP_USER);
      console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***已設定***' : '未設定');
      console.log('使用 Gmail service 模式');
      
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || '請假系統'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: email,
        subject: '請假系統 - 密碼重置驗證碼',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb; text-align: center;">密碼重置驗證</h2>
            <p>您好，</p>
            <p>您請求重置請假系統的密碼。請使用以下驗證碼：</p>
            <div style="background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
              <h1 style="color: #495057; font-size: 36px; margin: 0; letter-spacing: 8px;">${code}</h1>
            </div>
            <p style="color: #6c757d;">此驗證碼將在 10 分鐘後失效。</p>
            <p style="color: #6c757d;">如果您未要求重置密碼，請忽略此郵件。</p>
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            <p style="color: #adb5bd; font-size: 12px; text-align: center;">
              此郵件由請假系統自動發送，請勿回覆。
            </p>
          </div>
        `
      });

      return {
        success: true,
        message: '驗證碼已發送到您的郵箱',
        code: process.env.NODE_ENV === 'development' ? code : undefined
      };

    } catch (error) {
      console.error('郵件發送失敗:', error);
      return {
        success: false,
        message: '郵件發送失敗，請檢查郵箱地址'
      };
    }
  }

  // 發送密碼重置成功通知
  static async sendPasswordResetNotification(email: string, employeeName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || '請假系統'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to: email,
        subject: '請假系統 - 密碼重置成功',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #28a745;">密碼重置成功</h2>
            <p>${employeeName} 您好，</p>
            <p>您的請假系統密碼已成功重置。</p>
            <p>重置時間：${new Date().toLocaleString('zh-TW')}</p>
            <p style="color: #dc3545;">如果這不是您的操作，請立即聯繫系統管理員。</p>
          </div>
        `
      });
    } catch (error) {
      console.error('密碼重置通知發送失敗:', error);
    }
  }
}
