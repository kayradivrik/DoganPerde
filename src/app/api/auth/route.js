import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { comparePassword, hashPassword, signToken, verifyToken } from '@/lib/auth';

// GET: Check Auth Status (Purely offline-safe cookie verification)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie) {
      return NextResponse.json({ loggedIn: false }, { status: 401 });
    }
    
    const decoded = verifyToken(tokenCookie.value);
    if (!decoded) {
      return NextResponse.json({ loggedIn: false }, { status: 401 });
    }
    
    return NextResponse.json({ loggedIn: true, username: decoded.username });
  } catch (error) {
    return NextResponse.json({ error: 'Auth check failed' }, { status: 500 });
  }
}

// POST: Login (Resilient fallback login if database is offline/timed out)
export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre gereklidir.' }, { status: 400 });
    }
    
    let admin = null;
    let dbErrorOccurred = false;

    try {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'Gamerfilo7';
      const defaultPasswordHash = await hashPassword(defaultPassword);

      if (username === (process.env.ADMIN_USERNAME || 'admin')) {
        admin = await db.adminUser.upsert({
          where: { username },
          update: { passwordHash: defaultPasswordHash },
          create: {
            username,
            passwordHash: defaultPasswordHash,
          },
        });
      } else {
        admin = await db.adminUser.findUnique({
          where: { username },
        });
      }
    } catch (dbError) {
      console.warn('Database offline, entering fallback login verification mode:', dbError.message);
      dbErrorOccurred = true;
    }

    // Fallback authentication check if DB is offline or account doesn't exist yet
    if (!admin || dbErrorOccurred) {
      const fallbackUser = process.env.ADMIN_USERNAME || 'admin';
      const fallbackPass = process.env.ADMIN_PASSWORD || 'Gamerfilo7';
      
      if (username === fallbackUser && password === fallbackPass) {
        // Create mock admin object
        admin = {
          id: 'offline-admin-id',
          username: fallbackUser
        };
      }
    }
    
    if (!admin) {
      return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre.' }, { status: 401 });
    }
    
    // If it's a real database admin, compare password hash
    if (admin.id !== 'offline-admin-id') {
      const isValid = await comparePassword(password, admin.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre.' }, { status: 401 });
      }
    }
    
    // Sign Token
    const token = signToken({ id: admin.id, username: admin.username });
    
    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return NextResponse.json({ success: true, username: admin.username });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Giriş işlemi sırasında hata oluştu.' }, { status: 500 });
  }
}

// DELETE: Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expired immediately
      path: '/',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Çıkış işlemi başarısız.' }, { status: 500 });
  }
}
