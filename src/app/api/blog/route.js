import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const DEFAULT_BLOGS = [
  {
    title: "2025'TE SOSYAL MEDYA PAZARLAMA TRENDLERİ",
    slug: "2025-sosyal-medya-pazarlama-trendleri",
    excerpt: "Sosyal medya pazarlaması, her geçen yıl kullanıcı davranışlarındaki değişim, teknolojik yenilikler ve algoritma güncellemeleriyle evrim geçirmeye devam ediyor.",
    content: "Sosyal medya reklamcılığı artık dijital pazarlamanın temel taşlarından biri. Facebook ve Instagram, Meta çatısı altında birleşmiş olsalar da reklam modelleri ve kullanıcı davranışları açısından hâlâ birbirinden farklı stratejiler gerektiriyor. Bu yazıda 2025 yılı itibarıyla sosyal medya kanallarındaki yeni trendleri ve markanız için nasıl kullanabileceğinizi inceliyoruz. \n\nÖzellikle yapay zeka destekli içerik üretimi, dikey video formatları (Reels, TikTok) ve mikro-toplulukların gücü 2025 pazarlama dünyasını domine etmeye devam ediyor. Markaların klasik statik gönderiler yerine kullanıcılarla doğrudan bağ kuran samimi video anlatılarına odaklanması gerekiyor.",
    imageUrl: "/images/insta1.png",
    category: "NEWS"
  },
  {
    title: "SEO NEDİR? 2025 İÇİN ARAMA MOTORU OPTİMİZASYONU REHBERİ",
    slug: "seo-nedir-2025-arama-motoru-optimizasyonu-rehberi",
    excerpt: "Dijital dünyada başarılı olmak istiyorsanız, sadece bir web sitenizin olması yetmez. O sitenin Google'da görünür olması gerekir. Arama Motoru Optimizasyonu (SEO) detaylı rehberi.",
    content: "Dijital dünyada başarılı olmak istiyorsanız, sadece bir web sitenizin olması yetmez. O sitenin Google'da görünür olması, hatta ilk sayfada yer alması gerekir. İşte bu noktada devreye giren şey; SEO (Search Engine Optimization) yani Arama Motoru Optimizasyonu'dur. \n\nBu rehberde, SEO nedir, nasıl çalışır ve 2025'te dikkat etmeniz gereken güncel arama motoru optimizasyon stratejileri nelerdir sorularını detaylı şekilde ele alıyoruz.\n\n2025 SEO dünyasında, sadece anahtar kelime eşleştirmesi değil; kullanıcı deneyimi (UX), sayfa yüklenme hızları, mobil uyumluluk ve yapay zeka tabanlı Google arama algoritmalarına uyumluluk en kritik etkenlerdir. Web sitenizin hızı, temiz kod yapısı ve kullanıcıyı sitede tutan faydalı içerikler organik sıralamanızı doğrudan belirler.",
    imageUrl: "/images/insta2.png",
    category: "NEWS"
  },
  {
    title: "FACEBOOK VE INSTAGRAM REKLAMLARI ARASINDAKİ FARK",
    slug: "facebook-ve-instagram-reklamları-arasındaki-fark",
    excerpt: "Sosyal medya reklamcılığı artık dijital pazarlamanın temel taşlarından biri. Facebook ve Instagram reklam modelleri ve kullanıcı davranışları arasındaki temel farklar.",
    content: "Sosyal medya reklamcılığı artık dijital pazarlamanın temel taşlarından biri. Facebook ve Instagram, Meta çatısı altında birleşmiş olsalar da, reklam modelleri ve kullanıcı davranışları açısından hâlâ birbirinden farklı stratejiler gerektiriyor. Bu yazıda 2025 yılı itibarıyla Facebook ve Instagram reklamları arasındaki farkları, hedef kitle davranışlarını ve bütçenizi en verimli şekilde nasıl yönetebileceğinizi inceliyoruz.\n\nFacebook daha çok bilgi odaklı, detaylı makale ve uzun soluklu video paylaşımlarına uygunken; Instagram tamamen görsel estetik, Reels videoları ve anlık hikayeler üzerinden satış odaklı kampanyalara hitap eder. Doğru kanalı seçmek bütçenizin geri dönüş oranını doğrudan etkiler.",
    imageUrl: "/images/insta3.png",
    category: "NEWS"
  }
];

// Helper: Convert Turkish characters to English slug
function slugify(text) {
  const trMap = {
    'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O',
    'ñ': 'n', 'Ñ': 'N', 'æ': 'ae', 'ß': 'ss'
  };
  
  let str = text.toString().toLowerCase();
  
  // Replace Turkish letters
  for (let key in trMap) {
    str = str.replace(new RegExp(key, 'g'), trMap[key]);
  }
  
  return str
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// GET: Fetch all blog posts (with auto-seeding if empty)
export async function GET() {
  try {
    let posts = await db.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Auto-seed if database setting or table is empty
    if (posts.length === 0) {
      const createPromises = DEFAULT_BLOGS.map((blog) => {
        return db.blogPost.create({
          data: blog
        });
      });
      await Promise.all(createPromises);
      posts = await db.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Fetch blogs error, returning defaults:', error);
    return NextResponse.json(DEFAULT_BLOGS);
  }
}

// POST: Add new blog post (secured)
export async function POST(request) {
  try {
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
    if (!title || !content) {
      return NextResponse.json({ error: 'Başlık ve içerik alanları zorunludur.' }, { status: 400 });
    }
    
    const baseSlug = slugify(title);
    // Ensure slug is unique
    let slug = baseSlug;
    let count = 1;
    let exists = await db.blogPost.findUnique({ where: { slug } });
    while (exists) {
      slug = `${baseSlug}-${count}`;
      exists = await db.blogPost.findUnique({ where: { slug } });
      count++;
    }
    
    const newPost = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || content.substring(0, 150) + '...',
        content,
        imageUrl: imageUrl || '/images/insta1.png',
        publicId: publicId || '',
        category: category || 'NEWS',
      }
    });
    
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: 'Veritabanı hatası oluştu.' }, { status: 500 });
  }
}
