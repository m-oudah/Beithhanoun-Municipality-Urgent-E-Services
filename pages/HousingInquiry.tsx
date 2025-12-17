
import React, { useState } from 'react';
import { Search, ShieldCheck, Building, AlertCircle, MapPin, Layers, Maximize, CheckCircle, XCircle, Info, Calendar } from 'lucide-react';
import { Language, HousingUnit } from '../types';
import { TRANSLATIONS } from '../constants';
import { ApiService } from '../services/api';

interface HousingInquiryProps {
  lang: Language;
}

export const HousingInquiry: React.FC<HousingInquiryProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].housing;
  const isRTL = lang === 'ar';

  const [searchData, setSearchData] = useState({
    ownerName: '',
    idNumber: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<HousingUnit | null>(null);
  const [error, setError] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setUnit(null);
    setShowResults(false);

    try {
      const result = await ApiService.inquireHousingUnit({
        ownerName: searchData.ownerName,
        idNumber: searchData.idNumber,
        address: searchData.address
      });
      if (result) {
        setUnit(result);
        setShowResults(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'total_destruction': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'uninhabitable': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800';
      case 'habitable': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'total_destruction': return <XCircle size={24} />;
      case 'uninhabitable': return <AlertCircle size={24} />;
      case 'habitable': return <CheckCircle size={24} />;
      default: return <Info size={24} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-secondary-600 text-white rounded-lg shadow-lg shadow-secondary-500/20">
            <Building size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Inquiry Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4 text-secondary-600">
                <ShieldCheck size={20} />
                <h3 className="font-bold">{t.verifyTitle}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-6">{t.verifyDesc}</p>

              <form onSubmit={handleInquiry} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">{t.owner}</label>
                  <input 
                    type="text" 
                    required
                    value={searchData.ownerName}
                    onChange={e => setSearchData({...searchData, ownerName: e.target.value})}
                    placeholder={isRTL ? "أدخل الاسم أو جزء منه..." : "Owner name or part of it..."}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-secondary-500 transition text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">{t.idNumber}</label>
                  <input 
                    type="text" 
                    required
                    maxLength={9}
                    value={searchData.idNumber}
                    onChange={e => setSearchData({...searchData, idNumber: e.target.value.replace(/\D/g, '')})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-secondary-500 transition text-sm font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400">{t.unitAddress}</label>
                  <input 
                    type="text" 
                    required
                    value={searchData.address}
                    onChange={e => setSearchData({...searchData, address: e.target.value})}
                    placeholder={isRTL ? "مثلاً: القرمان أو السكة..." : "e.g., Al-Qarman..."}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-secondary-500 transition text-sm"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">{isRTL ? "* يكفي إدخال جزء من العنوان المسجل" : "* Partial address is enough"}</p>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Search size={18} />
                      <span>{t.btnVerify}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-6 rounded-2xl flex flex-col items-center text-center animate-in fade-in zoom-in">
                <XCircle size={48} className="text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-2">{isRTL ? 'خطأ في الاستعلام' : 'Inquiry Error'}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.notFound}</p>
              </div>
            )}

            {showResults && unit && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
                  <div className={`p-6 border-b flex items-center justify-between ${getConditionColor(unit.condition)}`}>
                    <div className="flex items-center gap-4">
                      {getConditionIcon(unit.condition)}
                      <div>
                        <h3 className="text-xl font-bold">{t.conditions[unit.condition]}</h3>
                        <p className="text-xs opacity-75">{t.condition}</p>
                      </div>
                    </div>
                    <Building size={32} className="opacity-20" />
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-start gap-3">
                        <Maximize className="text-secondary-500 mt-1" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">{t.area}</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{unit.area} متر مربع</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Layers className="text-secondary-500 mt-1" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">{t.floors}</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{unit.floors}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="text-secondary-500 mt-1" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">{t.unitAddress}</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{unit.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="text-secondary-500 mt-1" size={20} />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">{t.lastUpdate}</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{unit.lastUpdated}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-2 text-primary-600">
                        <ShieldCheck size={18} />
                        <span className="text-sm font-bold">{isRTL ? 'مالك الوحدة المعتمد' : 'Registered Owner'}</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{unit.ownerName}</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl text-xs text-gray-500 flex items-center gap-2">
                        <Info size={14} />
                        <p>{isRTL ? 'هذه البيانات رسمية ومعتمدة لدى لجنة تقييم الأضرار في بلدية بيت حانون.' : 'This data is official and approved by the Damage Assessment Committee.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!showResults && !error && (
              <div className="bg-slate-100/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Building size={64} className="mb-4 opacity-10" />
                <p>{isRTL ? 'بانتظار إدخال بيانات التحقق للاستعلام' : 'Waiting for verification data to inquire'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
