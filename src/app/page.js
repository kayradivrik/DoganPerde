"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Calendar, ArrowRight, Shield, Clock, Ruler, BadgePercent, MessageSquare, Scissors, HelpCircle, Layers } from 'lucide-react';
import { urlFor } from '@/lib/sanity';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Fetch products, settings, categories and testimonials
  useEffect(() => {
    async function loadData() {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }

      try {
        const setRes = await fetch('/api/settings');
        if (setRes.ok) {
          const data = await setRes.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load settings on homepage:', err);
      }

      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
      } catch (err) {
        console.error('Failed to load categories on homepage:', err);
      }

      try {
        const testRes = await fetch('/api/testimonials');
        if (testRes.ok) {
          const testData = await testRes.json();
          setTestimonials(testData);
        }
      } catch (err) {
        console.error('Failed to load testimonials on homepage:', err);
      }

    }
    loadData();
  }, []);

  const whatsappMessage = encodeURIComponent('Merhaba, Doğan Perde modelleriniz hakkında bilgi almak ve ücretsiz ölçü randevusu talep etmek istiyorum.');
  const whatsappPhone = settings?.whatsapp?.replace(/[^0-9]/g, '') || '905417310749';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

  const heroImageSrc = settings?.heroImage?.asset
    ? urlFor(settings.heroImage).url()
    : "/images/slide1.png";

  return (
    <div className="bg-[#FAF8F5] text-slate-800 font-sans min-h-screen selection:bg-primary-500/20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[75vh] flex items-center justify-center bg-slate-900 overflow-hidden" id="hero">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent z-10" />
        <Image
          src={heroImageSrc}
          alt="Lüks Perde Tasarımları"
          fill
          priority
          className="object-cover object-center opacity-70"
        />
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl flex flex-col gap-6">
            <span className="text-primary-400 font-bold text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="w-8 h-px bg-primary-400" />
              Pencere Tasarımları
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-[1.2] font-light">
              {settings?.heroTitle ? settings.heroTitle : (
                <>
                  Evinizin Havasını Değiştiren <br />
                  <span className="italic text-primary-300 font-serif font-normal">Zarif Dokunuşlar.</span>
                </>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              {settings?.siteSlogan || "Doğan Perde: Tül, Stor, Jaluzi ve Fon Perdelerde Zengin Model Seçenekleri ve Ücretsiz Ölçü Hizmeti."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
              <Link
                href="#urunler"
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 text-center text-sm tracking-wide"
              >
                Kataloğu İncele
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 hover:-translate-y-0.5 text-center text-sm tracking-wide"
              >
                Ücretsiz Ölçü Randevusu Al
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES SHOWCASE */}
      <section className="py-20 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12" id="urunler">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
          <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">Koleksiyonlar</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 font-light">En Çok Tercih Edilen Modellerimiz</h2>
          <p className="text-slate-500 text-xs font-semibold">Mekanlarınıza değer katacak ve tarzınızı yansıtacak özel dikim perde kategorileri.</p>
        </div>

        {/* Tabbed Interactive Category Showcase */}
        {(() => {
          const displayCategories = categories.length > 0 ? categories : [
            { title: 'Tül Perdeler', description: 'Işığı süzerek evinize ferahlık katan lüks vual ve keten dokuma tüller. Salonunuzun havasını yumuşatır.', image: '/images/media__1785224311179.png', slug: { current: 'Tül Perde' } },
            { title: 'Stor Perdeler', description: 'Minimalist mekanlar için pratik, kolay temizlenebilen şık stor sistemleri. Ofis ve mutfaklar için idealdir.', image: '/images/media__1785224299998.png', slug: { current: 'Stor Perde' } },
            { title: 'Jaluzi & Zebra', description: 'Işık kontrolü sağlayan modern ahşap jaluzi, cam balkon plise perdeleri ve fonksiyonel zebra modelleri.', image: '/images/media__1785224305336.jpg', slug: { current: 'Zebra Perde' } },
            { title: 'Fon Perdeler', description: 'Ağır dökümlü premium kadife ve keten fon perdeler ile tamamlayıcı aksesuarlar. Odanıza derinlik katar.', image: '/images/media__1785224313426.png', slug: { current: 'Fon Perde' } }
          ];

          const activeCat = displayCategories[activeCategory] || displayCategories[0] || {};

          return (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              
              {/* Tabs Selector */}
              <div className="md:col-span-4 flex flex-row md:flex-col justify-start gap-2.5 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0">
                {displayCategories.map((cat, idx) => (
                  <button
                    key={cat._id || idx}
                    onClick={() => setActiveCategory(idx)}
                    className={`py-3.5 px-6 rounded-xl text-xs font-bold tracking-wider uppercase text-left whitespace-nowrap transition-all cursor-pointer border ${
                      activeCategory === idx
                        ? 'bg-[#ea580c] border-[#ea580c] text-white shadow-sm'
                        : 'bg-white border-slate-150 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>

              {/* Featured Category Card Content */}
              <div className="md:col-span-8 bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row items-stretch">
                
                {/* Category Text Info */}
                <div className="flex-1 p-8 flex flex-col gap-5 justify-center">
                  <span className="text-primary-500 font-extrabold uppercase text-[10px] tracking-widest">
                    Öne Çıkan Seçim
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    {activeCat.title}
                  </h3>
                  <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                    {activeCat.description}
                  </p>
                  
                  <Link
                    href={`/urunler?category=${encodeURIComponent(activeCat.slug?.current || activeCat.title)}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary-500 hover:text-primary-655 mt-2 self-start"
                  >
                    <span>Tüm Modelleri Gör</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Category Image Display */}
                <div className="flex-1 relative h-60 sm:h-auto min-h-[220px] bg-slate-50">
                  {(() => {
                    const catImgSrc = activeCat.image?.asset
                      ? urlFor(activeCat.image).url()
                      : (typeof activeCat.image === 'string' ? activeCat.image : '/images/media__1785224311179.png');
                    
                    return (
                      <Image
                        src={catImgSrc}
                        alt={activeCat.title}
                        fill
                        className="object-cover transition-all duration-500"
                      />
                    );
                  })()}
                </div>

              </div>

            </div>
          );
        })()}
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="bg-slate-50/50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">Ayrıcalıklarımız</span>
            <h2 className="text-3xl font-serif text-slate-900 font-light">Neden Doğan Perde?</h2>
            <p className="text-slate-500 text-xs font-semibold">Tasarım, işçilik ve kusursuz müşteri deneyimini bir araya getiriyoruz.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Sınırsız Kumaş Seçeneği", desc: "Zengin kartela ve ithal kumaş koleksiyonumuzla hayalinizdeki perdeyi tasarlayın.", icon: Layers },
              { title: "Tam Zamanında Montaj", desc: "Belirlenen teslim tarihinde, temiz ve kusursuz kurulum garantisi.", icon: Clock },
              { title: "Ücretsiz Ölçüm Hizmeti", desc: "Yerinde keşif yapıyor, lazerle milimetrik ölçüleri ücretsiz alıyoruz.", icon: Ruler },
              { title: "En Uygun Fiyat Garantisi", desc: "Kendi atölyemizde üretim gücümüzle en kaliteli işçiliği en makul fiyatla sunuyoruz.", icon: BadgePercent }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif font-bold text-slate-800 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. BEFORE & AFTER GALLERY */}
      <section className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12" id="oncesi-sonrasi">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
          <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">Galeri</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 font-light">Öncesi & Sonrası</h2>
          <p className="text-slate-500 text-sm font-medium">Uygulamalarımızdaki farkı görün. Yaşam alanlarınıza değer katıyoruz.</p>
        </div>

        {/* Custom Interactive Before/After Slider */}
        {(() => {
          const beforeImgSrc = settings?.beforeImage?.asset
            ? urlFor(settings.beforeImage).url()
            : "/images/media__1785224299998.png";

          const afterImgSrc = settings?.afterImage?.asset
            ? urlFor(settings.afterImage).url()
            : "/images/media__1785224305336.jpg";

          return (
            <div className="relative w-full h-[300px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 select-none max-w-3xl mx-auto group">
              
              {/* Right/After Image (Base Layer) */}
              <div className="absolute inset-0">
                <Image 
                  src={afterImgSrc} 
                  alt="Cam Balkon Plise Perde Açık" 
                  fill 
                  className="object-cover"
                  priority
                />
                <span className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md text-slate-900 border border-white/40 text-[10px] uppercase font-black tracking-widest py-1.5 px-4 rounded-full shadow-sm z-10">
                  Perde Açık
                </span>
              </div>

              {/* Left/Before Image (Width controlled by sliderPos state) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white/90"
                style={{ width: `${sliderPos}%` }}
              >
                <div className="absolute inset-0 w-[800px] h-[300px] sm:h-[500px]" style={{ width: '800px', height: '100%' }}>
                  <Image 
                    src={beforeImgSrc} 
                    alt="Cam Balkon Plise Perde Kapalı" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <span className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md text-white border border-white/10 text-[10px] uppercase font-black tracking-widest py-1.5 px-4 rounded-full z-10">
                  Perde Kapalı
                </span>
              </div>

              {/* Transparent Input Range Overlay to catch drag actions */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPos} 
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Before/After Slider"
              />

              {/* Drag Handle Overlay */}
              <div 
                className="absolute inset-y-0 w-0.5 bg-white cursor-ew-resize pointer-events-none z-15"
                style={{ left: `${sliderPos}%` }}
              >
                {/* Glowing Ring Handle */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center text-slate-800 border border-slate-200 hover:scale-110 active:scale-95 transition-transform duration-200">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-[#ea580c]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                {/* Helper Pulse Tip */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 -mt-16 bg-[#ea580c] text-white text-[8px] font-black uppercase tracking-widest py-1 px-2.5 rounded shadow-sm opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap animate-bounce pointer-events-none">
                  KAYDIRIN
                </div>
              </div>

            </div>
          );
        })()}
      </section>

      {/* 4.5 CLIENT TESTIMONIALS */}
      <section className="bg-slate-50/60 py-20 border-y border-slate-100/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          
          <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
            <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">Müşteri Deneyimleri</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 font-light">Müşterilerimizin Yorumları</h2>
            <p className="text-slate-500 text-xs font-semibold">Doğan Perde atölyemizden hizmet alan ev ve iş yeri sahiplerinin deneyimleri.</p>
          </div>

          {/* Infinite Loop Scrolling Marquee */}
          {(() => {
            const displayTestimonials = testimonials.length > 0 ? testimonials : [
              {
                name: "Yakup Canvar",
                role: "Google Müşteri Yorumu",
                text: "Perdecimden gerçekten çok memnunum. Hem ofisimde hem de evimde tercih ettim ve her iki yerde de sonuç harika oldu. Kumaş kalitesi, işçilik ve montaj süreci gerçekten çok başarılıydı. İlgili ve çözüm odaklı bir ekipleri var, her detayıyla ilgilendiler. Gönül rahatlığıyla tavsiye ederim.",
                stars: 5
              },
              {
                name: "Elif PEŞKİR",
                role: "Google Müşteri Yorumu",
                text: "Cumali bey ilgilendi bizimle gerçekten dört dörtlük işçilik cumali bey verdiği sözün arkasında durdu 1 günde perdelerim teslim edildi taşınma esnasında perdelerim kayboldu acil istedim sağolsun özenle ilgilendi çok teşekkür ederim gönül rahatlığıyla işletmeye ve cumali bey'e güvenebilirsiniz.",
                stars: 5
              },
              {
                name: "Esra KARAKAŞ",
                role: "Google Müşteri Yorumu",
                text: "Tüm odaları Doğan Perdeye yaptırdık. Öncelikle fiyatta çok yardımcı oldular. Her hangi hoşumuza gitmeyen noktada hemen değişim yaptılar. Diğer satıcılar gibi bugun geliyoruz diyip 1 hafta ertelemeden dedikleri tarihte geldiler. Tüm odalarımızı yaptırdık güvenebileceğiniz bir yerr",
                stars: 5
              },
              {
                name: "Mecit Yılmaz",
                role: "Google Müşteri Yorumu",
                text: "İşinin ehli ,ilgi alaka mükemmel ve zamanında teslimat yaptılar. Her şey için kendilerine teşekkür ederim.",
                stars: 5
              },
              {
                name: "Çilem",
                role: "Google Müşteri Yorumu",
                text: "Bütün perdelerimizi eksiksiz ve sorunsuz bir şekilde hallettiler tavsiye ediyorum. Cumali beye teşekkürler",
                stars: 5
              },
              {
                name: "Zeynep Diri",
                role: "Google Müşteri Yorumu",
                text: "Perdeye ihtiyacımız oldugunda hiç düşünmeden Çekmeköy doğan perdeye gidiyoruz çalışanları da çok ilgili perdeleride çok kaliteli çok güzel",
                stars: 5
              },
              {
                name: "Büşra Seven",
                role: "Google Müşteri Yorumu",
                text: "Perde dükkanından çok memnun kaldım. Hem çeşitlilik hem de kalite açısından beklentilerimi karşıladı. Çalışanlar ilgiliydi ve seçim yapmamda yardımcı oldular. Aldığım perdeler evime çok yakıştı ve odalarımın havasını değiştirdi. Fiyatlar da makul seviyedeydi. Kesinlikle tekrar alışveriş yaparım🥰",
                stars: 5
              },
              {
                name: "Şevval Arslan",
                role: "Google Müşteri Yorumu",
                text: "Çok memnun kaldım emeğinize sağlık ayrıca çok güler yüzlüler kesinlikle tavsiye ederim",
                stars: 5
              },
              {
                name: "Kayra Div.",
                role: "Google Müşteri Yorumu",
                text: "Mükemmel kalite hızlı teslimat",
                stars: 5
              },
              {
                name: "Miraç Efe Gündoğdu",
                role: "Google Müşteri Yorumu",
                text: "Doğan perdeden aldığımız perdelee güzel hizmet ise müthişti...",
                stars: 5
              },
              {
                name: "İlyas Köksal",
                role: "Google Müşteri Yorumu",
                text: "Mükemmel bir işçilik ürünler çok kaliteli.tavsiye ederim. Teşekkürler",
                stars: 5
              }
            ];

            const duplicated = [...displayTestimonials, ...displayTestimonials];

            return (
              <div className="relative overflow-hidden w-full group-marquee py-4">
                
                {/* Left/Right Smooth Edge Fading Gradients */}
                <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-10 pointer-events-none" />
                
                {/* Scrolling Track Container */}
                <div className="animate-marquee gap-6 flex">
                  {duplicated.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col gap-4 w-[280px] sm:w-[350px] shrink-0 hover:shadow-md hover:border-slate-200 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Google Review Badge Icon in Top Right */}
                      <div className="absolute top-5 right-5 text-[#4285F4] opacity-80 flex items-center gap-1.5 bg-[#4285F4]/5 border border-[#4285F4]/10 py-1 px-2.5 rounded-full">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="text-[9px] font-black tracking-widest uppercase">GÜVENLİ</span>
                      </div>

                      <div className="flex text-amber-500 gap-0.5">
                        {Array.from({ length: item.stars || 5 }).map((_, i) => (
                          <span key={i} className="text-sm">★</span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-650 leading-relaxed font-semibold italic flex-grow pr-12">
                        "{item.text || item.comment}"
                      </p>
                      <div className="border-t border-slate-100 pt-3 flex flex-col">
                        <span className="text-xs font-black text-slate-800">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* 5. WHATSAPP REQUEST QUOTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-md border border-slate-800">
          <div className="flex flex-col gap-4 relative z-10 max-w-xl">
            <span className="text-primary-400 font-bold text-xs uppercase tracking-widest">Hızlı İletişim</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light leading-tight">Beğendiğiniz Kumaş İçin Teklif Alın</h2>
            <p className="text-slate-350 text-sm leading-relaxed font-medium">
              Evinizde ölçü randevusu oluşturmak, fiyat almak veya perde modellerimiz hakkında danışmak için hemen yazın.
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-750 text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all duration-300 cursor-pointer"
            >
              <MessageSquare size={20} className="fill-white/10" />
              <span className="text-sm tracking-wide">WhatsApp'tan Bilgi & Randevu Al</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. GOOGLE MAPS SIMULATION */}
      <section className="py-12 bg-[#F9F6F0]" id="iletisim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">Atölyemiz</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 font-light">Bizimle İletişime Geçin</h2>
            
            <div className="flex flex-col gap-4 text-sm text-slate-600 font-medium">
              <div>
                <h4 className="font-bold text-slate-800">Adres:</h4>
                <p className="mt-1">Şahinbey Cd. Çamlık Mah. No:114 Dük:A (Doğa Parkı Yanı), Çekmeköy / İstanbul</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Telefon:</h4>
                <p className="mt-1">0535 485 76 31 | 0541 731 07 49</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800">E-posta:</h4>
                <p className="mt-1">info@doganperde.com</p>
              </div>
            </div>
          </div>

          {/* Real Google Maps Embed */}
          <div className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden relative shadow-sm border border-slate-200">
            <iframe 
              src="https://maps.google.com/maps?q=Do%C4%9Fan%20Perde%20%C3%87ekmek%C3%B6y%20%C5%9Eahinbey%20Cd.&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(0.3)' }} 
              allowFullScreen="" 
              loading="lazy"
              title="Doğan Perde Google Maps"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
