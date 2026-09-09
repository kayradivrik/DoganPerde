"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Check, ArrowLeft, Calculator, Sparkles } from 'lucide-react';

const PRICING_RULES = {
  'Tül Perde': { m2Price: 600, minM2: 1.0, fixedFee: 0 },
  'Fon Perde': { m2Price: 800, minM2: 1.0, fixedFee: 0 },
  'Zebra Perde': { m2Price: 550, minM2: 1.5, fixedFee: 0 },
  'Stor Perde': { m2Price: 450, minM2: 1.5, fixedFee: 0 },
  'Motorlu Akıllı Perde': { m2Price: 1800, minM2: 1.5, fixedFee: 1500 }
};

const getFabricOptions = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('tül') || t.includes('tul')) return ['Lüks Vual', 'Doğal Keten', 'Grek Tül', 'Fransız Danteli'];
  if (t.includes('fon')) return ['Premium Kadife', 'Keten Dokuma', 'İpek Saten', 'Jakarlı Fon'];
  if (t.includes('zebra') || t.includes('jaluzi') || t.includes('plise')) return ['Naturel Zebra', 'Bambu Zebra', 'Karartma Zebra', 'Plise Petek Kumaş'];
  if (t.includes('stor')) return ['Klasik Polyester', 'Keten Dokulu Stor', 'Karartma Stor'];
  if (t.includes('motor') || t.includes('akıllı')) return ['Akıllı Stor', 'Dikey Akıllı Tül', 'Karartma Akıllı'];
  return ['Standart Kumaş', 'Premium Kumaş', 'Lüks Dokuma'];
};

const COLOR_OPTIONS = ['Beyaz', 'Krem', 'Ekru', 'Açık Gri', 'Antrasit', 'Vizon', 'Bej', 'Kiremit'];

function QuotePageContent() {
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState('appointment'); // 'appointment' or 'calculator'
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [curtainType, setCurtainType] = useState('Tül Perde');
  const [fabric, setFabric] = useState('');
  const [color, setColor] = useState('Ekru');
  const [message, setMessage] = useState('');

  // Calculator Dimensions
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(250);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Dynamic Pricing State
  const [pricing, setPricing] = useState(PRICING_RULES);

  // Load pricing rules from Sanity categories
  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const rules = {};
            data.forEach(c => {
              rules[c.title] = {
                m2Price: c.m2Price !== undefined && c.m2Price !== null ? c.m2Price : 600,
                minM2: c.minM2 !== undefined && c.minM2 !== null ? c.minM2 : 1.0,
                fixedFee: c.fixedFee !== undefined && c.fixedFee !== null ? c.fixedFee : 0
              };
            });
            setPricing(rules);
            
            // Sync with URL query param or fallback to first category
            const urlType = searchParams.get('curtainType');
            if (urlType) {
              const matched = data.find(c => c.title.toLowerCase().includes(urlType.toLowerCase()));
              if (matched) {
                setCurtainType(matched.title);
                return;
              }
            }
            setCurtainType(data[0].title);
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic pricing from categories, using default fallback rules:', err);
      }
    }
    loadPricing();
  }, [searchParams]);

  // Set default fabric when curtainType changes
  useEffect(() => {
    const fabrics = getFabricOptions(curtainType);
    if (fabrics.length > 0) {
      setFabric(fabrics[0]);
    }
  }, [curtainType]);

  // Live Price Calculation
  useEffect(() => {
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    
    if (w <= 0 || h <= 0) {
      setEstimatedPrice(0);
      return;
    }

    const rules = pricing[curtainType] || pricing['Tül Perde'] || { m2Price: 600, minM2: 1.0, fixedFee: 0 };
    const actualM2 = (w / 100) * (h / 100);
    
    let finalM2 = actualM2;
    if (finalM2 < rules.minM2) {
      finalM2 = rules.minM2;
    }

    const price = (finalM2 * rules.m2Price) + rules.fixedFee;
    setEstimatedPrice(Math.round(price));
  }, [width, height, curtainType, pricing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('Lütfen adınızı ve telefon numaranızı belirtin.');
      return;
    }

    if (!kvkkAccepted) {
      setError('Lütfen KVKK Aydınlatma Metni\'ni okudum, kabul ediyorum kutucuğunu işaretleyin.');
      return;
    }
    
    if (activeTab === 'appointment' && !address) {
      setError('Ölçü ve keşif randevusu için açık adres belirtmeniz gerekmektedir.');
      return;
    }

    setError('');
    setSubmitting(true);

    const formattedMessage = `[Kumaş: ${fabric}, Renk: ${color}] ${message}`;

    const payload = {
      name,
      phone,
      curtainType,
      message: formattedMessage,
      leadType: activeTab === 'appointment' ? 'APPOINTMENT' : 'CALCULATOR',
      address: address || null,
      width: activeTab === 'calculator' ? parseFloat(width) : null,
      height: activeTab === 'calculator' ? parseFloat(height) : null,
      estimatedPrice: activeTab === 'calculator' ? estimatedPrice : null,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Talebiniz gönderilemedi, lütfen tekrar deneyin.');
      }
    } catch (err) {
      console.error(err);
      setError('Bağlantı hatası oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setAddress('');
    setMessage('');
    setWidth(150);
    setHeight(250);
    setSuccess(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-8">
      
      {/* Back Link */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-500 transition-colors self-start group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Ana Sayfaya Dön</span>
      </Link>

      {/* Simplified Main Header */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-primary-500 font-bold uppercase tracking-wider text-[10px]">Hızlı Randevu & Fiyat</span>
        <h1 className="text-3xl sm:text-4xl font-serif text-slate-900 font-light">Ölçü ve Keşif Talebi</h1>
        <p className="text-slate-500 text-xs font-medium max-w-md mx-auto">
          Evinize özel dikim perde siparişi vermek için ücretsiz randevu oluşturun veya anlık tahmini fiyat hesaplayın.
        </p>
      </div>

      {success ? (
        /* Success Screen */
        <div className="bg-white border border-slate-150 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center gap-6 w-full">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Check size={26} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-serif font-black text-slate-950">
              {activeTab === 'appointment' ? 'Randevunuz Alındı!' : 'Talebiniz Kaydedildi!'}
            </h2>
            <p className="text-slate-550 text-xs leading-relaxed font-semibold max-w-sm">
              Tasarım ekibimiz detayları görüşmek ve kumaş kartelalarıyla sizi ziyaret etmek için en kısa sürede iletişime geçecektir.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 w-full text-xs text-slate-700 flex flex-col gap-3">
            <div className="flex justify-between font-bold border-b border-slate-200 pb-2.5 text-slate-950">
              <span>Hizmet Türü</span>
              <span>{curtainType}</span>
            </div>
            <div className="flex justify-between">
              <span>Seçilen Kumaş & Renk:</span>
              <span className="font-semibold text-slate-900">{fabric} (${color})</span>
            </div>
            {activeTab === 'calculator' && (
              <>
                <div className="flex justify-between">
                  <span>Ölçüler:</span>
                  <span className="font-semibold text-slate-900">{width}x{height} cm</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2.5 font-black text-[#ea580c]">
                  <span>Tahmini Tutar:</span>
                  <span className="text-sm">{estimatedPrice.toLocaleString('tr-TR')} TL</span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <a
              href="tel:+905417310749"
              className="flex-1 bg-slate-950 text-white font-bold py-3.5 rounded-xl text-xs text-center hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              Cumali Bey'i Ara
            </a>
            <a
              href={`https://wa.me/905417310749?text=${encodeURIComponent(
                `Merhaba, sitenizden perde randevu/hesaplama talebi gönderdim. Adım: ${name}, Perde: ${curtainType}, Kumaş: ${fabric}. Ölçü randevusu netleştirebilir miyiz?`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-xs text-center hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
            >
              WhatsApp İletişim
            </a>
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-450 hover:text-primary-500 underline mt-2"
          >
            Yeni Bir Form Gönder
          </button>
        </div>
      ) : (
        /* Form Card */
        <div className="bg-white border border-slate-150 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          
          {/* Selector Tabs (Simplified Pill Buttons) */}
          <div className="flex border-b border-slate-150 bg-slate-50/50 p-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('appointment');
                setError('');
              }}
              className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'appointment'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <Calendar size={15} />
              <span>Ücretsiz Keşif Randevusu Al</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('calculator');
                setError('');
              }}
              className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-[#ea580c] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              <Calculator size={15} />
              <span>Fiyat Hesapla</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-6">
            
            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ad Soyad *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Adınız ve Soyadınız"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-400 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Telefon Numarası *</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="05xx xxx xx xx"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-400 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Curtain Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="curtainType" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Perde Türü</label>
              <select
                id="curtainType"
                value={curtainType}
                onChange={e => setCurtainType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-800 font-bold focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                {Object.keys(pricing).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Fabric & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fabric" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kumaş Dokusu</label>
                <select
                  id="fabric"
                  value={fabric}
                  onChange={e => setFabric(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-800 font-bold focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {getFabricOptions(curtainType).map(f => (
                     <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="color" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Renk Tonu</label>
                <select
                  id="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-800 font-bold focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {COLOR_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Dimensions Calculator (Calculator Tab Only) */}
            {activeTab === 'calculator' && (
              <div className="flex flex-col gap-4 bg-orange-50/40 p-5 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-2 text-xs font-black text-[#ea580c]">
                  <Sparkles size={14} />
                  <span>Ölçülerinizi Girin</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="width" className="text-[10px] font-bold text-slate-550 uppercase tracking-wider">Genişlik (En) - cm</label>
                    <input
                      type="number"
                      id="width"
                      value={width}
                      onChange={e => setWidth(Math.max(50, parseInt(e.target.value) || 0))}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold focus:outline-none focus:border-[#ea580c] text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="height" className="text-[10px] font-bold text-slate-550 uppercase tracking-wider">Yükseklik (Boy) - cm</label>
                    <input
                      type="number"
                      id="height"
                      value={height}
                      onChange={e => setHeight(Math.max(100, parseInt(e.target.value) || 0))}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold focus:outline-none focus:border-[#ea580c] text-slate-800"
                    />
                  </div>
                </div>

                <div className="border-t border-orange-200/60 pt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Ortalama Atölye Fiyatı:</span>
                  <span className="font-black text-base text-[#ea580c]">{estimatedPrice.toLocaleString('tr-TR')} TL</span>
                </div>
              </div>
            )}

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="address" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {activeTab === 'appointment' ? 'Ölçü Keşif Adresi *' : 'Adres Bilgisi (Opsiyonel)'}
              </label>
              <textarea
                id="address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows="2"
                placeholder={activeTab === 'appointment' ? 'Ölçü alınacak dairenin açık adresini belirtin...' : 'Bulunduğunuz ilçe veya semt bilgisi...'}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-400 transition-colors resize-none"
                required={activeTab === 'appointment'}
              />
            </div>

            {/* Message/Notes */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notlar / Özel İstekler</label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows="2"
                placeholder="Varsa pile sıklığı veya farklı isteklerinizi not edin..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:border-slate-400 transition-colors resize-none"
              />
            </div>

            {/* KVKK Checkbox */}
            <div className="flex items-center gap-2.5 my-1">
              <input
                type="checkbox"
                id="kvkkAccepted"
                checked={kvkkAccepted}
                onChange={e => setKvkkAccepted(e.target.checked)}
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
              <div className="text-xs text-red-600 font-bold bg-red-50/50 p-3.5 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white font-extrabold py-4 rounded-xl text-xs transition-colors cursor-pointer mt-2"
            >
              {submitting ? 'Talep Gönderiliyor...' : activeTab === 'appointment' ? 'Ücretsiz Keşif Talebi Oluştur' : 'Teklif Almak İçin Gönder'}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-700">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-wider">Yükleniyor...</span>
        </div>
      </div>
    }>
      <QuotePageContent />
    </Suspense>
  );
}
