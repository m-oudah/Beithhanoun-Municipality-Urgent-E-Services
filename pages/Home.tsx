import React from 'react';
import { ArrowRight, ArrowLeft, Building2, Users2, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface HomeProps {
  lang: Language;
  setPage: (p: string) => void;
}

export const Home: React.FC<HomeProps> = ({ lang, setPage }) => {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-slate-900 text-white py-24 px-4 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500 opacity-10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-cairo shadow-sm">{t.welcome}</h2>
          <p className="text-lg md:text-xl text-primary-50 mb-10 leading-relaxed font-light">
            {t.welcomeDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setPage('register')}
              className="px-8 py-4 bg-white text-primary-700 font-bold rounded-lg shadow-lg hover:bg-secondary-500 hover:text-white transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <span>{t.btnRegister}</span>
              <Arrow size={20} />
            </button>
            <button 
              onClick={() => setPage('contact')}
              className="px-8 py-4 bg-primary-900 bg-opacity-30 border border-white/30 text-white font-semibold rounded-lg hover:bg-opacity-50 transition flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <span>{t.btnContact}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-12 mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border-b-4 border-primary-500 transition-colors">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
              <Users2 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{t.register}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {lang === 'en' 
                ? 'Update your family status and current location to help the municipality provide aid.' 
                : 'قم بتحديث حالة العائلة ومكان السكن الحالي لمساعدة البلدية في تقديم الخدمات.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border-b-4 border-secondary-500 transition-colors">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-secondary-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
              <Building2 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{lang === 'en' ? 'Reconstruction' : 'إعادة الإعمار'}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {lang === 'en' 
                ? 'Track property damage reports and municipal planning updates.' 
                : 'متابعة تقارير الأضرار وخطط البلدية للمشاريع المستقبلية.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border-b-4 border-slate-500 transition-colors">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{lang === 'en' ? 'Official Channels' : 'قنوات رسمية'}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {lang === 'en' 
                ? 'Communicate directly with authorized personnel for secure assistance.' 
                : 'تواصل مباشرة مع الموظفين المختصين للحصول على مساعدة آمنة وموثوقة.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};