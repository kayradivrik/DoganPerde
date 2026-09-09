import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { client, urlFor } from '@/lib/sanity';
import { verifyToken } from '@/lib/auth';

const DEFAULT_SLIDES = [
  {
    image: '',
    title: 'Şık ve Modern Salon Perdeleri',
    subtitle: 'Tül ve Fon Perde Kombinasyonları',
    description: 'Evlerinizin ruhunu değiştiren, kaliteli kumaşlar ve göz alıcı renk seçenekleriyle özel tasarım tül ve fon perde modelleri.',
    publicId: 'default-slide1'
  },
  {
    image: '',
    title: 'Minimalist Zebra & Stor Modelleri',
    subtitle: 'Pratik ve Kullanışlı Stor Sistemleri',
    description: 'Ofis ve mutfaklarınız için modern çizgiler, kolay temizlenebilen kaliteli kumaşlar ve dayanıklı mekanizmalar.',
    publicId: 'default-slide2'
  },
  {
    image: '',
    title: 'Yeni Nesil Motorlu Akıllı Perdeler',
    subtitle: 'Kumandalı ve Akıllı Ev Uyumlu Sistemler',
    description: 'Tek bir tuşla veya sesli komutla kontrol edebileceğiniz, lüks ve konforu bir arada sunan sessiz motorlu perdeler.',
    publicId: 'default-slide3'
  }
];

// GET: Fetch all slides from Sanity
export async function GET() {
  try {
    const sanitySlides = await client.fetch('*[_type == "heroSlide"] | order(order asc)');
    
    if (!sanitySlides || sanitySlides.length === 0) {
      return NextResponse.json(DEFAULT_SLIDES);
    }
    
    const slides = sanitySlides.map(s => ({
      id: s._id,
      title: s.title,
      subtitle: s.subtitle || '',
      description: s.description || '',
      image: s.image ? urlFor(s.image).url() : '',
    }));
    
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Fetch slides from Sanity error, returning defaults:', error);
    return NextResponse.json(DEFAULT_SLIDES);
  }
}

// POST: Create a new slide in Sanity (Admin Only)
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
    const { title, subtitle, description, order } = body;
    
    if (!title || !subtitle || !description) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 });
    }
    
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Sanity yazma yetkisi (SANITY_API_WRITE_TOKEN) sunucuda tanımlanmamış.' }, { status: 500 });
    }

    const newSlide = await client.create({
      _type: 'heroSlide',
      title,
      subtitle,
      description,
      order: order ? parseInt(order) : 0,
    });
    
    return NextResponse.json({
      id: newSlide._id,
      title: newSlide.title,
      subtitle: newSlide.subtitle,
      description: newSlide.description,
    }, { status: 201 });
  } catch (error) {
    console.error('Create slide in Sanity error:', error);
    return NextResponse.json({ error: 'Sanity üzerinde slayt oluşturulurken bir hata oluştu.' }, { status: 500 });
  }
}
