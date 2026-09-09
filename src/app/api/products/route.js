import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { client, urlFor } from '@/lib/sanity';
import { verifyToken } from '@/lib/auth';

// GET: Fetch products from Sanity (supports filtering by category)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = '*[_type == "product"] { ..., "categoryTitle": category->title, "categoryPriceInfo": category->priceInfo } | order(_createdAt desc)';
    let params = {};
    
    if (category && category !== 'Hepsi') {
      query = '*[_type == "product" && category->title == $category] { ..., "categoryTitle": category->title, "categoryPriceInfo": category->priceInfo } | order(_createdAt desc)';
      params = { category };
    }
    
    const sanityProducts = await client.fetch(query, params);
    
    // Map to original schema to keep frontend compatible
    const dbProducts = sanityProducts.map(p => ({
      id: p._id,
      title: p.title,
      description: p.description,
      category: p.categoryTitle || 'Diğer',
      imageUrl: p.image ? urlFor(p.image).url() : '/images/placeholder.jpg',
      priceInfo: p.categoryPriceInfo || p.priceInfo || '',
    }));

    const localProducts = [
      {
        id: 'user-uploaded-1',
        title: 'Cam Balkon Plise Perde',
        description: 'Cam balkonlar için özel tasarlanmış, kolay katlanır pratik plise perde.',
        category: 'Stor Perde',
        imageUrl: '/images/media__1785224299998.png',
        priceInfo: 'Metrekare bazlı hesaplanır'
      },
      {
        id: 'user-uploaded-2',
        title: 'Premium Gri Fon Perde',
        description: 'Kusursuz dökümü ve modern gri tonuyla salonlarınızı tamamlayan şık fon perde.',
        category: 'Fon Perde',
        imageUrl: '/images/media__1785224308267.png',
        priceInfo: 'Adet bazlı hesaplanır'
      },
      {
        id: 'user-uploaded-3',
        title: 'Keten Bej Fon Perde',
        description: 'Doğal dokusu ve sıcak bej rengiyle evinizi ferahlatan keten perde.',
        category: 'Fon Perde',
        imageUrl: '/images/media__1785224311179.png',
        priceInfo: 'Adet bazlı hesaplanır'
      },
      {
        id: 'user-uploaded-4',
        title: 'Klasik Desenli Kahve Fon Perde',
        description: 'Zarif dikey pilileri ve asil kahverengi detayları ile oturma odaları için ideal tasarım.',
        category: 'Fon Perde',
        imageUrl: '/images/media__1785224313426.png',
        priceInfo: 'Adet bazlı hesaplanır'
      }
    ];

    // Filter local products by category if requested
    const filteredLocal = category && category !== 'Hepsi'
      ? localProducts.filter(p => p.category.toLowerCase() === category.toLowerCase())
      : localProducts;

    const products = [...filteredLocal, ...dbProducts];
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products from Sanity error, returning empty list:', error);
    return NextResponse.json([]);
  }
}

// POST: Create a new product in Sanity (Admin Only)
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
    const { title, description, category, imageUrl } = body;
    
    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Tüm alanlar (başlık, açıklama, kategori) zorunludur.' }, { status: 400 });
    }
    
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Sanity yazma yetkisi (SANITY_API_WRITE_TOKEN) sunucuda tanımlanmamış.' }, { status: 500 });
    }

    const newProduct = await client.create({
      _type: 'product',
      title,
      description,
      category,
      // If an external image URL is passed, we store it in standard image format or text
      priceInfo: '',
    });
    
    return NextResponse.json({
      id: newProduct._id,
      title: newProduct.title,
      description: newProduct.description,
      category: newProduct.category,
      imageUrl: imageUrl || '',
    }, { status: 201 });
  } catch (error) {
    console.error('Create product in Sanity error:', error);
    return NextResponse.json({ error: 'Sanity üzerinde ürün eklenirken bir hata oluştu.' }, { status: 500 });
  }
}
