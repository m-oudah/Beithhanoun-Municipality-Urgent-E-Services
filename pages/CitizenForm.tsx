import React, { useState } from 'react';
import { User, Phone, Users, MapPin, Send, Home, MessageCircle, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, LOCATIONS, EVACUATION_TYPES, EVACUATION_STATES } from '../constants';
import { ApiService } from '../services/api';
import { validateName, validatePhone, sanitizeInput } from '../utils/validation';

interface CitizenFormProps {
  lang: Language;
}

export const CitizenForm: React.FC<CitizenFormProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const ArrowNext = isRTL ? ArrowLeft : ArrowRight;
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    idNumber: '',
    phone: '',
    whatsapp: '',
    
    // Step 2
    originalArea: '',
    originalStreet: '',
    originalAddressDetails: '',
    currentEvacuationState: '',
    evacuationType: '',

    // Step 3
    wifeName: '',
    wifeIdNumber: '',
    familyMembers: 1,
    males: 0,
    females: 0,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!validateName(formData.fullName)) newErrors.fullName = t.validation.nameTooShort;
    if (formData.idNumber.length !== 9) newErrors.idNumber = t.validation.invalidID;
    if (!validatePhone(formData.phone)) newErrors.phone = t.validation.invalidPhone;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.originalArea) newErrors.originalArea = t.validation.required;
    if (!formData.originalStreet) newErrors.originalStreet = t.validation.required;
    if (!formData.currentEvacuationState) newErrors.currentEvacuationState = t.validation.required;
    if (!formData.evacuationType) newErrors.evacuationType = t.validation.required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!validateName(formData.wifeName)) newErrors.wifeName = t.validation.required;
    if (formData.wifeIdNumber.length !== 9) newErrors.wifeIdNumber = t.validation.invalidID;
    if (formData.familyMembers < 1) newErrors.familyMembers = t.validation.required;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const sanitizedData = Object.keys(formData).reduce((acc, key) => {
        const val = formData[key as keyof typeof formData];
        return {
          ...acc,
          [key]: typeof val === 'string' ? sanitizeInput(val) : val
        };
      }, {} as typeof formData);

      await ApiService.submitCitizenData(sanitizedData);
      setSuccess(true);
      setStep(1);
      setFormData({
        fullName: '', idNumber: '', phone: '', whatsapp: '',
        originalArea: '', originalStreet: '', originalAddressDetails: '', currentEvacuationState: '', evacuationType: '',
        wifeName: '', wifeIdNumber: '', familyMembers: 1, males: 0, females: 0, notes: ''
      });
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
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between relative z-10">
                {[1, 2, 3].map(s => (
                    <div key={s} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                            step >= s ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}>
                            {s}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>
                            {t.steps[s as 1|2|3]}
                        </span>
                    </div>
                ))}
            </div>
            <div className="absolute top-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-0 hidden"></div> 
            {/* Visual progress bar connecting dots could be added here */}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors border-t-4 border-primary-600">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-b border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800 dark:text-white">
              <Users size={28} className="text-primary-600" />
              {t.formTitle}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{t.formDesc}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
            
            {/* STEP 1: CITIZEN INFO */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <User size={16} /> {t.fields.fullName} <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition`}
                        />
                        {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <CheckCircle2 size={16} /> {t.fields.idNumber} <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            required
                            maxLength={9}
                            value={formData.idNumber}
                            onChange={(e) => setFormData({...formData, idNumber: e.target.value.replace(/\D/g, '')})}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.idNumber ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition`}
                        />
                         {errors.idNumber && <p className="text-red-500 text-xs">{errors.idNumber}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Phone size={16} /> {t.fields.phone} <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="tel" 
                                required
                                dir="ltr"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/[^\d+\-\s]/g, '')})}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition ${isRTL ? 'text-right' : 'text-left'}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <MessageCircle size={16} /> {t.fields.whatsapp}
                            </label>
                            <input 
                                type="tel" 
                                dir="ltr"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({...formData, whatsapp: e.target.value.replace(/[^\d+\-\s]/g, '')})}
                                className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition ${isRTL ? 'text-right' : 'text-left'}`}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: STAY PLACE */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <MapPin size={16} /> {t.fields.originalArea} <span className="text-red-500">*</span>
                            </label>
                            <select 
                                required
                                value={formData.originalArea}
                                onChange={(e) => setFormData({...formData, originalArea: e.target.value})}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.originalArea ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition`}
                            >
                                <option value="" disabled>{isRTL ? 'اختر المنطقة' : 'Select Area'}</option>
                                {LOCATIONS.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            {errors.originalArea && <p className="text-red-500 text-xs">{errors.originalArea}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Home size={16} /> {t.fields.originalStreet} <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                required 
                                value={formData.originalStreet}
                                onChange={(e) => setFormData({...formData, originalStreet: e.target.value})}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.originalStreet ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition`}
                            />
                             {errors.originalStreet && <p className="text-red-500 text-xs">{errors.originalStreet}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            {t.fields.originalAddressDetails}
                        </label>
                        <textarea 
                            rows={2}
                            value={formData.originalAddressDetails}
                            onChange={(e) => setFormData({...formData, originalAddressDetails: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition resize-none"
                        ></textarea>
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-slate-700 my-2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                {t.fields.currentEvacuationState} <span className="text-red-500">*</span>
                            </label>
                            <select 
                                required
                                value={formData.currentEvacuationState}
                                onChange={(e) => setFormData({...formData, currentEvacuationState: e.target.value})}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.currentEvacuationState ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition`}
                            >
                                <option value="" disabled>{isRTL ? 'اختر المحافظة' : 'Select Governorate'}</option>
                                {EVACUATION_STATES.map(st => (
                                    <option key={st.id} value={st.id}>{isRTL ? st.ar : st.en}</option>
                                ))}
                            </select>
                            {errors.currentEvacuationState && <p className="text-red-500 text-xs">{errors.currentEvacuationState}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                {t.fields.evacuationType} <span className="text-red-500">*</span>
                            </label>
                            <select 
                                required
                                value={formData.evacuationType}
                                onChange={(e) => setFormData({...formData, evacuationType: e.target.value})}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.evacuationType ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition`}
                            >
                                <option value="" disabled>{isRTL ? 'اختر نوع النزوح' : 'Select Type'}</option>
                                {EVACUATION_TYPES.map(type => (
                                    <option key={type.id} value={type.id}>{isRTL ? type.ar : type.en}</option>
                                ))}
                            </select>
                            {errors.evacuationType && <p className="text-red-500 text-xs">{errors.evacuationType}</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: FAMILY INFO */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                {t.fields.wifeName} <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                required 
                                value={formData.wifeName}
                                onChange={(e) => setFormData({...formData, wifeName: e.target.value})}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.wifeName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition`}
                            />
                            {errors.wifeName && <p className="text-red-500 text-xs">{errors.wifeName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                {t.fields.wifeIdNumber} <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                maxLength={9}
                                required 
                                value={formData.wifeIdNumber}
                                onChange={(e) => setFormData({...formData, wifeIdNumber: e.target.value.replace(/\D/g, '')})}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.wifeIdNumber ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition`}
                            />
                             {errors.wifeIdNumber && <p className="text-red-500 text-xs">{errors.wifeIdNumber}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {t.fields.familyCount} <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number"
                                min="1"
                                required 
                                value={formData.familyMembers}
                                onChange={(e) => setFormData({...formData, familyMembers: parseInt(e.target.value) || 0})}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.familyMembers ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition`}
                            />
                             {errors.familyMembers && <p className="text-red-500 text-xs">{errors.familyMembers}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.fields.males}</label>
                            <input 
                                type="number"
                                min="0" 
                                value={formData.males}
                                onChange={(e) => setFormData({...formData, males: parseInt(e.target.value) || 0})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.fields.females}</label>
                            <input 
                                type="number"
                                min="0" 
                                value={formData.females}
                                onChange={(e) => setFormData({...formData, females: parseInt(e.target.value) || 0})}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t.fields.notes}
                        </label>
                        <textarea 
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition resize-none"
                        ></textarea>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
                {step > 1 ? (
                    <button 
                        type="button" 
                        onClick={handleBack}
                        className="px-6 py-3 rounded-lg font-bold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition flex items-center gap-2"
                    >
                        <ArrowBack size={18} />
                        {t.fields.back}
                    </button>
                ) : (
                    <div></div>
                )}

                {step < 3 ? (
                    <button 
                        type="button" 
                        onClick={handleNext}
                        className="px-8 py-3 rounded-lg font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg flex items-center gap-2 transition"
                    >
                        {t.fields.next}
                        <ArrowNext size={18} />
                    </button>
                ) : (
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg flex items-center gap-2 transition ${
                            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-xl'
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
                )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};