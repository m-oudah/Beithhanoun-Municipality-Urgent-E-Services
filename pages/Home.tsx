import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Building2, Users2, ShieldCheck, Megaphone, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, Announcement } from '../types';
import { ApiService } from '../services/api';

interface HomeProps {
  lang: Language;
  setPage: (p: string) => void;
}

export const Home: React.FC<HomeProps> = ({ lang, setPage }) => {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const Chevron = isRTL ? ChevronLeft : ChevronRight;
  
  const [ads, setAds] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await ApiService.getAnnouncements();
        // Get top 3 latest
        setAds(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to load announcements");
      }
    };
    fetchAds();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-600 to-secondary-800 text-white py-24 px-4 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-20 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-cairo shadow-sm leading-tight">{t.welcome}</h2>
          <p className="text-lg text-gray-100 mb-10 leading-relaxed font-light">
            {t.welcomeDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setPage('register')}
              className="px-8 py-4 bg-white text-primary-700 font-bold rounded-lg shadow-lg hover:bg-primary-600 hover:text-white transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <span>{t.btnRegister}</span>
              <Arrow size={20} />
            </button>
            <button 
              onClick={() => setPage('contact')}
              className="px-8 py-4 bg-black bg-opacity-30 border border-white/30 text-white font-semibold rounded-lg hover:bg-opacity-50 transition flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <span>{t.btnContact}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            onClick={() => setPage('register')}
            className="cursor-pointer bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border-b-4 border-primary-500 transition-all group hover:transform hover:-translate-y-1 hover:shadow-xl duration-300"
          >
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition">
              <Users2 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-primary-600 transition">{t.register}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {lang === 'en' 
                ? 'Update your family status and current location to help the municipality provide aid.' 
                : 'قم بتحديث حالة العائلة ومكان السكن الحالي لمساعدة البلدية في تقديم الخدمات.'}
            </p>
          </div>

          <div 
            onClick={() => {}} // Placeholder for now, could link to a reconstruction page if it existed
            className="cursor-pointer bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border-b-4 border-secondary-500 transition-all group hover:transform hover:-translate-y-1 hover:shadow-xl duration-300"
          >
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-secondary-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary-600 group-hover:text-white transition">
              <Building2 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-secondary-600 transition">{lang === 'en' ? 'Reconstruction' : 'إعادة الإعمار'}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {lang === 'en' 
                ? 'Track property damage reports and municipal planning updates.' 
                : 'متابعة تقارير الأضرار وخطط البلدية للمشاريع المستقبلية.'}
            </p>
          </div>

          <div 
            onClick={() => setPage('contact')}
            className="cursor-pointer bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border-b-4 border-slate-500 transition-all group hover:transform hover:-translate-y-1 hover:shadow-xl duration-300"
          >
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center mb-6 group-hover:bg-slate-600 group-hover:text-white transition">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-slate-600 transition">{lang === 'en' ? 'Official Channels' : 'قنوات رسمية'}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {lang === 'en' 
                ? 'Communicate directly with authorized personnel for secure assistance.' 
                : 'تواصل مباشرة مع الموظفين المختصين للحصول على مساعدة آمنة وموثوقة.'}
            </p>
          </div>
        </div>
      </div>

      {/* Announcements Section (Moved to bottom) */}
      <div className="bg-slate-100 dark:bg-slate-900/50 py-12">
        <div className="container mx-auto px-4 relative z-20">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Megaphone className="text-secondary-600" />
                    {t.latestAds}
                </h3>
                <button 
                    onClick={() => setPage('ads')}
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1 text-sm"
                >
                    {t.viewAllAds}
                    <Chevron size={16} />
                </button>
            </div>

            {ads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ads.map(ad => (
                        <div key={ad.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition flex flex-col">
                            <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className={`px-2 py-1 rounded-full uppercase font-bold ${
                                    ad.category === 'emergency' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                }`}>{ad.category}</span>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{ad.date}</span>
                                </div>
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">{ad.title[lang]}</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-grow">
                                {ad.content[lang]}
                            </p>
                            <button 
                                onClick={() => setPage('ads')}
                                className="text-secondary-600 dark:text-secondary-400 text-sm font-semibold hover:underline self-start"
                            >
                                {t.readMore}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <p className="text-gray-500">{t.noAds}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};