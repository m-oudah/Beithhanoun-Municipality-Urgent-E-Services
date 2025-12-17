
import React, { useEffect, useState, useRef } from 'react';
import { Users, AlertCircle, CheckCircle, Lock, User, Key, LogOut, X, Phone, MessageCircle, MapPin, Send, MessageSquare, Megaphone, Edit, Trash2, Plus, Calendar, FileSpreadsheet, Printer, Mail, Eye, EyeOff, CheckSquare, Square, Building, Download, Upload } from 'lucide-react';
import { Language, CitizenRecord, Announcement, ContactMessage, HousingUnit } from '../types';
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
  const [activeTab, setActiveTab] = useState<'registry' | 'messages' | 'announcements' | 'housing'>('registry');

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

  // Housing Units State
  const [housingUnits, setHousingUnits] = useState<HousingUnit[]>([]);
  const [isHousingModalOpen, setIsHousingModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<HousingUnit | null>(null);
  const [housingForm, setHousingForm] = useState<Omit<HousingUnit, 'id'>>({
    ownerName: '', ownerId: '', dob: '', idIssueDate: '', address: '', floors: 0, area: 0, condition: 'habitable', lastUpdated: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'registry') {
        ApiService.getCitizens().then(setCitizens);
      } else if (activeTab === 'messages') {
        ApiService.getContactMessages().then(setMessages);
      } else if (activeTab === 'housing') {
        ApiService.getAllHousingUnits().then(setHousingUnits);
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
  };

  // --- Export & Print Functions ---
  const downloadCSV = () => {
    if (citizens.length === 0) return;
    const headers = ['Full Name', 'ID Number', 'Phone', 'Original Area', 'Original Street', 'Address Details', 'Current State', 'Evacuation Type', 'Wife Name', 'Family Members', 'Males', 'Females', 'Notes', 'Status'];
    const rows = citizens.map(c => [`"${c.fullName}"`, `"${c.idNumber}"`, `"${c.phone}"`, `"${c.originalArea}"`, `"${c.originalStreet}"`, `"${c.originalAddressDetails || ''}"`, `"${c.currentEvacuationState}"`, `"${c.evacuationType}"`, `"${c.wifeName}"`, c.familyMembers, c.males, c.females, `"${c.notes || ''}"`, c.status]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `citizens_registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadHousingCSV = () => {
    if (housingUnits.length === 0) return;
    const headers = ['Owner Name', 'ID Number', 'Address', 'Floors', 'Area', 'Condition', 'Last Updated'];
    const rows = housingUnits.map(u => [`"${u.ownerName}"`, `"${u.ownerId}"`, `"${u.address}"`, u.floors, u.area, u.condition, u.lastUpdated]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `housing_units_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleHousingImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newUnits: HousingUnit[] = [];
      
      // Basic CSV parser (skipping header)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(',').map(c => c.replace(/"/g, ''));
        if (cols.length >= 6) {
          newUnits.push({
            id: Math.random().toString(36).substr(2, 9),
            ownerName: cols[0],
            ownerId: cols[1],
            address: cols[2],
            floors: parseInt(cols[3]) || 1,
            area: parseInt(cols[4]) || 100,
            condition: cols[5] as any,
            lastUpdated: cols[6] || new Date().toISOString().split('T')[0],
            dob: '',
            idIssueDate: ''
          });
        }
      }

      if (newUnits.length > 0) {
        await ApiService.importHousingUnits(newUnits);
        setHousingUnits(newUnits);
        alert(lang === 'ar' ? `تم استيراد ${newUnits.length} وحدة بنجاح` : `Imported ${newUnits.length} units successfully`);
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Housing Logic ---
  const openHousingModal = (unit?: HousingUnit) => {
    if (unit) {
      setEditingUnit(unit);
      setHousingForm({
        ownerName: unit.ownerName,
        ownerId: unit.ownerId,
        address: unit.address,
        floors: unit.floors,
        area: unit.area,
        condition: unit.condition,
        lastUpdated: unit.lastUpdated,
        dob: unit.dob || '',
        idIssueDate: unit.idIssueDate || ''
      });
    } else {
      setEditingUnit(null);
      setHousingForm({
        ownerName: '', ownerId: '', dob: '', idIssueDate: '', address: '', floors: 1, area: 100, condition: 'habitable', lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
    setIsHousingModalOpen(true);
  };

  const saveHousingUnit = async () => {
    const data = {
      ...housingForm,
      ownerName: sanitizeInput(housingForm.ownerName),
      address: sanitizeInput(housingForm.address),
    };

    if (editingUnit) {
      await ApiService.updateHousingUnit(editingUnit.id, data);
    } else {
      await ApiService.createHousingUnit(data);
    }
    
    const updatedList = await ApiService.getAllHousingUnits();
    setHousingUnits(updatedList);
    setIsHousingModalOpen(false);
  };

  const deleteHousingUnit = async (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الوحدة؟' : 'Are you sure you want to delete this unit?')) {
      await ApiService.deleteHousingUnit(id);
      setHousingUnits(housingUnits.filter(u => u.id !== id));
    }
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
          body * { visibility: hidden; }
          .printable-table, .printable-table * { visibility: visible; }
          .printable-table { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
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
        {[
            { id: 'registry', icon: <FileSpreadsheet size={18} />, label: t.adminPanel.tabs.registry },
            { id: 'messages', icon: <Mail size={18} />, label: t.adminPanel.tabs.messages },
            { id: 'housing', icon: <Building size={18} />, label: t.adminPanel.tabs.housing },
            { id: 'announcements', icon: <Megaphone size={18} />, label: t.adminPanel.tabs.announcements },
        ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 md:px-6 py-3 font-bold border-b-2 transition flex items-center gap-2 ${activeTab === tab.id ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                {tab.icon}
                {tab.label}
            </button>
        ))}
      </div>

      {/* TAB: DISPLACEMENT REGISTRY */}
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
                        <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.fields.currentLoc}</th>
                        <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.adminPanel.table.family}</th>
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
                                <button onClick={() => openCitizenModal(citizen)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 text-xs font-bold border border-blue-200 dark:border-blue-900 px-2 py-1 rounded">
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

      {/* TAB: HOUSING UNITS (NEW) */}
      {activeTab === 'housing' && (
        <div className="printable-table">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3 no-print">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t.adminPanel.tabs.housing}: {housingUnits.length}</h3>
                <div className="flex flex-wrap gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleHousingImport} className="hidden" accept=".csv" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm font-semibold transition">
                        <Upload size={16} /> {t.adminPanel.importExcel}
                    </button>
                    <button onClick={downloadHousingCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold transition">
                        <Download size={16} /> {t.adminPanel.exportExcel}
                    </button>
                    <button onClick={() => openHousingModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold transition">
                        <Plus size={16} /> {t.adminPanel.announcements.add}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 font-bold uppercase">
                            <tr>
                                <th className="px-4 py-3 text-center">#</th>
                                <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.housing.owner}</th>
                                <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.housing.idNumber}</th>
                                <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.housing.unitAddress}</th>
                                <th className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.housing.condition}</th>
                                <th className="px-4 py-3 text-center no-print">{t.adminPanel.table.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {housingUnits.map((unit, idx) => (
                                <tr key={unit.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                                    <td className="px-4 py-3 text-center text-gray-500">{idx + 1}</td>
                                    <td className={`px-4 py-3 font-medium text-gray-900 dark:text-white ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{unit.ownerName}</td>
                                    <td className={`px-4 py-3 font-mono ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{unit.ownerId}</td>
                                    <td className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{unit.address}</td>
                                    <td className={`px-4 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            unit.condition === 'total_destruction' ? 'bg-red-100 text-red-700' : 
                                            unit.condition === 'uninhabitable' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {t.housing.conditions[unit.condition]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 no-print">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => openHousingModal(unit)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => deleteHousingUnit(unit.id)} className="p-1 text-red-600 hover:bg-red-50 rounded transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* Housing Edit Modal */}
      {isHousingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[95vh] flex flex-col">
            <div className="bg-primary-600 p-6 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold">{editingUnit ? t.adminPanel.announcements.edit : t.adminPanel.announcements.add}</h3>
              <button onClick={() => setIsHousingModalOpen(false)} className="hover:bg-white/20 rounded-full transition p-1"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase">{t.housing.owner}</label>
                <input type="text" value={housingForm.ownerName} onChange={e => setHousingForm({...housingForm, ownerName: e.target.value})} className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">{t.housing.idNumber}</label>
                <input type="text" value={housingForm.ownerId} onChange={e => setHousingForm({...housingForm, ownerId: e.target.value})} className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">{t.housing.unitAddress}</label>
                <input type="text" value={housingForm.address} onChange={e => setHousingForm({...housingForm, address: e.target.value})} className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">{t.housing.floors}</label>
                <input type="number" value={housingForm.floors} onChange={e => setHousingForm({...housingForm, floors: parseInt(e.target.value) || 1})} className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">{t.housing.area}</label>
                <input type="number" value={housingForm.area} onChange={e => setHousingForm({...housingForm, area: parseInt(e.target.value) || 100})} className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">{t.housing.condition}</label>
                <select value={housingForm.condition} onChange={e => setHousingForm({...housingForm, condition: e.target.value as any})} className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900">
                    <option value="habitable">{t.housing.conditions.habitable}</option>
                    <option value="uninhabitable">{t.housing.conditions.uninhabitable}</option>
                    <option value="total_destruction">{t.housing.conditions.total_destruction}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">{t.housing.lastUpdate}</label>
                <input type="date" value={housingForm.lastUpdated} onChange={e => setHousingForm({...housingForm, lastUpdated: e.target.value})} className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-900" />
              </div>
              <div className="col-span-1 md:col-span-2 pt-4">
                <button onClick={saveHousingUnit} className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 transition">
                    {t.adminPanel.announcements.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ... (Keep Registry Update Modal, Message Modal, and Announcement Modal as they are) ... */}
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
