
import React from 'react';
import { ExternalLink, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, RELIEF_ORGANIZATIONS } from '../constants';

interface ReliefOrganizationsProps {
  lang: Language;
}

export const ReliefOrganizations: React.FC<ReliefOrganizationsProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
         <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary-600 text-white rounded-lg">
            <HeartHandshake size={28} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t.relief}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RELIEF_ORGANIZATIONS.map((org) => (
            <div key={org.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className={`text-xl font-bold mb-3 ${org.color} dark:text-white`}>
                  {org.name[lang]}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {org.desc[lang]}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-t border-gray-100 dark:border-slate-700">
                <a 
                  href={org.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-primary-700 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-slate-600 transition"
                >
                  <span>{t.visitWebsite}</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
