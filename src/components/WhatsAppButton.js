"use client";
import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function FloatingActions() {
  const pathname = usePathname();
  const [phone, setPhone] = useState('905417310749');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.whatsapp) {
            setPhone(data.whatsapp.replace(/[^0-9]/g, ''));
          }
        }
      } catch (err) {
        console.error('Failed to load settings in FloatingActions:', err);
      }
    }
    loadSettings();
  }, []);

  // Hide on admin page
  if (pathname.startsWith('/admin') || pathname.startsWith('/studio')) return null;

  const whatsappMessage = encodeURIComponent('Merhaba, Doğan Perde modelleriniz hakkında bilgi almak ve ölçü randevusu talep etmek istiyorum.');
  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappMessage}`;
  const phoneCallUrl = `tel:+${phone}`;

  return (
    <>
      {/* 1. BOTTOM LEFT: WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl hover:scale-105 transition-all border-2 border-white cursor-pointer"
        aria-label="WhatsApp Destek Hattı"
      >
        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3 1.488 5.367 1.489 5.568 0 10.099-4.522 10.102-10.091.002-2.7-1.047-5.24-2.951-7.147-1.905-1.905-4.437-2.953-7.143-2.953-5.577 0-10.108 4.524-10.111 10.093-.001 2.124.557 4.195 1.62 6.007L1.879 21.6l4.768-1.25c.001 0-.001 0 0 0zM17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
      </a>

      {/* 2. BOTTOM RIGHT: Phone Call Floating Button */}
      <a
        href={phoneCallUrl}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all border-2 border-white cursor-pointer"
        aria-label="Hemen Ara"
      >
        <Phone size={26} className="fill-white/10" />
      </a>

      {/* 3. RIGHT BORDER: Vertical Social Bar */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col border border-neutral-800/20 shadow-lg">
        
        {/* Facebook */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#3b5998] hover:bg-[#2d4373] text-white flex items-center justify-center transition-colors"
          title="Facebook"
          aria-label="Facebook"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/doganperde_cekmekoy"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#c13584] hover:bg-[#9d2a6a] text-white flex items-center justify-center transition-colors"
          title="Instagram"
          aria-label="Instagram"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
        </a>

        {/* Youtube */}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#ff0000] hover:bg-[#cc0000] text-white flex items-center justify-center transition-colors"
          title="Youtube"
          aria-label="Youtube"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
        </a>

        {/* WhatsApp inside Social Bar */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#25d366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-colors"
          title="WhatsApp"
          aria-label="WhatsApp"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3 1.488 5.367 1.489 5.568 0 10.099-4.522 10.102-10.091.002-2.7-1.047-5.24-2.951-7.147-1.905-1.905-4.437-2.953-7.143-2.953-5.577 0-10.108 4.524-10.111 10.093-.001 2.124.557 4.195 1.62 6.007L1.879 21.6l4.768-1.25c.001 0-.001 0 0 0zM17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
        </a>

        {/* Tiktok */}
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-[#000000] hover:bg-[#333333] text-white flex items-center justify-center transition-colors"
          title="Tiktok"
          aria-label="Tiktok"
        >
          <span className="text-[10px] font-black tracking-widest font-sans">TT</span>
        </a>

      </div>
    </>
  );
}
