import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { client } from '@/lib/sanity';
import { verifyToken } from '@/lib/auth';

const DEFAULT_SETTINGS = {
  siteName: 'Doğan Perde',
  siteSlogan: 'Pencerelerinize değer katan şık tasarımlar',
  phone1: '0541 731 07 49',
  phone2: '0535 485 76 31',
  whatsapp: '905417310749',
  address: 'Şahinbey Cd. Çamlık Mah. No:114 Dük:A (Doğa Parkı Yanı), Çekmeköy / İstanbul',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Do%C4%9Fan+Perde+%C3%87ekmek%C3%B6y+%C5%9Eahinbey+Caddesi+%C3%87aml%C4%B1k+Mahallesi',
  instagram: 'https://instagram.com/doganperde_cekmekoy',
  facebook: 'https://facebook.com',
  workWeekday: 'Pazartesi - Cumartesi: 09:00 - 19:30',
  workSunday: 'Pazar: Kapalı',
  pricingRules: JSON.stringify({
    'Tül Perde': { m2Price: 600, minM2: 1.0, fixedFee: 0 },
    'Fon Perde': { m2Price: 800, minM2: 1.0, fixedFee: 0 },
    'Zebra Perde': { m2Price: 550, minM2: 1.5, fixedFee: 0 },
    'Stor Perde': { m2Price: 450, minM2: 1.5, fixedFee: 0 },
    'Motorlu Akıllı Perde': { m2Price: 1800, minM2: 1.5, fixedFee: 1500 }
  })
};

// GET: Fetch all settings from Sanity
export async function GET() {
  try {
    const sanitySetting = await client.fetch('*[_type == "setting"][0]');
    
    if (!sanitySetting) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }
    
    // Merge with defaults to ensure missing settings are filled
    const mergedSettings = { ...DEFAULT_SETTINGS, ...sanitySetting };
    
    return NextResponse.json(mergedSettings);
  } catch (error) {
    console.error('Fetch settings from Sanity error, using offline defaults:', error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

// POST: Save/Update settings in Sanity (Admin Only)
export async function POST(request) {
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

    const body = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Geçersiz veri formatı.' }, { status: 400 });
    }
    
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Sanity yazma yetkisi (SANITY_API_WRITE_TOKEN) sunucuda tanımlanmamış.' }, { status: 500 });
    }

    // Find and update the single settings document
    const existing = await client.fetch('*[_type == "setting"][0]');
    
    if (existing) {
      await client.patch(existing._id).set(body).commit();
    } else {
      await client.create({
        _type: 'setting',
        ...body
      });
    }

    return NextResponse.json({ success: true, message: 'Ayarlar başarıyla kaydedildi.' });
  } catch (error) {
    console.error('Save settings to Sanity error:', error);
    return NextResponse.json({ error: 'Ayarlar kaydedilirken bir hata oluştu.' }, { status: 500 });
  }
}
