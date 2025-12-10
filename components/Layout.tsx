import React, { useState } from 'react';
import { Menu, X, Globe, Home, Users, Mail, LayoutDashboard } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Chatbot } from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
  currentPage: string;
  setPage: (p: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, lang, setLang, currentPage, setPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const navItems = [
    { id: 'home', label: t.home, icon: <Home size={18} /> },
    { id: 'register', label: t.register, icon: <Users size={18} /> },
    { id: 'contact', label: t.contact, icon: <Mail size={18} /> },
    { id: 'admin', label: t.admin, icon: <LayoutDashboard size={18} /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'font-cairo' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-lg sticky top-0 z-50 border-t-4 border-secondary-500 transition-colors">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo Area */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse cursor-pointer group" onClick={() => setPage('home')}>
              <div className="w-16 h-16 rounded-full border-2 border-primary-500 p-1 flex items-center justify-center bg-white shadow-sm group-hover:shadow-md transition">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Beit_Hanoun_Municipality_Logo.png" 
                  alt="Beit Hanoun Municipality Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-xs font-bold text-primary-500 text-center leading-tight">بيت<br>حانون</span>';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold leading-tight text-primary-600 dark:text-primary-500">{t.title}</h1>
                <span className="text-xs text-slate-500 dark:text-slate-400">{t.subtitle}</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                    currentPage === item.id 
                      ? 'bg-primary-500 text-white shadow-md' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary-600'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

              {/* Lang Toggle */}
              <button 
                onClick={toggleLang}
                className="ml-2 rtl:mr-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm"
              >
                <Globe size={16} className="text-primary-500" />
                <span className="dark:text-slate-200">{lang === 'en' ? 'العربية' : 'English'}</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 dark:text-slate-200">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    currentPage === item.id 
                      ? 'bg-primary-500 text-white' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => {
                    toggleLang();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300"
                >
                  <Globe size={20} />
                  <span>{lang === 'en' ? 'Switch to Arabic' : 'التبديل للإنجليزية'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 transition-colors">
        {children}
      </main>

      {/* Chatbot */}
      <Chatbot lang={lang} setPage={setPage} />

      {/* Footer */}
      <footer className="bg-secondary-800 text-slate-400 py-8 border-t-4 border-primary-500">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-slate-300">{t.footer}</p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
            <span>info@beithanoun.ps</span>
            <span>|</span>
            <span>+970 8 123 4567</span>
          </div>
        </div>
      </footer>
    </div>
  );
};