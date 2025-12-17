
import React from 'react';
import { AlertTriangle, Home, Users, Heart, Zap, Book, Moon, Activity, FileText } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, WAR_STATS } from '../constants';

interface War2023Props {
  lang: Language;
}

export const War2023: React.FC<War2023Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const getIcon = (key: string) => {
    switch(key) {
      case 'martyrs': return <Heart className="text-red-600" size={32} />;
      case 'injured': return <Activity className="text-orange-500" size={32} />;
      case 'destroyed_homes': return <Home className="text-red-800" size={32} />;
      case 'damaged_homes': return <Home className="text-orange-400" size={32} />;
      case 'schools': return <Book className="text-blue-500" size={32} />;
      case 'mosques': return <Moon className="text-green-600" size={32} />;
      case 'displaced': return <Users className="text-purple-500" size={32} />;
      case 'infra': return <Zap className="text-yellow-600" size={32} />;
      default: return <AlertTriangle size={32} />;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-full mb-6 shadow-lg shadow-red-600/30">
            <AlertTriangle size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-cairo">
            {isRTL ? 'تقرير العدوان على بيت حانون 2023-2025' : 'Beit Hanoun War Report 2023-2025'}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {isRTL ? 'إحصائيات رسمية حول حجم الدمار والمعاناة الإنسانية' : 'Official statistics on the scale of destruction and humanitarian suffering'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <div className="max-w-4xl mx-auto mb-16 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border-l-8 border-red-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-3">
            <FileText size={28} className="text-red-600" />
            {isRTL ? 'نظرة عامة' : 'Overview'}
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {WAR_STATS.overview[lang]}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {WAR_STATS.stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center hover:transform hover:-translate-y-1 transition duration-300">
              <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-900 rounded-full">
                {getIcon(stat.key)}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 font-mono">{stat.value}</h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {stat[lang]}
              </p>
            </div>
          ))}
        </div>

        {/* Image Gallery (Placeholders) */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">
            {isRTL ? 'صور من واقع الدمار' : 'Images of Destruction'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group overflow-hidden rounded-xl h-64">
              <img 
                src="https://placehold.co/600x400/800000/FFF?text=Destruction+Image+1" 
                alt="Destruction 1" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition">
                <p className="text-white font-bold">{isRTL ? 'دمار البنية التحتية' : 'Infrastructure Damage'}</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl h-64">
              <img 
                src="https://placehold.co/600x400/550000/FFF?text=Destruction+Image+2" 
                alt="Destruction 2" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition">
                <p className="text-white font-bold">{isRTL ? 'ركام المنازل' : 'Rubble of Homes'}</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl h-64">
              <img 
                src="https://placehold.co/600x400/333333/FFF?text=Destruction+Image+3" 
                alt="Destruction 3" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition">
                <p className="text-white font-bold">{isRTL ? 'استهداف المدارس' : 'Targeting Schools'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sources */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            {isRTL ? 'المصادر الرسمية' : 'Official Sources'}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {WAR_STATS.sources.map((source, idx) => (
              <li key={idx} className="hover:text-primary-600 transition">
                {source[lang]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
