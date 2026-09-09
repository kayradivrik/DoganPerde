import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { verifyToken, comparePassword, hashPassword } from '@/lib/auth';

// POST: Change Admin Password (Admin Only)
export async function POST(request) {
  try {
    // 1. Auth Check
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' }, { status: 401 });
    }
    
    const decoded = verifyToken(tokenCookie.value);
    if (!decoded) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Geçersiz oturum.' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Mevcut şifre ve yeni şifre gereklidir.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Yeni şifre en az 6 karakter olmalıdır.' }, { status: 400 });
    }

    // 2. Find admin in DB
    const admin = await db.adminUser.findUnique({
      where: { username: decoded.username }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // 3. Verify current password
    const isPasswordValid = await comparePassword(currentPassword, admin.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Mevcut şifreniz yanlış.' }, { status: 400 });
    }

    // 4. Hash and update new password
    const newPasswordHash = await hashPassword(newPassword);
    await db.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: newPasswordHash }
    });

    return NextResponse.json({ success: true, message: 'Şifreniz başarıyla güncellendi.' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Şifre değiştirilirken bir hata oluştu.' }, { status: 500 });
  }
}
