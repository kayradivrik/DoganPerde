import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // 1. Auth check
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' }, { status: 401 });
    }
    
    const decoded = verifyToken(tokenCookie.value);
    if (!decoded) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Geçersiz oturum.' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya yüklenmedi.' }, { status: 400 });
    }

    // 3. Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Stream upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'dogan-perde' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    const result = await uploadPromise;

    // 5. Return upload details
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('File upload API error:', error);
    return NextResponse.json({ error: 'Dosya yükleme hatası oluştu.' }, { status: 500 });
  }
}
