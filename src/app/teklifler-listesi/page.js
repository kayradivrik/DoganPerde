"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Calculator, Check, Trash2, Clock, CheckCircle2, XCircle, LogOut, ArrowUpDown, Filter, Lock } from 'lucide-react';

export default function LeadsListPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          const data = await res.json();
          if (data.loggedIn) {
            setIsAuthenticated(true);
            fetchLeads();
          }
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchLeads();
      } else {
        const data = await res.json();
        setAuthError(data.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      setAuthError('Bağlantı kurulamadı.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      setLeads([]);
      setUsernameInput('');
      setPasswordInput('');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        // Normalizing data from Sanity to match existing component logic
        const mappedData = data.map(lead => ({
          ...lead,
          id: lead._id || lead.id,
          createdAt: lead._createdAt || lead.createdAt
        }));
        setLeads(mappedData);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const deleteLead = async (id) => {
    if (!confirm('Bu randevu/teklif talebini silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || lead.leadType === typeFilter;
    return matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/50 text-[10px] font-bold py-1 px-2.5 rounded-full">
            <Clock size={10} />
            <span>Bekliyor</span>
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/50 text-[10px] font-bold py-1 px-2.5 rounded-full">
            <Check size={10} />
            <span>Arandı</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-bold py-1 px-2.5 rounded-full">
            <CheckCircle2 size={10} />
            <span>Tamamlandı</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200/50 text-[10px] font-bold py-1 px-2.5 rounded-full">
            <XCircle size={10} />
            <span>İptal</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-wider">Oturum Doğrulanıyor...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    /* Login Form */
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md bg-white border border-slate-150 rounded-2xl p-8 shadow-sm flex flex-col gap-6 relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-[#ea580c]" />
          
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ea580c] flex items-center justify-center mb-1">
              <Lock size={20} />
            </div>
            <h1 className="text-2xl font-serif font-black text-slate-900">Yönetici Girişi</h1>
            <p className="text-slate-500 text-xs font-medium">Teklif ve randevu listesine erişmek için giriş yapın.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kullanıcı Adı</label>
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="Kullanıcı adınızı girin"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#ea580c] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Şifre</label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#ea580c] transition-colors"
                required
              />
            </div>

            {authError && (
              <div className="text-xs text-rose-600 font-bold bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold py-3.5 rounded-xl text-xs transition-colors cursor-pointer mt-2"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* Leads List Dashboard */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      
      {/* Dashboard Top Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif text-slate-950 font-normal leading-none">Teklif ve Keşif Talepleri</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Müşterilerden gelen randevuları ve otomatik teklif hesaplamalarını yönetin.</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer bg-white"
        >
          <LogOut size={13} />
          <span>Oturumu Kapat</span>
        </button>
      </div>

      {/* Filters Segment */}
      <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-wrap gap-4 items-center">
        
        <div className="flex items-center gap-2 text-xs font-bold text-slate-550 mr-2">
          <Filter size={14} />
          <span>Filtrele:</span>
        </div>

        {/* Lead Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Talep Türü:</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-xs py-1.5 px-3 font-semibold text-slate-750 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Tümü</option>
            <option value="APPOINTMENT">Keşif Randevusu</option>
            <option value="CALCULATOR">Fiyat Hesaplama</option>
          </select>
        </div>

        {/* Lead Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-450 uppercase">İşlem Durumu:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-xs py-1.5 px-3 font-semibold text-slate-750 focus:outline-none cursor-pointer"
          >
            <option value="ALL">Tümü</option>
            <option value="PENDING">Bekleyenler</option>
            <option value="CONTACTED">Arananlar</option>
            <option value="COMPLETED">Tamamlananlar</option>
            <option value="CANCELLED">İptal Edilenler</option>
          </select>
        </div>

        <span className="ml-auto text-xs text-slate-400 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200/50">
          Toplam: {filteredLeads.length} Kayıt
        </span>

      </div>

      {/* Leads Table/Grid List */}
      {loadingLeads ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white border border-slate-150 p-16 rounded-3xl text-center flex flex-col items-center gap-3">
          <span className="text-slate-400 font-serif text-3xl font-light">Kayıt Bulunmamaktadır</span>
          <p className="text-xs text-slate-500 font-semibold max-w-xs leading-relaxed">
            Seçilen filtrelere uyan herhangi bir teklif veya randevu talebi bulunamadı.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Responsive Table wrapper */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Müşteri / İletişim</th>
                  <th className="py-4 px-6">Tür</th>
                  <th className="py-4 px-6">Detaylar</th>
                  <th className="py-4 px-6">Tarih</th>
                  <th className="py-4 px-6">Durum</th>
                  <th className="py-4 px-6 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs font-semibold text-slate-755">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Name & Phone */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 text-[13px]">{lead.name}</span>
                        <a href={`tel:${lead.phone}`} className="text-slate-450 hover:text-[#ea580c] transition-colors">{lead.phone}</a>
                      </div>
                    </td>

                    {/* Lead Type */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {lead.leadType === 'APPOINTMENT' ? (
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <Calendar size={13} className="text-primary-500" />
                          <span>Keşif Randevusu</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <Calculator size={13} className="text-emerald-500" />
                          <span>Fiyat Hesaplama</span>
                        </span>
                      )}
                    </td>

                    {/* Details */}
                    <td className="py-4 px-6 max-w-xs sm:max-w-md">
                      <div className="flex flex-col gap-1 text-[11px] leading-relaxed">
                        <div>
                          <span className="text-slate-400 font-bold">Perde: </span>
                          <span className="text-slate-700 font-bold">{lead.curtainType || '-'}</span>
                        </div>
                        {lead.width && lead.height && (
                          <div>
                            <span className="text-slate-400 font-bold">Ölçü & Fiyat: </span>
                            <span className="text-slate-700 font-bold">
                              {lead.width}x{lead.height} cm ({lead.estimatedPrice?.toLocaleString('tr-TR')} TL)
                            </span>
                          </div>
                        )}
                        {lead.address && (
                          <div className="text-slate-600 mt-0.5 break-words max-w-[250px] sm:max-w-xs">
                            <span className="text-slate-450 font-bold">Adres: </span>
                            <span>{lead.address}</span>
                          </div>
                        )}
                        {lead.message && (
                          <div className="text-slate-650 bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-xl mt-2 break-words whitespace-pre-wrap max-w-[250px] sm:max-w-xs shadow-sm">
                            <span className="font-extrabold text-[#ea580c] block text-[9px] uppercase tracking-wider mb-0.5">Müşteri Notu / Seçimler:</span>
                            "{lead.message}"
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 whitespace-nowrap text-slate-450 text-[11px]">
                      {new Date(lead.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      {getStatusBadge(lead.status)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Mark contacted */}
                        {lead.status !== 'CONTACTED' && (
                          <button
                            onClick={() => updateLeadStatus(lead.id, 'CONTACTED')}
                            className="bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 p-1.5 rounded-lg cursor-pointer transition-colors"
                            title="Arandı Olarak İşaretle"
                          >
                            <Check size={13} />
                          </button>
                        )}

                        {/* Mark completed */}
                        {lead.status !== 'COMPLETED' && (
                          <button
                            onClick={() => updateLeadStatus(lead.id, 'COMPLETED')}
                            className="bg-white hover:bg-emerald-50 text-emerald-600 border border-slate-200 hover:border-emerald-200 p-1.5 rounded-lg cursor-pointer transition-colors"
                            title="Tamamlandı Olarak İşaretle"
                          >
                            <CheckCircle2 size={13} />
                          </button>
                        )}

                        {/* Cancel */}
                        {lead.status !== 'CANCELLED' && (
                          <button
                            onClick={() => updateLeadStatus(lead.id, 'CANCELLED')}
                            className="bg-white hover:bg-rose-50/50 text-rose-600 border border-slate-200 hover:border-rose-100 p-1.5 rounded-lg cursor-pointer transition-colors"
                            title="İptal Et"
                          >
                            <XCircle size={13} />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="bg-white hover:bg-rose-50 text-rose-650 border border-slate-200 hover:border-rose-200 p-1.5 rounded-lg cursor-pointer transition-colors ml-2"
                          title="Talebi Kalıcı Olarak Sil"
                        >
                          <Trash2 size={13} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
