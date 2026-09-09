"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X, Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted or dismissed the cookie banner
    const consent = localStorage.getItem('doganperde_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth page load transition
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('doganperde_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('doganperde_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-500 font-sans">
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-800 text-white p-5 rounded-2xl shadow-2xl flex flex-col gap-4 relative">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[#ea580c]">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Cookie size={18} />
            </div>
            <span className="font-extrabold text-sm text-white tracking-wide">
              Çerez & KVKK Bilgilendirmesi
            </span>
          </div>

          <button
            onClick={handleDecline}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            title="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Description */}
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          Sitemizde deneyiminizi iyileştirmek, hizmetlerimizi sunmak ve KVKK mevzuatına uygun analizler yapmak amacıyla çerezler kullanılmaktadır. Detaylı bilgi için{' '}
          <Link href="/kvkk" className="text-orange-400 underline hover:text-orange-300 font-semibold">
            KVKK Aydınlatma Metni
          </Link>{' '}
          ve{' '}
          <Link href="/gizlilik-politikasi" className="text-orange-400 underline hover:text-orange-300 font-semibold">
            Gizlilik Politikası
          </Link>{' '}
          sayfalarımızı inceleyebilirsiniz.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 bg-[#ea580c] hover:bg-orange-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-md hover:shadow-orange-500/20 text-center"
          >
            Kabul Et
          </button>
          
          <button
            onClick={handleDecline}
            className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition-colors cursor-pointer text-center"
          >
            Sadece Gerekli
          </button>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium pt-0.5">
          <ShieldCheck size={12} className="text-emerald-400" />
          <span>Verileriniz 6698 Sayılı KVKK kapsamında korunmaktadır.</span>
        </div>

      </div>
    </div>
  );
}
