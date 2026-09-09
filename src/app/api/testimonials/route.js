import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { client } from '@/lib/sanity';
import { verifyToken } from '@/lib/auth';

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Yakup Canvar',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Perdecimden gerçekten çok memnunum. Hem ofisimde hem de evimde tercih ettim ve her iki yerde de sonuç harika oldu. Kumaş kalitesi, işçilik ve montaj süreci gerçekten çok başarılıydı. İlgili ve çözüm odaklı bir ekipleri var, her detayıyla ilgilendiler. Gönül rahatlığıyla tavsiye ederim.'
  },
  {
    name: 'Elif PEŞKİR',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Cumali bey ilgilendi bizimle gerçekten dört dörtlük işçilik cumali bey verdiği sözün arkasında durdu 1 günde perdelerim teslim edildi taşınma esnasında perdelerim kayboldu acil istedim sağolsun özenle ilgilendi çok teşekkür ederim gönül rahatlığıyla işletmeye ve cumali bey\'e güvenebilirsiniz.'
  },
  {
    name: 'Esra KARAKAŞ',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Tüm odaları Doğan Perdeye yaptırdık. Öncelikle fiyatta çok yardımcı oldular. Her hangi hoşumuza gitmeyen noktada hemen değişim yaptılar. Diğer satıcılar gibi bugun geliyoruz diyip 1 hafta ertelemeden dedikleri tarihte geldiler. Tüm odalarımızı yaptırdık güvenebileceğiniz bir yerr'
  },
  {
    name: 'Mecit Yılmaz',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'İşinin ehli ,ilgi alaka mükemmel ve zamanında teslimat yaptılar. Her şey için kendilerine teşekkür ederim.'
  },
  {
    name: 'Çilem',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Bütün perdelerimizi eksiksiz ve sorunsuz bir şekilde hallettiler tavsiye ediyorum. Cumali beye teşekkürler'
  },
  {
    name: 'Zeynep Diri',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Perdeye ihtiyacımız oldugunda hiç düşünmeden Çekmeköy doğan perdeye gidiyoruz çalışanları da çok ilgili perdeleride çok kaliteli çok güzel'
  },
  {
    name: 'Büşra Seven',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Perde dükkanından çok memnun kaldım. Hem çeşitlilik hem de kalite açısından beklentilerimi karşıladı. Çalışanlar ilgiliydi ve seçim yapmamda yardımcı oldular. Aldığım perdeler evime çok yakıştı ve odalarımın havasını değiştirdi. Fiyatlar da makul seviyedeydi. Kesinlikle tekrar alışveriş yaparım🥰'
  },
  {
    name: 'Şevval Arslan',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Çok memnun kaldım emeğinize sağlık ayrıca çok güler yüzlüler kesinlikle tavsiye ederim'
  },
  {
    name: 'Kayra Div.',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Mükemmel kalite hızlı teslimat'
  },
  {
    name: 'Miraç Efe Gündoğdu',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Doğan perdeden aldığımız perdelee güzel hizmet ise müthişti...'
  },
  {
    name: 'İlyas Köksal',
    role: 'Google Müşteri Yorumu',
    stars: 5,
    text: 'Mükemmel bir işçilik ürünler çok kaliteli.tavsiye ederim. Teşekkürler'
  }
];

// GET: Fetch all testimonials from Sanity
export async function GET() {
  try {
    const sanityTestimonials = await client.fetch('*[_type == "testimonial"] | order(_createdAt desc)');
    
    if (!sanityTestimonials || sanityTestimonials.length === 0) {
      return NextResponse.json(DEFAULT_TESTIMONIALS);
    }
    
    const testimonials = sanityTestimonials.map(t => ({
      id: t._id,
      name: t.name,
      role: t.role || 'Müşteri',
      stars: t.stars || 5,
      text: t.text,
    }));
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Fetch testimonials from Sanity error, returning defaults:', error);
    return NextResponse.json(DEFAULT_TESTIMONIALS);
  }
}

// POST: Create a new testimonial in Sanity (Admin Only)
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
    const { name, role, stars, text } = body;
    
    if (!name || !role || !text) {
      return NextResponse.json({ error: 'İsim, rol ve yorum metni alanları zorunludur.' }, { status: 400 });
    }
    
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Sanity yazma yetkisi (SANITY_API_WRITE_TOKEN) sunucuda tanımlanmamış.' }, { status: 500 });
    }

    const starCount = parseInt(stars) || 5;

    const newTestimonial = await client.create({
      _type: 'testimonial',
      name,
      role,
      stars: starCount,
      text,
    });
    
    return NextResponse.json({
      id: newTestimonial._id,
      name: newTestimonial.name,
      role: newTestimonial.role,
      stars: newTestimonial.stars,
      text: newTestimonial.text,
    }, { status: 201 });
  } catch (error) {
    console.error('Create testimonial in Sanity error:', error);
    return NextResponse.json({ error: 'Sanity üzerinde yorum oluşturulurken bir hata oluştu.' }, { status: 500 });
  }
}
