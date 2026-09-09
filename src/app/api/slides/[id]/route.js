import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PUT: Update a slide (Admin Only)
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
    const { image, title, subtitle, description, publicId } = body;
    
    if (!image || !title || !subtitle || !description || !publicId) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 });
    }
    
    const existingSlide = await db.heroSlide.findUnique({
      where: { id },
    });
    
    if (!existingSlide) {
      return NextResponse.json({ error: 'Güncellenecek slayt bulunamadı.' }, { status: 404 });
    }
    
    // Delete old image from Cloudinary if changed and not a default slide
    if (existingSlide.publicId !== publicId && !existingSlide.publicId.startsWith('default-')) {
      try {
        await cloudinary.uploader.destroy(existingSlide.publicId);
      } catch (err) {
        console.error('Failed to delete old slide image from Cloudinary:', err);
      }
    }
    
    const updatedSlide = await db.heroSlide.update({
      where: { id },
      data: {
        image,
        title,
        subtitle,
        description,
        publicId,
      },
    });
    
    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error('Update slide error:', error);
    return NextResponse.json({ error: 'Slayt güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

// DELETE: Delete a slide and its Cloudinary image (Admin Only)
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

    const slide = await db.heroSlide.findUnique({
      where: { id },
    });
    
    if (!slide) {
      return NextResponse.json({ error: 'Silinecek slayt bulunamadı.' }, { status: 404 });
    }
    
    // 1. Delete image from Cloudinary if it's not a default slide
    if (!slide.publicId.startsWith('default-')) {
      try {
        await cloudinary.uploader.destroy(slide.publicId);
      } catch (err) {
        console.error('Failed to delete slide image from Cloudinary:', err);
      }
    }
    
    // 2. Delete slide from DB
    await db.heroSlide.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true, message: 'Slayt başarıyla silindi.' });
  } catch (error) {
    console.error('Delete slide error:', error);
    return NextResponse.json({ error: 'Slayt silinirken bir hata oluştu.' }, { status: 500 });
  }
}
