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

// GET: Fetch a single product
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Fetch single product error:', error);
    return NextResponse.json({ error: 'Ürün detayı yüklenirken bir hata oluştu.' }, { status: 500 });
  }
}

// PUT: Update a product (Admin Only)
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
    const { title, description, category, imageUrl, publicId } = body;
    
    if (!title || !description || !category || !imageUrl || !publicId) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 });
    }
    
    // Find product to see if image changed, and if so, delete the old Cloudinary image
    const existingProduct = await db.product.findUnique({
      where: { id },
    });
    
    if (!existingProduct) {
      return NextResponse.json({ error: 'Güncellenecek ürün bulunamadı.' }, { status: 404 });
    }
    
    // If publicId has changed (meaning a new image was uploaded), delete the old one
    if (existingProduct.publicId !== publicId) {
      try {
        await cloudinary.uploader.destroy(existingProduct.publicId);
      } catch (err) {
        console.error('Failed to delete old image from Cloudinary:', err);
      }
    }
    
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        title,
        description,
        category,
        imageUrl,
        publicId,
      },
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Ürün güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

// DELETE: Delete a product and its associated Cloudinary image (Admin Only)
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
    
    const product = await db.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Silinecek ürün bulunamadı.' }, { status: 404 });
    }
    
    // 1. Delete image from Cloudinary
    try {
      await cloudinary.uploader.destroy(product.publicId);
    } catch (err) {
      console.error('Failed to delete image from Cloudinary:', err);
    }
    
    // 2. Delete product from Database
    await db.product.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true, message: 'Ürün ve görsel başarıyla silindi.' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Ürün silinirken bir hata oluştu.' }, { status: 500 });
  }
}
