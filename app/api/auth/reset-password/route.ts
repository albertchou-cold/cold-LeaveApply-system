import { NextRequest, NextResponse } from 'next/server';
import { userDB } from '@/lib/database';
import { verificationCodes } from '@/lib/verification-store';

// 重置密碼 - 使用驗證碼
export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();
    
    // 驗證輸入
    if (!email || !code || !newPassword) {
      return NextResponse.json({ 
        success: false, 
        message: '請填寫所有必要欄位' 
      }, { status: 400 });
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json({ 
        success: false, 
        message: '密碼長度至少需要 6 位' 
      }, { status: 400 });
    }

    // 檢查驗證碼
    const stored = verificationCodes.get(email);
    if (!stored) {
      return NextResponse.json({ 
        success: false, 
        message: '驗證碼已過期或不存在，請重新申請' 
      }, { status: 400 });
    }

    // 檢查驗證碼是否過期
    if (Date.now() > stored.expires) {
      verificationCodes.delete(email);
      return NextResponse.json({ 
        success: false, 
        message: '驗證碼已過期，請重新申請' 
      }, { status: 400 });
    }

    // 檢查嘗試次數
    if (stored.attempts >= 5) {
      verificationCodes.delete(email);
      return NextResponse.json({ 
        success: false, 
        message: '驗證失敗次數過多，請重新申請驗證碼' 
      }, { status: 400 });
    }

    // 驗證碼不正確
    if (stored.code !== code) {
      stored.attempts += 1;
      return NextResponse.json({ 
        success: false, 
        message: `驗證碼不正確，還剩 ${5 - stored.attempts} 次機會` 
      }, { status: 400 });
    }

    // 檢查用戶是否存在
    const user = await userDB.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: '找不到此郵件地址對應的用戶' 
      }, { status: 404 });
    }

    // 更新密碼
    const success = await userDB.updatePasswordByEmail(email, newPassword);
    
    if (!success) {
      return NextResponse.json({ 
        success: false, 
        message: '密碼更新失敗，請稍後再試' 
      }, { status: 500 });
    }

    // 清除驗證碼
    verificationCodes.delete(email);

    // 發送密碼重置成功通知（可選）
    try {
      const { EmailService } = await import('../../../../lib/email-service');
      await EmailService.sendPasswordResetNotification(email, user.fullName);
    } catch (emailError) {
      console.error('發送通知郵件失敗:', emailError);
      // 即使通知郵件失敗，密碼重置仍然成功
    }

    return NextResponse.json({ 
      success: true, 
      message: '密碼重置成功！您現在可以使用新密碼登入。' 
    });
    
  } catch (error) {
    console.error('重置密碼錯誤:', error);
    return NextResponse.json({ 
      success: false, 
      message: '重置失敗，請稍後再試' 
    }, { status: 500 });
  }
}


