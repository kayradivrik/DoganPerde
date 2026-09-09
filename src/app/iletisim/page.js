"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Check, Send, Building2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [settings, setSettings] = useState({
    phone1: '0535 485 76 31',
    phone2: '0541 731 07 49',
    address: 'Şahinbey Cd. Çamlık Mah. No:114 Dük:A (Doğa Parkı Yanı), Çekmeköy / İstanbul',
    workWeekday: 'Pazartesi - Cumartesi: 09:00 - 19:30',
    workSunday: 'Pazar: Kapalı',
    mapsLink: 'https://www.google.com/maps/search/?api=1&query=Do%C4%9Fan+Perde+%C3%87ekmek%C3%B6y+%C5%9Eahinbey+Caddesi+%C3%87aml%C4%B1k+Mahallesi'
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (err) {
        console.error('Failed to load settings in contact page:', err);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError('İsim ve Telefon alanları zorunludur.');
      return;
    }
    if (!kvkkAccepted) {
      setError('Lütfen KVKK Aydınlatma Metni\'ni okudum, kabul ediyorum kutucuğunu işaretleyin.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          curtainType: 'İletişim Formu',
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', phone: '', message: '' });
      } else {
        const errData = await res.json();
        setError(errData.error || 'Mesaj iletilemedi, lütfen daha sonra tekrar deneyin.');
      }
    } catch (err) {
      setError('Bir bağlantı hatası oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-16">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
        <span className="text-primary-500 font-extrabold uppercase tracking-wider text-xs">İletişim</span>
        <h1 className="text-4xl sm:text-6xl font-serif font-light text-slate-900 leading-tight">Bizimle İletişime Geçin</h1>
        <p className="text-slate-500 text-xs font-semibold">Sorularınız, fiyat teklifleri veya iş birliği talepleriniz için bize ulaşın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Contact details (Editorial list style) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-serif text-slate-950 font-normal leading-tight mb-4">İletişim Bilgilerimiz</h2>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Hizmetlerimiz hakkında daha fazla bilgi almak veya pencereleriniz için fiyat almak isterseniz aşağıdaki kanallardan bize ulaşabilir veya sağdaki formdan bize mesaj gönderebilirsiniz.
            </p>
          </div>
          
          <div className="flex flex-col divide-y divide-slate-100 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
            
            <div className="flex gap-4 items-start py-5 first:pt-0">
              <MapPin size={18} className="text-primary-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h4 className="font-serif font-bold text-slate-900 text-base">Adres</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{settings.address}</p>
                <a
                  href={settings.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-primary-500 hover:text-primary-650 inline-block mt-1 cursor-pointer"
                >
                  Yol Tarifi Al →
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start py-5">
              <Phone size={18} className="text-primary-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h4 className="font-serif font-bold text-slate-900 text-base">Telefon / WhatsApp</h4>
                <p className="text-xs text-slate-500 font-semibold">Doğan Bey: <a href={`tel:${settings.phone1.replace(/[^0-9]/g, '')}`} className="text-slate-800 hover:text-primary-600 font-bold">{settings.phone1}</a></p>
                <p className="text-xs text-slate-500 font-semibold">Cumali Bey: <a href={`tel:${settings.phone2.replace(/[^0-9]/g, '')}`} className="text-slate-800 hover:text-primary-600 font-bold">{settings.phone2}</a></p>
              </div>
            </div>

            <div className="flex gap-4 items-start py-5">
              <Clock size={18} className="text-primary-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h4 className="font-serif font-bold text-slate-900 text-base">Çalışma Saatleri</h4>
                <p className="text-xs text-slate-500 font-semibold">{settings.workWeekday}</p>
                <p className="text-xs text-slate-400 font-semibold">{settings.workSunday}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start py-5 last:pb-0 border-t border-slate-200/60 pt-5">
              <Building2 size={18} className="text-primary-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h4 className="font-serif font-bold text-slate-900 text-base">Ticari Künye (TTK m.39)</h4>
                <p className="text-[11px] text-slate-500 font-semibold">Unvan: <span className="text-slate-800 font-bold">Doğan Perde Tasarım & Atölyesi</span></p>
                <p className="text-[11px] text-slate-500 font-semibold">Vergi D. / MERSİS: <span className="text-slate-800 font-bold">İsteğe Bağlı / Belirtilebilir</span></p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Message form */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-xl">
          <h3 className="text-2xl font-serif text-slate-900 mb-6 font-normal">Bize Mesaj Gönderin</h3>
          
          {success ? (
            <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-fade-in border border-emerald-100">
                <Check size={28} />
              </div>
              <h4 className="text-xl font-serif font-bold text-slate-950">Mesajınız Alındı!</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-xs">
                Bizimle iletişime geçtiğiniz için teşekkür ederiz. Müşteri temsilcimiz en kısa sürede telefon numaranızdan size ulaşacaktır.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-xs font-bold text-primary-500 hover:text-primary-655 underline mt-2"
              >
                Yeni bir mesaj gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div>
                <label htmlFor="name" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ad Soyad *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Lütfen adınızı girin"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Telefon Numarası *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05xx xxx xx xx"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mesajınız</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Sorularınızı veya isteklerinizi buraya yazabilirsiniz..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-xs font-bold text-slate-850 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-2.5 my-1">
                <input
                  type="checkbox"
                  id="kvkkAccepted"
                  checked={kvkkAccepted}
                  onChange={(e) => setKvkkAccepted(e.target.checked)}
                  required
                  className="w-4 h-4 accent-primary-500 rounded border-slate-300 cursor-pointer shrink-0"
                />
                <label htmlFor="kvkkAccepted" className="text-xs text-slate-600 font-semibold cursor-pointer select-none">
                  <Link href="/kvkk" target="_blank" className="text-primary-600 font-bold hover:underline">
                    KVKK Aydınlatma Metni
                  </Link>'ni okudum, kabul ediyorum. *
                </label>
              </div>

              {error && (
                <div className="text-xs text-red-500 font-semibold bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:shadow-primary-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} />
                <span>{submitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}</span>
              </button>

            </form>
          )}
        </div>

      </div>

    </div>
  );
}
