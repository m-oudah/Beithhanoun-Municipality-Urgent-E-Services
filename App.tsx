
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CitizenForm } from './pages/CitizenForm';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { Advertisements } from './pages/Advertisements';
import { ReliefOrganizations } from './pages/ReliefOrganizations';
import { War2023 } from './pages/War2023';
import { Language } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('ar'); // Default to Arabic
  const [currentPage, setPage] = useState('home');

  // Handle HTML dir attribute on language change
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Ensure dark mode class is removed if it exists from previous state
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home lang={lang} setPage={setPage} />;
      case 'ads': return <Advertisements lang={lang} />;
      case 'register': return <CitizenForm lang={lang} />;
      case 'relief': return <ReliefOrganizations lang={lang} />;
      case 'war2023': return <War2023 lang={lang} />;
      case 'contact': return <Contact lang={lang} />;
      case 'admin': return <AdminDashboard lang={lang} />;
      default: return <Home lang={lang} setPage={setPage} />;
    }
  };

  return (
    <Layout 
      lang={lang} 
      setLang={setLang} 
      currentPage={currentPage} 
      setPage={setPage}
    >
      {renderPage()}
    </Layout>
  );
}
