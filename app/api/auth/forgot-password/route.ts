import { NextRequest, NextResponse } from 'next/server';
import { userDB } from '@/lib/database';
import { EmailService } from '@/lib/email-service';
import { TwilioService } from '@/lib/twilio';
import { verificationCodes } from '@/lib/verification-store';

// 簡化的密碼重設 API
export async function POST(request: NextRequest) {
  try {
    const { email, phone, method } = await request.json();

    // 驗證必要欄位
    if (!email) {
      return NextResponse.json(
        { success: false, message: '請提供電子郵件' },
        { status: 400 }
      );
    }

    // 檢查用戶是否存在
    // const user = await userDB.getUserByEmail(email);
    // if (!user) {
    //   // 即使用戶不存在也返回成功訊息（安全考量）
    //   return NextResponse.json({
    //     success: true,
    //     message: '如果該帳號存在，驗證碼已發送'
    //   });
    // }

    // 生成 6 位數驗證碼
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 分鐘後過期

    try {
      if (method === 'sms' && phone) {
        // 使用 Twilio SMS
        const result = await TwilioService.sendSMS(phone);
        
        if (result.success) {
          // 將驗證碼存儲到記憶體
          verificationCodes.set(email, {
            code: verificationCode,
            expires: expiry,
            attempts: 0
          });
          
          console.log(`SMS 驗證碼 ${verificationCode} 發送至 ${phone}`);
          return NextResponse.json({
            success: true,
            message: result.message,
            method: 'sms'
          });
        } else {
          // SMS 失敗，自動轉為 email
          const emailResult = await EmailService.sendVerificationCode(email);
          
          if (emailResult.success && emailResult.code) {
            // 將郵件驗證碼存儲到記憶體
            verificationCodes.set(email, {
              code: emailResult.code,
              expires: expiry,
              attempts: 0
            });
          }
          
          return NextResponse.json({
            success: emailResult.success,
            message: emailResult.success 
              ? 'SMS 發送失敗，驗證碼已發送至您的電子郵件' 
              : '發送失敗，請稍後再試',
            method: 'email',
            fallback: true
          });
        }
      } else {
        // 預設使用 Email
        const result = await EmailService.sendVerificationCode(email);
        
        if (result.success && result.code) {
          // 將郵件驗證碼存儲到記憶體
          verificationCodes.set(email, {
            code: result.code,
            expires: expiry,
            attempts: 0
          });
        }
        
        return NextResponse.json({
          success: result.success,
          message: result.success 
            ? '驗證碼已發送至您的電子郵件' 
            : '發送失敗，請稍後再試',
          method: 'email'
        });
      }
    } catch (error) {
      console.error('發送驗證碼失敗:', error);
      return NextResponse.json(
        { success: false, message: '發送失敗，請稍後再試' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('處理忘記密碼請求失敗:', error);
    return NextResponse.json(
      { success: false, message: '系統錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}
