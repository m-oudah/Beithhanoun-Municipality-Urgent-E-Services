
import React, { useState } from 'react';
import { User, Phone, Users, MapPin, Send, Home, MessageCircle, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, LOCATIONS } from '../constants';
import { ApiService } from '../services/api';
import { validateName, validatePhone, sanitizeInput } from '../utils/validation';

interface CitizenFormProps {
  lang: Language;
}

export const CitizenForm: React.FC<CitizenFormProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    familyMembers: 1,
    currentLocation: '',
    originalAddress: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!validateName(formData.fullName)) {
      newErrors.fullName = t.validation.nameTooShort;
    }
    
    if (!validatePhone(formData.phone)) {
      newErrors.phone = t.validation.invalidPhone;
    }

    if (!validatePhone(formData.whatsapp)) {
      newErrors.whatsapp = t.validation.invalidPhone;
    }

    if (!formData.currentLocation) {
      newErrors.currentLocation = t.validation.required;
    }

    if (formData.originalAddress.length < 5) {
      newErrors.originalAddress = t.validation.required;
    }

    if (formData.familyMembers < 1) {
      newErrors.familyMembers = t.validation.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const sanitizedData = {
        fullName: sanitizeInput(formData.fullName),
        phone: sanitizeInput(formData.phone),
        whatsapp: sanitizeInput(formData.whatsapp),
        familyMembers: formData.familyMembers,
        currentLocation: sanitizeInput(formData.currentLocation),
        originalAddress: sanitizeInput(formData.originalAddress)
      };

      await ApiService.submitCitizenData(sanitizedData);
      setSuccess(true);
      setFormData({ fullName: '', phone: '', whatsapp: '', familyMembers: 1, currentLocation: '', originalAddress: '' });
      setErrors({});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border-t-4 border-green-500 transition-colors">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="text-green-600 dark:text-green-400" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{lang === 'en' ? 'Submission Successful' : 'تم الإرسال بنجاح'}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{lang === 'en' ? 'Your data has been securely recorded by the municipality.' : 'تم تسجيل بياناتك بشكل آمن لدى البلدية.'}</p>
          <button 
            onClick={() => setSuccess(false)}
            className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          >
            {lang === 'en' ? 'Submit another form' : 'تسجيل نموذج آخر'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
          <div className="bg-primary-600 dark:bg-primary-700 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Users size={28} />
              {t.formTitle}
            </h2>
            <p className="text-primary-100 mt-2 text-sm">{t.formDesc}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <User size={16} /> {t.fields.fullName}
              </label>
              <input 
                type="text" 
                required
                maxLength={50}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition`}
                placeholder={lang === 'en' ? "e.g. Mahmoud Ahmed" : "مثال: محمود أحمد"}
              />
              {errors.fullName && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.fullName}</p>}
            </div>

            {/* Phone & WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone size={16} /> {t.fields.phone}
                </label>
                <input 
                  type="tel" 
                  required
                  dir="ltr"
                  maxLength={15}
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d+\-\s]/g, '');
                    setFormData({...formData, phone: val})
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                  placeholder="059xxxxxxx"
                />
                {errors.phone && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MessageCircle size={16} /> {t.fields.whatsapp}
                </label>
                <input 
                  type="tel" 
                  required
                  dir="ltr"
                  maxLength={15}
                  value={formData.whatsapp}
                  onChange={(e) => {
                     const val = e.target.value.replace(/[^\d+\-\s]/g, '');
                     setFormData({...formData, whatsapp: val})
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.whatsapp ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                  placeholder="0097059xxxxxxx"
                />
                {errors.whatsapp && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.whatsapp}</p>}
              </div>
            </div>

            {/* Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Family Members */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Users size={16} /> {t.fields.familyCount}
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="50"
                  required
                  value={formData.familyMembers}
                  onChange={(e) => setFormData({...formData, familyMembers: Math.max(1, parseInt(e.target.value) || 0)})}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.familyMembers ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition`}
                />
                {errors.familyMembers && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.familyMembers}</p>}
              </div>

              {/* Current Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin size={16} /> {t.fields.currentLoc}
                </label>
                <select 
                  required
                  value={formData.currentLocation}
                  onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.currentLocation ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition`}
                >
                  <option value="" disabled>{lang === 'en' ? 'Select Location' : 'اختر الموقع'}</option>
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {errors.currentLocation && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.currentLocation}</p>}
              </div>
            </div>

            {/* Original Address */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Home size={16} /> {t.fields.origAddress}
              </label>
              <textarea 
                required
                rows={3}
                maxLength={200}
                value={formData.originalAddress}
                onChange={(e) => setFormData({...formData, originalAddress: e.target.value})}
                className={`w-full px-4 py-3 rounded-lg border ${errors.originalAddress ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none`}
                placeholder={lang === 'en' ? "Street name, Building number..." : "اسم الشارع، رقم المنزل..."}
              ></textarea>
              {errors.originalAddress && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.originalAddress}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span>{t.fields.sending}</span>
              ) : (
                <>
                  <span>{t.fields.submit}</span>
                  <Send size={18} />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};
