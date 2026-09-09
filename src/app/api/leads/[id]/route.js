import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { client } from '@/lib/sanity';

// Helper: Check authentication
async function getAuthUser() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  if (!tokenCookie) return null;
  return verifyToken(tokenCookie.value);
}

// PATCH: Update lead status (Admin Only)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const decoded = await getAuthUser();
    if (!decoded) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' }, { status: 401 });
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası: Sanity yazma izni (Write Token) eksik.' }, { status: 500 });
    }

    const { status } = await request.json();
    const validStatuses = ['PENDING', 'CONTACTED', 'COMPLETED', 'CANCELLED'];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum değeri.' }, { status: 400 });
    }

    // Update status in Sanity
    const updatedLead = await client
      .patch(id)
      .set({ status })
      .commit();

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json({ error: 'Talebi güncellerken hata oluştu.' }, { status: 500 });
  }
}

// DELETE: Delete lead (Admin Only)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const decoded = await getAuthUser();
    if (!decoded) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' }, { status: 401 });
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası: Sanity yazma izni (Write Token) eksik.' }, { status: 500 });
    }

    // Delete document from Sanity
    await client.delete(id);
    
    return NextResponse.json({ success: true, message: 'Talep başarıyla silindi.' });
  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json({ error: 'Talebi silerken hata oluştu.' }, { status: 500 });
  }
}
