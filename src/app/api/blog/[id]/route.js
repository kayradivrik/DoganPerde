import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET: Fetch a single blog post by slug or ID
export async function GET(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const { id } = params;
    
    // Find by slug first, then by ID if not found
    let post = await db.blogPost.findUnique({
      where: { slug: id },
    });
    
    if (!post && id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await db.blogPost.findUnique({
        where: { id },
      });
    }
    
    if (!post) {
      return NextResponse.json({ error: 'Blog yazısı bulunamadı.' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Fetch single blog error:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}

// PUT: Edit a blog post (secured)
export async function PUT(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const { id } = params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }
    
    const decoded = verifyToken(token.value);
    if (!decoded) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }
    
    const { title, excerpt, content, imageUrl, category, publicId } = await request.json();
    
    // Check existence
    let existingPost = await db.blogPost.findUnique({
      where: { id },
    });
    
    if (!existingPost) {
      return NextResponse.json({ error: 'Yazı bulunamadı.' }, { status: 404 });
    }
    
    const updatedPost = await db.blogPost.update({
      where: { id },
      data: {
        title: title || existingPost.title,
        excerpt: excerpt || existingPost.excerpt,
        content: content || existingPost.content,
        imageUrl: imageUrl || existingPost.imageUrl,
        category: category || existingPost.category,
        publicId: publicId !== undefined ? publicId : existingPost.publicId
      }
    });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Güncelleme sırasında hata oluştu.' }, { status: 500 });
  }
}

// DELETE: Delete a blog post (secured)
export async function DELETE(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const { id } = params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }
    
    const decoded = verifyToken(token.value);
    if (!decoded) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }
    
    await db.blogPost.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Silme işlemi sırasında hata oluştu.' }, { status: 500 });
  }
}
