"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Calendar, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileActionBar() {
  const pathname = usePathname();
  const [phone, setPhone] = useState('905417310749');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          // Prefer whatsapp or phone1 or fallback
          const rawPhone = data.whatsapp || data.phone1 || '0541 731 07 49';
          setPhone(rawPhone.replace(/[^0-9]/g, ''));
        }
      } catch (err) {
        console.error('Failed to load settings in MobileActionBar:', err);
      }
    }
    loadSettings();
  }, []);

  // Hide on admin page
  if (pathname.startsWith('/admin') || pathname.startsWith('/studio')) return null;

  const whatsappMessage = encodeURIComponent('Merhaba, Doğan Perde modelleriniz hakkında bilgi almak ve ölçü randevusu istemek istiyorum.');
  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappMessage}`;
  const phoneCallUrl = `tel:+${phone}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-45 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white/95 to-white/0 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-slate-200/60 rounded-2xl shadow-xl flex items-center justify-between p-2.5 pointer-events-auto">
        
        {/* Call Button */}
        <a
          href={phoneCallUrl}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1 px-2 text-slate-700 hover:text-primary-600 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-750 hover:bg-primary-50 transition-colors">
            <Phone size={18} />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Hemen Ara</span>
        </a>

        {/* Action Button - Free Measurement */}
        <Link
          href="/teklif-al"
          className="flex-[1.5] flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 active:scale-98 text-white py-3 px-4 rounded-xl shadow-md shadow-primary-500/20 transition-all font-bold text-xs text-center"
        >
          <Calendar size={15} />
          <span>Ücretsiz Keşif</span>
        </Link>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1 px-2 text-slate-700 hover:text-emerald-600 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors">
            <MessageCircle size={20} className="fill-emerald-500/10" />
          </div>
          <span className="text-[10px] font-bold tracking-tight text-slate-750">WhatsApp</span>
        </a>

      </div>
    </div>
  );
}
