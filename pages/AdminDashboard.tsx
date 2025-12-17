
import React, { useEffect, useState } from 'react';
import { Users, AlertCircle, CheckCircle, Lock, User, Key, LogOut, X, Phone, MessageCircle, MapPin, Send, MessageSquare, Megaphone, Edit, Trash2, Plus, Calendar, FileSpreadsheet, Printer, Mail, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';
import { Language, CitizenRecord, Announcement, ContactMessage } from '../types';
import { TRANSLATIONS } from '../constants';
import { ApiService } from '../services/api';
import { sanitizeInput } from '../utils/validation';

interface AdminProps {
  lang: Language;
}

// Added React import to resolve "Cannot find namespace 'React'" error on line 13
export const AdminDashboard: React.FC<AdminProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'registry' | 'messages' | 'announcements'>('registry');

  // Registry (Citizens) State
  const [citizens, setCitizens] = useState<CitizenRecord[]>([]);
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenRecord | null>(null);
  const [adminFeedback, setAdminFeedback] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CitizenRecord['status']>('pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Messages (Inquiries) State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Announcement State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Announcement | null>(null);
  const [adForm, setAdForm] = useState({
    titleEn: '', titleAr: '', contentEn: '', contentAr: '', category: 'general', date: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'registry') {
        ApiService.getCitizens().then(setCitizens);
      } else if (activeTab === 'messages') {
        ApiService.getContactMessages().then(setMessages);
      } else {
        ApiService.getAnnouncements().then(setAnnouncements);
      }
    }
  }, [isAuthenticated, activeTab]);

  // Added React import to resolve "Cannot find namespace 'React'" error on line 54
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

  // --- Export & Print Functions ---
  const downloadCSV = () => {
    if (citizens.length === 0) return;
    
    // Included all fields in export including hidden ones (Wife Name, Notes, Original Address)
    const headers = [
      'Full Name', 'ID Number', 'Phone', 'Original Area', 'Original Street', 'Address Details',
      'Current State', 'Evacuation Type', 'Wife Name', 'Family Members', 'Males', 'Females', 'Notes', 'Status'
    ];

    const rows = citizens.map(c => [
      `"${c.fullName}"`, `"${c.idNumber}"`, `"${c.phone}"`, `"${c.originalArea}"`, `"${c.originalStreet}"`, `"${c.originalAddressDetails || ''}"`,
      `"${c.currentEvacuationState}"`, `"${c.evacuationType}"`, `"${c.wifeName}"`, c.familyMembers, c.males, c.females, `"${c.notes || ''}"`, c.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `citizens_registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Citizen Logic ---
  const openCitizenModal = (citizen: CitizenRecord) => {
    setSelectedCitizen(citizen);
    setSelectedStatus(citizen.status);
    setAdminFeedback(citizen.adminFeedback || '');
    setUpdateMessage('');
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

  const toggleAdVisibility = async (id: string) => {
    const updated = await ApiService.toggleAnnouncementVisibility(id);
    if (updated) {
      setAnnouncements(announcements.map(a => a.id === id ? updated : a));
    }
  };

  // Added React import to resolve "Cannot find namespace 'React'" error on line 178
  const toggleResponded = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = await ApiService.toggleMessageResponded(id);
    if (updated) {
      setMessages(messages.map(m => m.id === id ? updated : m));
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

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-table, .printable-table * {
            visibility: visible;
          }
          .printable-table {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
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
      <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200 dark:border-slate-700 no-print">
        <button 
          onClick={() => setActiveTab('registry')}
          className={`px-4 md:px-6 py-3 font-bold border-b-2 transition flex items-center gap-2 ${activeTab === 'registry' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <FileSpreadsheet size={18} />
          {t.adminPanel.tabs.registry}
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`px-4 md:px-6 py-3 font-bold border-b-2 transition flex items-center gap-2 ${activeTab === 'messages' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Mail size={18} />
          {t.adminPanel.tabs.messages}
        </button>
        <button 
          onClick={() => setActiveTab('announcements')}
          className={`px-4 md:px-6 py-3 font-bold border-b-2 transition flex items-center gap-2 ${activeTab === 'announcements' ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Megaphone size={18} />
          {t.adminPanel.tabs.announcements}
        </button>
      </div>

      {/* TAB: DISPLACEMENT REGISTRY (FULL DATA) */}
      {activeTab === 'registry' && (
        <div className="printable-table">
            <div className="flex justify-between items-center mb-4 no-print">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t.adminPanel.totalCitizens}: {citizens.length}</h3>
                <div className="flex gap-2">
                    <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold">
                        <FileSpreadsheet size={16} /> {t.adminPanel.exportExcel}
                    </button>
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm font-semibold">
                        <Printer size={16} /> {t.adminPanel.printPdf}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 font-bold uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3 text-center">#</th>
                        <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.name}</th>
                        <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.idNumber}</th>
                        <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.phone}</th>
                        {/* Hidden Original Address from table view but kept in export */}
                        <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.fields.currentLoc}</th>
                        <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.family}</th>
                        {/* Hidden Wife Name from table view but kept in export */}
                        {/* Hidden Notes from table view but kept in export */}
                        <th className="px-4 py-3 no-print">{t.adminPanel.table.actions}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {citizens.map((citizen, idx) => (
                        <tr key={citizen.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                            <td className="px-4 py-3 text-center text-gray-500">{idx + 1}</td>
                            <td className={`px-4 py-3 font-medium text-gray-900 dark:text-white ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{citizen.fullName}</td>
                            <td className={`px-4 py-3 text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{citizen.idNumber}</td>
                            <td className={`px-4 py-3 text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{citizen.phone}</td>
                            <td className={`px-4 py-3 text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{citizen.currentEvacuationState} ({citizen.evacuationType})</td>
                            <td className={`px-4 py-3 text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{citizen.familyMembers} (M:{citizen.males}/F:{citizen.females})</td>
                            <td className="px-4 py-3 no-print">
                                <button 
                                    onClick={() => openCitizenModal(citizen)}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 text-xs font-bold border border-blue-200 dark:border-blue-900 px-2 py-1 rounded"
                                >
                                    <Edit size={14} /> Update
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
      )}

      {/* TAB: MESSAGES / INQUIRIES (MODIFIED) */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-gray-800 dark:text-white">{t.adminPanel.tabs.messages}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-600 dark:text-gray-400 font-medium">
                  <tr>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.responded}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.name}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.subject}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.phone}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.date}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {messages.map((msg) => (
                    <tr 
                      key={msg.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition cursor-pointer ${msg.responded ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => toggleResponded(e, msg.id)}
                          className={`p-1 rounded-md transition ${msg.responded ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {msg.responded ? <CheckSquare size={20} /> : <Square size={20} />}
                        </button>
                      </td>
                      <td className={`px-6 py-4 font-medium text-gray-900 dark:text-white ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {msg.name}
                        {msg.status === 'unread' && <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>}
                      </td>
                      <td className={`px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{msg.subject}</td>
                      <td className={`px-6 py-4 text-gray-600 dark:text-gray-300 font-mono ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{msg.whatsapp}</td>
                      <td className={`px-6 py-4 text-gray-500 text-xs ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{msg.submittedAt}</td>
                      <td className={`px-6 py-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <button className="text-primary-600 hover:text-primary-800">
                            <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400 dark:text-gray-500">
                        No messages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
      )}

      {/* TAB: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
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
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.announcements.titleAr}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.announcements.date}</th>
                    <th className={`px-6 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.announcements.category}</th>
                    <th className={`px-6 py-3 text-center`}>{t.adminPanel.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {announcements.map((ad) => (
                    <tr key={ad.id} className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition ${ad.hidden ? 'opacity-50 grayscale' : ''}`}>
                      <td className={`px-6 py-4 font-medium text-gray-900 dark:text-white ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {ad.title.ar}
                      </td>
                      <td className={`px-6 py-4 text-gray-600 dark:text-gray-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {ad.date}
                      </td>
                      <td className={`px-6 py-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs">
                          {t.adminPanel.announcements.categories[ad.category as keyof typeof t.adminPanel.announcements.categories]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => openAdModal(ad)} className="text-blue-500 hover:text-blue-700">
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => toggleAdVisibility(ad.id)} 
                            className={`${ad.hidden ? 'text-green-500 hover:text-green-700' : 'text-amber-500 hover:text-amber-700'}`}
                            title={ad.hidden ? t.adminPanel.announcements.show : t.adminPanel.announcements.hide}
                          >
                            {ad.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
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

      {/* Citizen Update Modal */}
      {selectedCitizen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-primary-600 dark:bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
              <h3 className="text-xl font-bold">{t.adminPanel.modal.updateStatus}</h3>
              <button onClick={() => setSelectedCitizen(null)} className="p-2 hover:bg-white/20 rounded-full transition">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
                 <p className="mb-4 font-bold text-gray-800 dark:text-white text-lg">{selectedCitizen.fullName}</p>
                 <div className="mb-4">
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
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.adminPanel.modal.feedback}</label>
                  <textarea 
                    value={adminFeedback}
                    onChange={(e) => setAdminFeedback(e.target.value)}
                    placeholder={t.adminPanel.modal.feedbackPlaceholder}
                    rows={4}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  ></textarea>
                </div>
                {updateMessage && <div className="mb-4 text-green-600 font-bold">{updateMessage}</div>}
                <button 
                    onClick={handleUpdateRecord}
                    disabled={isUpdating}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow"
                >
                    {isUpdating ? "Saving..." : t.adminPanel.modal.sendFeedback}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="bg-slate-700 dark:bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
                    <h3 className="text-xl font-bold">{t.adminPanel.modal.messageDetails}</h3>
                    <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-white/20 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-4 text-gray-800 dark:text-gray-200">
                    <div>
                        <span className="block text-xs uppercase text-gray-500 font-bold">{t.adminPanel.table.name}</span>
                        <p className="text-lg font-semibold">{selectedMessage.name}</p>
                    </div>
                    <div>
                        <span className="block text-xs uppercase text-gray-500 font-bold">Email</span>
                        <p className="text-base font-mono">{selectedMessage.email}</p>
                    </div>
                    <div>
                        <span className="block text-xs uppercase text-gray-500 font-bold">{t.adminPanel.table.phone}</span>
                        <p className="text-base font-mono">{selectedMessage.whatsapp}</p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
                        <span className="block text-xs uppercase text-gray-500 font-bold mb-1">{t.adminPanel.table.subject}</span>
                        <p className="font-bold">{selectedMessage.subject}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                    <div className="flex justify-end pt-2">
                        <a 
                            href={`https://wa.me/${selectedMessage.whatsapp?.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-green-700"
                        >
                            <MessageCircle size={16} /> {lang === 'ar' || true ? 'الرد عبر واتساب' : 'الرد عبر واتساب'}
                        </a>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Announcement Modal */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
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
                    <option value="general">{TRANSLATIONS.ar.adminPanel.announcements.categories.general}</option>
                    <option value="emergency">{TRANSLATIONS.ar.adminPanel.announcements.categories.emergency}</option>
                    <option value="service">{TRANSLATIONS.ar.adminPanel.announcements.categories.service}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 dark:border-slate-700 pt-4">
                <h4 className="font-bold text-gray-800 dark:text-white">المحتوى العربي</h4>
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
