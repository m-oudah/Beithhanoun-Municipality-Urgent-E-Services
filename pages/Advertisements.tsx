import React, { useEffect, useState } from 'react';
import { Calendar, Megaphone, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Language, Announcement } from '../types';
import { TRANSLATIONS } from '../constants';
import { ApiService } from '../services/api';

interface AdvertisementsProps {
  lang: Language;
}

export const Advertisements: React.FC<AdvertisementsProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [ads, setAds] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await ApiService.getAnnouncements();
        setAds(data);
      } catch (error) {
        console.error("Failed to fetch ads", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'emergency': return <AlertTriangle className="text-red-500" />;
      case 'service': return <CheckCircle2 className="text-green-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'emergency': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900';
      case 'service': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900';
      default: return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary-600 text-white rounded-lg">
            <Megaphone size={28} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t.ads}</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow">
            <p className="text-gray-500 dark:text-gray-400">{t.noAds}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {ads.map((ad) => (
              <div 
                key={ad.id} 
                className={`p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all ${getCategoryColor(ad.category)} border-l-primary-500 bg-white dark:bg-slate-800`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(ad.category)}
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {ad.category}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 leading-relaxed">
                      {ad.title[lang]}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {ad.content[lang]}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full self-start">
                    <Calendar size={16} />
                    <span>{ad.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};