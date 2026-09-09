import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// PUT: Update a testimonial (Admin Only)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    // Auth Check
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' }, { status: 401 });
    }
    
    const decoded = verifyToken(tokenCookie.value);
    if (!decoded) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Geçersiz oturum.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, stars, text } = body;
    
    if (!name || !role || !text) {
      return NextResponse.json({ error: 'İsim, rol ve yorum metni alanları zorunludur.' }, { status: 400 });
    }
    
    const starCount = parseInt(stars) || 5;
    
    const existingTestimonial = await db.testimonial.findUnique({
      where: { id },
    });
    
    if (!existingTestimonial) {
      return NextResponse.json({ error: 'Güncellenecek yorum bulunamadı.' }, { status: 404 });
    }
    
    const updatedTestimonial = await db.testimonial.update({
      where: { id },
      data: {
        name,
        role,
        stars: starCount,
        text,
      },
    });
    
    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json({ error: 'Yorum güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

// DELETE: Delete a testimonial (Admin Only)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Auth Check
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' }, { status: 401 });
    }
    
    const decoded = verifyToken(tokenCookie.value);
    if (!decoded) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Geçersiz oturum.' }, { status: 401 });
    }

    const testimonial = await db.testimonial.findUnique({
      where: { id },
    });
    
    if (!testimonial) {
      return NextResponse.json({ error: 'Silinecek yorum bulunamadı.' }, { status: 404 });
    }
    
    await db.testimonial.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true, message: 'Yorum başarıyla silindi.' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json({ error: 'Yorum silinirken bir hata oluştu.' }, { status: 500 });
  }
}
