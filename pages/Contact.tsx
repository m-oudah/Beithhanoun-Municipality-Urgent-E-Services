import React, { useState } from 'react';
import { Mail, Send, User, MessageCircle, AlertCircle, Phone, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { ApiService } from '../services/api';
import { validateEmail, validatePhone, validateName, sanitizeInput } from '../utils/validation';

interface ContactProps {
  lang: Language;
}

export const Contact: React.FC<ContactProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.name)) {
      newErrors.name = t.validation.nameTooShort;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = t.validation.invalidEmail;
    }
    if (!validatePhone(formData.whatsapp)) {
      newErrors.whatsapp = t.validation.invalidPhone;
    }
    if (!formData.subject.trim()) {
      newErrors.subject = t.validation.required;
    }
    if (!formData.message.trim()) {
      newErrors.message = t.validation.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    // Sanitize before sending
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      whatsapp: sanitizeInput(formData.whatsapp),
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message),
    };

    // Simulate API logic
    await ApiService.sendContactMessage(sanitizedData);

    // Open Mail Client as fallback
    const mailtoLink = `mailto:info@beithanoun.ps?subject=${encodeURIComponent(sanitizedData.subject)}&body=${encodeURIComponent(`Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nWhatsApp: ${sanitizedData.whatsapp}\n\n${sanitizedData.message}`)}`;
    window.location.href = mailtoLink;
    
    setLoading(false);
    setFormData({ name: '', email: '', whatsapp: '', subject: '', message: '' });
    setErrors({});
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Info Sidebar (Right Side in Arabic) */}
        <div className="md:col-span-1 space-y-6 order-last md:order-none">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-t-4 border-secondary-600 transition-colors">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{t.contactForm.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{t.contactForm.desc}</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                <Mail className="text-primary-600 dark:text-primary-400" size={20} />
                <span className="text-sm font-medium">info@beithanoun.ps</span>
              </div>
            </div>
          </div>

          {/* Emergency Contacts Section */}
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-lg border border-red-100 dark:border-red-900 transition-colors">
            <h3 className="text-lg font-bold mb-4 text-red-700 dark:text-red-400 flex items-center gap-2">
                <ShieldAlert size={20} />
                {t.contactForm.emergencyContacts}
            </h3>
            <ul className="space-y-3">
                {t.contactForm.contacts.map((contact, index) => (
                    <li key={index} className="flex justify-between items-center border-b border-red-200 dark:border-red-800 pb-2 last:border-0 last:pb-0">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{contact.label}</span>
                        <a href={`tel:${contact.number}`} className="text-lg font-bold text-red-600 dark:text-red-400 font-mono hover:underline">
                            {contact.number}
                        </a>
                    </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* Name & Email Row (Valid Email Top Left in Arabic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.contactForm.name} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User size={18} className={`absolute top-3 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
                  <input 
                    type="text" 
                    required
                    maxLength={50}
                    value={formData.name}
                    onChange={e => {
                        // Prevent numbers and special characters active filtering
                        const val = e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
                        setFormData({...formData, name: val});
                    }}
                    className={`w-full py-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition ${lang === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.contactForm.email} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail size={18} className={`absolute top-3 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
                  <input 
                    type="email" 
                    required
                    maxLength={80}
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className={`w-full py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition ${lang === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.contactForm.whatsapp}</label>
              <div className="relative">
                <MessageCircle size={18} className={`absolute top-3 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
                <input 
                  type="tel" 
                  required
                  dir="ltr"
                  maxLength={15}
                  value={formData.whatsapp}
                  onChange={e => {
                    const val = e.target.value.replace(/[^\d+\-\s]/g, '');
                    setFormData({...formData, whatsapp: val});
                  }}
                  className={`w-full py-2.5 border ${errors.whatsapp ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition ${lang === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                  placeholder="+970..."
                />
              </div>
              {errors.whatsapp && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.whatsapp}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.contactForm.subject} <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                maxLength={100}
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className={`w-full px-4 py-2.5 border ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition`}
              />
              {errors.subject && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.subject}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.contactForm.message} <span className="text-red-500">*</span></label>
              <textarea 
                required
                rows={5}
                maxLength={500}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none transition`}
              ></textarea>
              {errors.message && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12}/>{errors.message}</p>}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
            >
              {loading ? t.fields.sending : (
                <>
                  <Send size={18} />
                  <span>{t.contactForm.send}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
