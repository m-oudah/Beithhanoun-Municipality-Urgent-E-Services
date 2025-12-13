import React, { useEffect, useState } from 'react';
import { Users, AlertCircle, CheckCircle, Lock, User, Key, LogOut, X, Phone, MessageCircle, MapPin, Send, MessageSquare, Megaphone, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { Language, CitizenRecord, Announcement } from '../types';
import { TRANSLATIONS } from '../constants';
import { ApiService } from '../services/api';
import { sanitizeInput } from '../utils/validation';

interface AdminProps {
  lang: Language;
}

export const AdminDashboard: React.FC<AdminProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'citizens' | 'announcements'>('citizens');

  // Citizen State
  const [citizens, setCitizens] = useState<CitizenRecord[]>([]);
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenRecord | null>(null);
  const [adminFeedback, setAdminFeedback] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CitizenRecord['status']>('pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Announcement State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Announcement | null>(null);
  const [adForm, setAdForm] = useState({
    titleEn: '', titleAr: '', contentEn: '', contentAr: '', category: 'general', date: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'citizens') {
        ApiService.getCitizens().then(setCitizens);
      } else {
        ApiService.getAnnouncements().then(setAnnouncements);
      }
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === '123456') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError(t.login.error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
    setCitizens([]);
  };

  // --- Citizen Logic ---
  const openCitizenModal = (citizen: CitizenRecord) => {
    setSelectedCitizen(citizen);
    setSelectedStatus(citizen.status);
    setAdminFeedback(citizen.adminFeedback || '');
    setUpdateMessage('');
  };

  const closeModal = () => {
    setSelectedCitizen(null);
  };

  const handleUpdateRecord = async () => {
    if (!selectedCitizen) return;
    setIsUpdating(true);
    try {
      const updated = await ApiService.updateCitizenRecord(selectedCitizen.id, {
        status: selectedStatus,
        adminFeedback: sanitizeInput(adminFeedback)
      });
      if (updated) {
        setCitizens(citizens.map(c => c.id === updated.id ? updated : c));
        setUpdateMessage(t.adminPanel.modal.statusUpdated);
        setTimeout(() => setUpdateMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Announcement Logic ---
  const openAdModal = (ad?: Announcement) => {
    if (ad) {
      setEditingAd(ad);
      setAdForm({
        titleEn: ad.title.en,
        titleAr: ad.title.ar,
        contentEn: ad.content.en,
        contentAr: ad.content.ar,
        category: ad.category,
        date: ad.date
      });
    } else {
      setEditingAd(null);
      setAdForm({
        titleEn: '', titleAr: '', contentEn: '', contentAr: '', category: 'general', date: new Date().toISOString().split('T')[0]
      });
    }
    setIsAdModalOpen(true);
  };

  const saveAnnouncement = async () => {
    const data = {
      title: { en: sanitizeInput(adForm.titleEn), ar: sanitizeInput(adForm.titleAr) },
      content: { en: sanitizeInput(adForm.contentEn), ar: sanitizeInput(adForm.contentAr) },
      category: adForm.category as any,
      date: adForm.date
    };

    if (editingAd) {
      await ApiService.updateAnnouncement(editingAd.id, data);
    } else {
      await ApiService.createAnnouncement(data);
    }
    
    // Refresh list
    const updatedList = await ApiService.getAnnouncements();
    setAnnouncements(updatedList);
    setIsAdModalOpen(false);
  };

  const deleteAnnouncement = async (id: string) => {
    if (window.confirm(t.adminPanel.announcements.confirmDelete)) {
      await ApiService.deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-primary-600 transition-colors">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-700 dark:text-primary-400 mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.login.title}</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.login.username}</label>
              <div className="relative">
                <User size={18} className={`absolute top-3 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className={`w-full py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition ${lang === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.login.password}</label>
              <div className="relative">
                <Key size={18} className={`absolute top-3 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
                <input 
                  type="password" 
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className={`w-full py-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition ${lang === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition shadow-lg flex justify-center items-center gap-2"
            >
              <span>{t.login.submit}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingCount = citizens.filter(c => c.status === 'pending').length;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.adminPanel.title}</h2>
          <span className="inline-block mt-1 px-3 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 rounded-full text-xs font-bold uppercase tracking-wider">
            Admin Access
          </span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition text-sm font-semibold"
        >
          <LogOut size={16} />
          <span>{t.login.logout}</span>
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-700">
        <button 
          onClick={() => setActiveTab('citizens')}
          className={`px-6 py-3 font-bold border-b-2 transition flex items-center gap-2 ${activeTab === 'citizens' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Users size={18} />
          {t.adminPanel.tabs.citizens}
        </button>
        <button 
          onClick={() => setActiveTab('announcements')}
          className={`px-6 py-3 font-bold border-b-2 transition flex items-center gap-2 ${activeTab === 'announcements' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Megaphone size={18} />
          {t.adminPanel.tabs.announcements}
        </button>
      </div>

      {activeTab === 'citizens' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-l-4 border-blue-500 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t.adminPanel.totalCitizens}</p>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{citizens.length}</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  <Users size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-l-4 border-yellow-500 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t.adminPanel.pending}</p>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{pendingCount}</h3>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                  <AlertCircle size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-l-4 border-primary-500 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{lang === 'en' ? 'Verified Families' : 'عائلات تم التحقق منها'}</p>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{citizens.filter(c => c.status === 'verified').length}</h3>
                </div>
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-gray-800 dark:text-white">{t.adminPanel.recent}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-600 dark:text-gray-400 font-medium">
                  <tr>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.name}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.location}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.family}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {citizens.map((citizen) => (
                    <tr 
                      key={citizen.id} 
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition cursor-pointer"
                      onClick={() => openCitizenModal(citizen)}
                    >
                      <td className={`px-6 py-4 font-medium text-gray-900 dark:text-white ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div className="flex flex-col">
                          <span className="text-primary-600 dark:text-primary-400 hover:underline">{citizen.fullName}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{citizen.phone}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{citizen.currentLocation}</td>
                      <td className={`px-6 py-4 text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{citizen.familyMembers}</td>
                      <td className={`px-6 py-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          citizen.status === 'verified' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                          citizen.status === 'urgent' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                          'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        }`}>
                          {citizen.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {citizens.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400 dark:text-gray-500">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Announcements Manager */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 dark:text-white">{t.adminPanel.tabs.announcements}</h3>
              <button 
                onClick={() => openAdModal()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Plus size={16} />
                {t.adminPanel.announcements.add}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-600 dark:text-gray-400 font-medium">
                  <tr>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.announcements.titleEn}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.announcements.date}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.announcements.category}</th>
                    <th className={`px-6 py-3 text-center`}>{t.adminPanel.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {announcements.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                      <td className={`px-6 py-4 font-medium text-gray-900 dark:text-white ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {ad.title[lang]}
                      </td>
                      <td className={`px-6 py-4 text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {ad.date}
                      </td>
                      <td className={`px-6 py-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs">
                          {ad.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => openAdModal(ad)} className="text-blue-500 hover:text-blue-700">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => deleteAnnouncement(ad.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Citizen Detail Modal */}
      {selectedCitizen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-primary-600 dark:bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <User size={24} />
                <h3 className="text-xl font-bold">{t.adminPanel.modal.title}</h3>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-full transition">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grow">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Contact Info */}
                <div>
                  <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">
                    {t.adminPanel.modal.contactInfo}
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="text-primary-500 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.fields.fullName}</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedCitizen.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="text-primary-500 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.fields.phone}</p>
                        <p className="font-semibold text-gray-800 dark:text-white" dir="ltr">{selectedCitizen.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageCircle className="text-green-500 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.fields.whatsapp}</p>
                        <p className="font-semibold text-gray-800 dark:text-white" dir="ltr">{selectedCitizen.whatsapp}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Info */}
                <div>
                  <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">
                    {t.adminPanel.modal.requestInfo}
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary-500 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.fields.currentLoc}</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedCitizen.currentLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="text-primary-500 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.fields.familyCount}</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedCitizen.familyMembers}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1"><MapPin className="text-secondary-500" size={18} /></div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.fields.origAddress}</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedCitizen.originalAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.adminPanel.modal.updateStatus}</label>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as CitizenRecord['status'])}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="urgent">Urgent</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} />
                    {t.adminPanel.modal.feedback}
                  </label>
                  <textarea 
                    value={adminFeedback}
                    onChange={(e) => setAdminFeedback(e.target.value)}
                    placeholder={t.adminPanel.modal.feedbackPlaceholder}
                    rows={4}
                    maxLength={500}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-2">
                    {lang === 'en' 
                      ? '* This feedback will be sent via Email and WhatsApp.' 
                      : '* سيتم إرسال هذه الملاحظات عبر البريد الإلكتروني والواتساب.'}
                  </p>
                </div>
                
                {updateMessage && (
                  <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2 text-sm">
                    <CheckCircle size={16} />
                    <span>{updateMessage}</span>
                  </div>
                )}

                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={handleUpdateRecord}
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow transition flex justify-center items-center gap-2"
                  >
                    {isUpdating ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>{t.adminPanel.modal.sendFeedback}</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={closeModal}
                    className="px-6 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  >
                    {t.adminPanel.modal.close}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-primary-600 dark:bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
              <h3 className="text-xl font-bold">
                {editingAd ? t.adminPanel.announcements.edit : t.adminPanel.announcements.add}
              </h3>
              <button onClick={() => setIsAdModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.adminPanel.announcements.date}</label>
                  <input 
                    type="date"
                    value={adForm.date}
                    onChange={(e) => setAdForm({...adForm, date: e.target.value})}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.adminPanel.announcements.category}</label>
                  <select 
                    value={adForm.category}
                    onChange={(e) => setAdForm({...adForm, category: e.target.value})}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="general">General</option>
                    <option value="emergency">Emergency</option>
                    <option value="service">Service</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4 border-t border-gray-100 dark:border-slate-700 pt-4">
                <h4 className="font-bold text-gray-800 dark:text-white">English Content</h4>
                <input 
                  type="text" 
                  placeholder={t.adminPanel.announcements.titleEn}
                  value={adForm.titleEn}
                  onChange={(e) => setAdForm({...adForm, titleEn: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
                <textarea 
                  placeholder={t.adminPanel.announcements.contentEn}
                  value={adForm.contentEn}
                  onChange={(e) => setAdForm({...adForm, contentEn: e.target.value})}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>

              <div className="space-y-4 border-t border-gray-100 dark:border-slate-700 pt-4">
                <h4 className="font-bold text-gray-800 dark:text-white">Arabic Content</h4>
                <input 
                  type="text" 
                  placeholder={t.adminPanel.announcements.titleAr}
                  value={adForm.titleAr}
                  onChange={(e) => setAdForm({...adForm, titleAr: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-right"
                  dir="rtl"
                />
                <textarea 
                  placeholder={t.adminPanel.announcements.contentAr}
                  value={adForm.contentAr}
                  onChange={(e) => setAdForm({...adForm, contentAr: e.target.value})}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-right"
                  dir="rtl"
                ></textarea>
              </div>

              <button 
                onClick={saveAnnouncement}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow mt-4"
              >
                {t.adminPanel.announcements.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};