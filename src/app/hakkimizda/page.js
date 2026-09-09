"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Scissors, ShieldCheck, Heart, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import { urlFor } from '@/lib/sanity';

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(0);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load settings in AboutPage:', err);
      }
    }
    loadSettings();
  }, []);

  const values = [
    {
      icon: Scissors,
      title: "Usta İşçilik",
      tagline: "Yarım Asırlık Dikim Zanaati",
      desc: "Ölçüsünden dikişine, pile ayarından montajına kadar her adımı ustalarımızın tecrübesiyle yönetiyoruz."
    },
    {
      icon: ShieldCheck,
      title: "Seçkin Kumaşlar",
      tagline: "Kusursuz Kalite Güvencesi",
      desc: "Solmayan, kolay temizlenen ve dökümlü yapısını yıllarca kaybetmeyen en seçkin kumaş markalarıyla çalışıyoruz."
    },
    {
      icon: Heart,
      title: "Birebir İlgi",
      tagline: "Kişiye Özel Çözümler",
      desc: "Sizi atölyemizde ağırlıyor veya numunelerimizle yerinizde ziyaret ederek pencereleriniz için en doğru perde stilini tasarlıyoruz."
    },
    {
      icon: Award,
      title: "Sorunsuz Kurulum",
      tagline: "Temiz ve Hızlı Montaj",
      desc: "Ölçüyü alan uzman ekibimiz, perdeleri bizzat monte eder. Size sadece yeni mekanınızın keyfini sürmek kalır."
    }
  ];

  const handleNext = () => {
    setActiveValue((prev) => (prev + 1) % values.length);
  };

  const handlePrev = () => {
    setActiveValue((prev) => (prev - 1 + values.length) % values.length);
  };

  const aboutImageSrc = settings?.aboutImage?.asset 
    ? urlFor(settings.aboutImage).url() 
    : "/images/media__1785224313426.png";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-20">
      
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
        <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">Biz Kimiz?</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-slate-900 leading-tight">
          {settings?.aboutTitle || "Çekmeköy Doğan Perde Zanaat & Güven Hikayesi"}
        </h1>
        <p className="text-slate-500 text-xs font-semibold">
          {settings?.aboutSubtitle || "Doğan Perde olarak, Çekmeköy Şahinbey Caddesi'ndeki kendi dikim atölyemizde hayallerinizi pencerelerinize işliyoruz."}
        </p>
      </div>

      {/* Main Story Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Side: Text */}
        <div className="flex flex-col gap-6 text-slate-655 leading-relaxed text-sm font-medium">
          <h2 className="text-3xl font-serif text-slate-950 font-normal leading-tight">Çekmeköy'de Başlayan Zanaat Yolculuğu</h2>
          {settings?.aboutContent ? (
            settings.aboutContent.split('\n').filter(Boolean).map((para, idx) => (
              <p key={idx}>{para}</p>
            ))
          ) : (
            <>
              <p>
                Doğan Perde'nin temelleri, makas tutmanın, kumaşa yön vermenin ve her dikişte titizlik göstermenin bir zanaat olduğu bilinciyle atıldı. Kurucularımız <strong>Doğan Bey</strong> ve <strong>Cumali Bey</strong> önderliğinde, Çekmeköy Şahinbey Caddesi'ndeki kendi dikim atölyemizde her pencereyi ayrı bir tuval olarak görüyoruz.
              </p>
              <p>
                Bizim için perde, sadece güneş ışığını kesen bir kumaş değil; evinizin ruhunu tamamlayan, odanın havasını bir anda ısıtan ya da ferahlatan en önemli dekorasyon parçasıdır. Hazır kalıplar kullanmak yerine, evinize gelip lazer hassasiyetinde ölçü alıyor, pencerelerinizin yapısına göre en uygun dikim tarzını belirliyoruz.
              </p>
              <p>
                Tül perdelerden fon perdelere, stor sistemlerinden uzaktan kumandalı akıllı perdelere kadar tüm modelleri kendi tezgahlarımızda, el emeğiyle hazırlıyoruz. Atölyemizin sıcaklığını ve güvenirliğini her teslimatta evlerinize taşımaktan mutluluk duyuyoruz.
              </p>
            </>
          )}
          <div className="mt-4">
            <Link
              href="/teklif-al"
              className="inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Ücretsiz Ölçü Randevusu Al
            </Link>
          </div>
        </div>

        {/* Right Side: Image Grid */}
        <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-slate-100 border border-slate-100/50">
          <Image
            src={aboutImageSrc}
            alt="Doğan Perde Özel Dikim Atölye Tasarımı"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-8">
            <div className="text-white flex flex-col gap-1.5">
              <span className="font-serif text-4xl block text-primary-400 font-light">Emeğin İzi</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-350 font-black">Kendi Atölyemizde Özel Üretim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values (Premium Slider Showcase) */}
      <section className="bg-slate-50/50 rounded-3xl p-8 sm:p-16 border border-slate-100 flex flex-col gap-12 items-center">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
          <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">Değerlerimiz</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 font-light">Bizleri Temsil Eden İlkelerimiz</h2>
          <p className="text-slate-500 text-xs font-semibold">Doğan Perde kalitesinin arkasında duran dört temel zanaat prensibi.</p>
        </div>

        {/* Premium Value Card Slider */}
        <div className="w-full max-w-2xl bg-white border border-slate-150 rounded-3xl p-8 sm:p-12 shadow-md flex flex-col items-center text-center gap-8 relative overflow-hidden min-h-[360px] justify-center">
          
          {/* Top Decorative Graphic */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-400 via-[#ea580c] to-orange-700" />
          
          {/* Active Card Body */}
          {(() => {
            const ActiveIcon = values[activeValue].icon;
            return (
              <div className="flex flex-col items-center gap-6 transition-all duration-500 transform scale-100 animate-fadeIn">
                
                {/* Modern Icon Ring Container */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-primary-100 rounded-full blur-sm opacity-50 animate-pulse" />
                  <div className="w-20 h-20 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-lg relative z-10">
                    <ActiveIcon size={36} />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 max-w-md">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ea580c] bg-orange-50 py-1 px-3 rounded-full border border-orange-100/30 self-center">
                    {values[activeValue].tagline}
                  </span>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-slate-950 mt-1">
                    {values[activeValue].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold mt-1">
                    {values[activeValue].desc}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Minimalist Floating Controls */}
          <div className="flex items-center gap-12 mt-4 relative z-10">
            {/* Prev Arrow */}
            <button 
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-sm cursor-pointer transition-all bg-white hover:scale-105 active:scale-95"
              aria-label="Önceki"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Indicator Dots */}
            <div className="flex gap-2">
              {values.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveValue(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    activeValue === idx 
                      ? 'bg-[#ea580c] w-6' 
                      : 'bg-slate-250 hover:bg-slate-400'
                  }`}
                  aria-label={`Slayt ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button 
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-sm cursor-pointer transition-all bg-white hover:scale-105 active:scale-95"
              aria-label="Sonraki"
            >
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
