"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load settings in Navbar:', err);
      }
    }
    loadSettings();
  }, []);

  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/studio');
  if (isAdminPage) return null;

  const phoneRaw = settings?.whatsapp || settings?.phone1 || '905417310749';
  const cleanPhone = phoneRaw.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}`;
  const phoneCallUrl = `tel:+${cleanPhone}`;

  const displayLinks = settings?.navLinks && settings.navLinks.length > 0
    ? settings.navLinks
    : [
        { name: 'ANASAYFA', href: '/' },
        { name: 'MODELLERİMİZ', href: '/urunler' },
        { name: 'GALERİ', href: '/galeri' },
        { name: 'BLOG', href: '/blog' },
        { name: 'HAKKIMIZDA', href: '/hakkimizda' },
        { name: 'İLETİŞİM', href: '/iletisim' },
      ];

  return (
    <header className="w-full z-40 flex flex-col">
       {/* 1. Thin Black Top Bar */}
      <div className="bg-[#111] text-slate-300 text-[10px] sm:text-[11px] py-2 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          
          {/* Left Text Info */}
          <div className="flex flex-wrap items-center gap-2.5 font-medium tracking-wide">
            <a href={phoneCallUrl} className="text-slate-300 hover:text-white transition-colors">ARA</a>
            <span className="text-neutral-700">|</span>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors">MESAJ AT</a>
            <span className="text-neutral-700">|</span>
            <span className="text-slate-400">İstanbul Hızlı Keşif ve Montaj! Tüm Türkiye'ye Kargo İmkanı!</span>
          </div>

          {/* Right Links & Social Icons */}
          <div className="flex items-center gap-4">
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 text-neutral-450">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://instagram.com/doganperde_cekmekoy" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Youtube">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
            </div>

            <span className="text-neutral-700">|</span>

            {/* Quick Menu */}
            <div className="flex items-center gap-2.5 font-medium">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors">WHATSAPP</a>
              <span className="text-neutral-700">|</span>
              <Link href="/iletisim" className="text-slate-300 hover:text-white transition-colors">İLETİŞİM</Link>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Main Orange Navbar */}
      <div className="bg-[#ea580c] text-white py-4 shadow-xl border-t border-primary-700/35">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex flex-col">
                <span className="font-serif font-black text-lg tracking-wider text-white leading-none">
                  DOĞAN PERDE
                </span>
                <span className="text-[8px] uppercase tracking-widest text-orange-100 font-extrabold leading-none mt-1">
                  Tasarım & Atölye
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {displayLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-xs font-bold tracking-widest transition-all duration-200 hover:text-amber-100 ${
                      isActive 
                        ? 'text-amber-100 underline decoration-2 underline-offset-4' 
                        : 'text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Call to Action Button */}
            <div className="hidden lg:block">
              <Link
                href="/teklif-al"
                className="bg-[#111] hover:bg-[#222] text-white text-[10px] tracking-widest font-extrabold py-2.5 px-5 rounded transition-all duration-300 shadow-md"
              >
                HIZLI KEŞİF AL
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white focus:outline-none p-1.5 rounded-lg hover:bg-orange-700 transition-colors"
                aria-label="Menüyü Aç"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`lg:hidden w-full bg-[#111] text-white border-t border-neutral-800 transition-all duration-300 ease-out overflow-hidden ${
          isOpen ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {displayLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-bold tracking-widest py-2.5 px-3 rounded transition-all ${
                    isActive
                      ? 'bg-[#ea580c] text-white'
                      : 'text-slate-200 hover:bg-neutral-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <Link
            href="/teklif-al"
            className="bg-[#ea580c] text-white font-extrabold text-[10px] tracking-widest py-3 rounded text-center"
          >
            HIZLI KEŞİF AL
          </Link>
        </div>
      </div>
    </header>
  );
}
