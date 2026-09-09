"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Ruler } from 'lucide-react';

const CATEGORIES = [
  'Hepsi',
  'Tül Perde',
  'Fon Perde',
  'Zebra Perde',
  'Stor Perde',
  'Akıllı Perde'
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');

  // Sync category state with query param if present
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      const matched = CATEGORIES.find(c => c.toLowerCase() === catParam.toLowerCase());
      if (matched) {
        setSelectedCategory(matched);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setProducts(data);
          }
        }
      } catch (err) {
        console.error('Products load failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'Hepsi') {
      router.push('/urunler');
    } else {
      router.push(`/urunler?category=${encodeURIComponent(cat)}`);
    }
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'Hepsi') {
      return p.category === selectedCategory;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      
      {/* Title Header */}
      <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
        <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">Çekmeköy Koleksiyonlarımız</span>
        <h1 className="text-3xl font-serif font-light text-slate-900 leading-tight">Çekmeköy Perde Modellerimiz</h1>
        <p className="text-slate-500 text-xs font-semibold">Doğan Perde güvencesiyle evinize en uygun Çekmeköy tül, stor, zebra ve fon perde modellerimizi kategorilere göre inceleyin.</p>
      </div>

      {/* Category Pills Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`py-2 px-5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-950 border-slate-950 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List (Full Width) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-slate-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-4">
          <p className="text-slate-500 text-xs font-semibold">Aradığınız kriterlere uygun perde modeli bulunamadı.</p>
          <button
            onClick={() => handleCategoryChange('Hepsi')}
            className="bg-primary-500 hover:bg-primary-650 text-white font-bold py-2 px-6 rounded-full text-xs cursor-pointer"
          >
            Tüm Modelleri Göster
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const detailUrl = `/urunler/${product.id}`;
            
            return (
              <Link
                key={product.id}
                href={detailUrl}
                className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all hover:border-slate-250"
              >
                {/* Product Image */}
                <div className="relative h-40 sm:h-56 w-full overflow-hidden bg-slate-50 shrink-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-800 text-[8px] sm:text-[9px] uppercase font-black py-0.5 px-2 rounded-full border border-slate-200/20">
                    {product.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col gap-2 flex-grow">
                  <h3 className="font-extrabold text-slate-900 group-hover:text-primary-500 transition-colors text-xs sm:text-sm leading-snug line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed hidden sm:block">
                    {product.description}
                  </p>
                  
                  <div className="border-t border-slate-100 pt-3 mt-auto flex items-center justify-between text-[10px] text-primary-600 font-extrabold">
                    <span>İncele</span>
                    <span className="flex items-center gap-1 bg-primary-50 py-0.5 px-2 rounded-full">
                      <Ruler size={10} />
                      <span>Teklif Al</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-wider">Yükleniyor...</span>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
