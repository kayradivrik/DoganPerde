"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Eye, Grid } from 'lucide-react';
import { urlFor } from '@/lib/sanity';

const MOCK_GALLERY = [
  { _id: 'mock1', title: 'Modern Salon Tül ve Fon Perde Uygulaması', category: 'tul', image: '/images/media__1785224311179.png' },
  { _id: 'mock2', title: 'Minimalist Mutfak Stor Perde Montajı', category: 'stor', image: '/images/media__1785224299998.png' },
  { _id: 'mock3', title: 'Ofis Ahşap Jaluzi Perde Kontrolü', category: 'jaluzi', image: '/images/media__1785224305336.jpg' },
  { _id: 'mock4', title: 'Yatak Odası Kadife Dökümlü Fon Perde', category: 'fon', image: '/images/media__1785224313426.png' },
  { _id: 'mock5', title: 'Lüks Vual Tül Perde Detay', category: 'tul', image: '/images/slide1.png' },
  { _id: 'mock6', title: 'Balkon Plise Perde Öncesi/Sonrası', category: 'jaluzi', image: '/images/media__1785224308267.png' }
];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setGalleryItems(data);
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const items = galleryItems;

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const getImgSrc = (item) => {
    if (item.image?.asset) {
      return urlFor(item.image).url();
    }
    return typeof item.image === 'string' ? item.image : '/images/slide1.png';
  };

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'Escape') handleCloseLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const categories = [
    { label: 'TÜM FOTOĞRAFLAR', value: 'all' },
    { label: 'TÜL PERDE', value: 'tul' },
    { label: 'STOR PERDE', value: 'stor' },
    { label: 'JALUZİ & ZEBRA', value: 'jaluzi' },
    { label: 'FON PERDE', value: 'fon' },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20 pt-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        
        {/* Title Heading */}
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <span className="text-[#ea580c] font-extrabold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5">
            <Grid size={14} />
            Koleksiyonumuz
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-slate-900 leading-tight">Çekmeköy Perde Uygulama Galerisi</h1>
          <p className="text-slate-500 text-xs font-semibold">Doğan Perde güvencesiyle Çekmeköy, Sancaktepe ve Ümraniye müşterilerimizin evlerinde yaptığımız perde montaj görselleri.</p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200/60 pb-5 max-w-2xl mx-auto w-full">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setLightboxIndex(null);
              }}
              className={`py-2.5 px-5 rounded-full text-[10px] font-bold tracking-widest transition-all cursor-pointer border ${
                selectedCategory === cat.value
                  ? 'bg-[#ea580c] border-[#ea580c] text-white shadow-sm shadow-[#ea580c]/15'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-150 p-16 rounded-3xl text-center flex flex-col items-center gap-3 max-w-md mx-auto">
            <span className="text-slate-400 font-serif text-2xl font-light">Fotoğraf Bulunmamaktadır</span>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Bu kategori için henüz yüklenmiş bir uygulama görseli bulunmamaktadır.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item._id}
                onClick={() => handleOpenLightbox(idx)}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden group cursor-pointer shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-[#ea580c]/10 transition-all duration-500 ease-out bg-slate-100"
              >
                <Image
                  src={getImgSrc(item)}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Modern Minimalist Hover Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                  <span className="text-[9px] uppercase tracking-widest text-primary-400 font-extrabold mb-1">
                    {categories.find(c => c.value === item.category)?.label || 'UYGULAMA'}
                  </span>
                  <h3 className="text-white text-sm font-serif font-bold leading-snug">
                    {item.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-white/80 font-bold">
                    <span>Görseli Büyüt</span>
                    <Eye size={12} className="text-[#ea580c]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Slider Overlay */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div 
          onClick={handleCloseLightbox}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fade-in"
        >
          {/* Top Panel Actions */}
          <div className="flex justify-between items-center w-full z-10">
            <span className="text-white/60 font-bold text-xs tracking-wider">
              {lightboxIndex + 1} / {filteredItems.length}
            </span>
            <button
              onClick={handleCloseLightbox}
              className="text-white hover:text-[#ea580c] bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all focus:outline-none cursor-pointer"
              aria-label="Kapat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Central Stage Slider */}
          <div className="relative flex-grow flex items-center justify-center w-full max-h-[75vh] my-4 select-none">
            {/* Prev arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 z-20 text-white hover:text-[#ea580c] bg-white/5 hover:bg-white/15 p-3 rounded-full transition-all focus:outline-none cursor-pointer border border-white/5"
              aria-label="Önceki"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Main Lightbox Image */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full max-w-4xl rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-auto"
            >
              <Image
                src={getImgSrc(filteredItems[lightboxIndex])}
                alt={filteredItems[lightboxIndex].title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Next arrow */}
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 z-20 text-white hover:text-[#ea580c] bg-white/5 hover:bg-white/15 p-3 rounded-full transition-all focus:outline-none cursor-pointer border border-white/5"
              aria-label="Sonraki"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Caption Info */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full text-center max-w-2xl mx-auto flex flex-col gap-1 z-10 bg-slate-900/60 p-4 rounded-2xl backdrop-blur-sm border border-white/5"
          >
            <span className="text-[10px] tracking-widest text-[#ea580c] font-black uppercase">
              {categories.find(c => c.value === filteredItems[lightboxIndex].category)?.label || 'GÖRSEL DETAYI'}
            </span>
            <p className="text-white text-sm font-medium leading-relaxed">
              {filteredItems[lightboxIndex].title}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
