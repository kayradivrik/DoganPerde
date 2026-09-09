"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Calendar } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/studio');

  const [settings, setSettings] = useState({
    phone1: '0535 485 76 31',
    phone2: '0541 731 07 49',
    address: 'Şahinbey Cd. Çamlık Mah. No:114 Dük:A (Doğa Parkı Yanı), Çekmeköy / İstanbul',
    regions: 'Çekmeköy, Sancaktepe, Ümraniye, Şile, Kadıköy'
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isAdminPage) return;

    async function loadData() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load settings in footer:', err);
      }

      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories in footer:', err);
      }
    }
    loadData();
  }, [isAdminPage]);

  if (isAdminPage) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#c2410c] text-orange-50 py-16 border-t-4 border-[#f97316] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: En Çok Tercih Edilen */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-widest">
              EN ÇOK TERCİH EDİLEN
            </h3>
            <ul className="flex flex-col gap-3 text-[13px] text-orange-100 font-medium">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((cat) => (
                  <li key={cat._id}>
                    <Link href={`/urunler?category=${encodeURIComponent(cat.slug?.current || cat.title)}`} className="hover:text-white transition-colors">
                      {cat.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/urunler?category=Tül Perde" className="hover:text-white transition-colors">Tül & Perde</Link></li>
                  <li><Link href="/urunler?category=Zebra Perde" className="hover:text-white transition-colors">Ahşap Jaluzi Perde</Link></li>
                  <li><Link href="/urunler?category=Zebra Perde" className="hover:text-white transition-colors">Cam Plise</Link></li>
                  <li><Link href="/urunler?category=Akıllı Perde" className="hover:text-white transition-colors">Motorlu Perde</Link></li>
                  <li><Link href="/urunler?category=Stor Perde" className="hover:text-white transition-colors">Stor Perde</Link></li>
                  <li><Link href="/urunler?category=Fon Perde" className="hover:text-white transition-colors">Rustik Perde</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Column 2: Montaj & Tamir */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-widest">
              MONTAJ & TAMİR
            </h3>
            <ul className="flex flex-col gap-3 text-[13px] text-orange-100 font-medium">
              <li><Link href="/teklif-al" className="hover:text-white transition-colors">Korniş Montajı</Link></li>
              <li><Link href="/teklif-al" className="hover:text-white transition-colors">Korniş Tamiri</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition-colors">Atölye Hizmetleri</Link></li>
            </ul>
          </div>

          {/* Column 3: Hızlı Bölgelerimiz */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-widest">
              HIZLI BÖLGELERİMİZ
            </h3>
            <ul className="flex flex-col gap-3 text-[13px] text-orange-200 font-medium">
              {settings.regions
                .split(',')
                .map(r => r.trim())
                .filter(Boolean)
                .map((region, idx) => (
                  <li key={idx}><span>{region}</span></li>
                ))}
            </ul>
          </div>

          {/* Column 4: İletişim Bilgileri */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-widest">
              BİZE ULAŞIN
            </h3>
            <div className="flex flex-col gap-3 text-[13px] text-orange-100 font-medium">
              <p className="leading-relaxed">{settings.address}</p>
              <div className="flex flex-col gap-1.5 mt-1 border-t-2 border-orange-500/40 pt-3">
                <a href={`tel:${settings.phone1.replace(/[^0-9]/g, '')}`} className="hover:text-white">Doğan Bey: {settings.phone1}</a>
                <a href={`tel:${settings.phone2.replace(/[^0-9]/g, '')}`} className="hover:text-white">Cumali Bey: {settings.phone2}</a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t-2 border-orange-500/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-orange-200 font-medium">
          <p>© {currentYear} Doğan Perde. Tüm Hakları Saklıdır.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/kvkk" className="hover:text-white transition-colors">
              KVKK
            </Link>
            <Link href="/studio" className="flex items-center gap-1 hover:text-white transition-colors">
              <Lock size={11} />
              <span>İçerik Yönetimi (Sanity)</span>
            </Link>
            <Link href="/teklifler-listesi" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Calendar size={11} />
              <span>Talepler & Teklifler</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
