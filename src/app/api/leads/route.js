import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { client } from '@/lib/sanity';

// GET: Fetch all leads (Admin Only)
export async function GET() {
  try {
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

    // Fetch leads directly from Sanity Cloud
    const leads = await client.fetch('*[_type == "lead"] | order(_createdAt desc)');
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Fetch leads error:', error);
    return NextResponse.json({ error: 'Talepleri çekerken bir hata oluştu.' }, { status: 500 });
  }
}

// POST: Submit a new consultation request (Public)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, address, curtainType, message, leadType, width, height, estimatedPrice } = body;
    
    if (!name || !phone) {
      return NextResponse.json({ error: 'İsim ve telefon numarası zorunludur.' }, { status: 400 });
    }
    
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      console.error("Missing SANITY_API_WRITE_TOKEN in .env.local");
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası: Sanity yazma izni (Write Token) eksik.' }, { status: 500 });
    }

    const leadData = {
      _type: 'lead',
      name,
      phone,
      address: address || null,
      curtainType: curtainType || null,
      message: message || null,
      leadType: leadType || 'APPOINTMENT',
      status: 'PENDING',
      width: width ? parseFloat(width) : null,
      height: height ? parseFloat(height) : null,
      estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null,
    };

    // Save lead directly to Sanity Cloud
    const newLead = await client.create(leadData);
    
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json({ error: 'Randevu talebi oluşturulurken hata oluştu.' }, { status: 500 });
  }
}
