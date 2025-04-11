'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Locale } from '@/app/i18n/settings';
import Header from '../header/Header';
import Footer from '../common/Footer';
import FloatingContactButton from '../common/FloatingContactButton';

interface NavItem {
  title: string;
  href: string;
}

interface FooterProps {
  about: {
    title: string;
    description: string;
  };
  quickLinks: {
    title: string;
    links: {
      title: string;
      href: string;
    }[];
  };
  contact: {
    title: string;
    address: string;
    email: string;
    phone: string;
  };
}

interface MainLayoutProps {
  children: ReactNode;
  locale: Locale;
  navItems?: {
    home?: string;
    about?: string;
    courses?: string;
    blog?: string;
    contact?: string;
    consultation?: string;
    login?: string;
    signup?: string;
    charters?: string;
  };
  footer?: FooterProps;
}

export default function MainLayout({ children, locale, navItems = {}, footer }: MainLayoutProps) {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  // Add the missing isOpen state for dropdown
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize theme once component mounts
  useEffect(() => {
    // Check if user has previously set a theme preference
    const savedDarkMode = localStorage.getItem('theme');
    const savedColorTheme = localStorage.getItem('colorTheme') || 'default';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize dark mode
    if (savedDarkMode === 'dark' || (!savedDarkMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Initialize color theme
    document.documentElement.classList.remove(
      'theme-default', 'theme-emerald', 'theme-rose', 'theme-blue', 'theme-amber',
      'theme-ocean', 'theme-forest', 'theme-olive', 'theme-sunset', 'theme-midnight'
    );
    document.documentElement.classList.add(`theme-${savedColorTheme}`);
  }, []);
  
  // Handle theme toggle
  const toggleDarkMode = () => {
    if (darkMode) {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Toggle dropdown function
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Navigation translations for Header
  const navigationTranslations = {
    home: navItems?.home || (locale === 'de' ? 'Startseite' : 'صفحه اصلی'),
    about: navItems?.about || (locale === 'de' ? 'Über Uns' : 'درباره ما'),
    courses: navItems?.courses || (locale === 'de' ? 'Kurse' : 'دوره‌ها'),
    teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
    blog: navItems?.blog || (locale === 'de' ? 'Blog' : 'وبلاگ'),
    contact: navItems?.contact || (locale === 'de' ? 'Kontakt' : 'تماس با ما'),
    charters: navItems?.charters || (locale === 'de' ? 'Grundsätze' : 'منشورها'),
    consultation: navItems?.consultation || (locale === 'de' ? 'Beratung' : 'مشاوره'),
    login: navItems?.login || (locale === 'de' ? 'Anmelden' : 'ورود'),
    signup: navItems?.signup || (locale === 'de' ? 'Registrieren' : 'ثبت نام'),
    darkMode: locale === 'de' ? 'Dunkelmodus' : 'حالت تاریک',
    lightMode: locale === 'de' ? 'Hellmodus' : 'حالت روشن'
  };
  
  // Footer translations
  const footerTranslations = {
    address: locale === 'de' ? 'Adresse' : 'آدرس',
    phone: locale === 'de' ? 'Telefon' : 'تلفن',
    email: locale === 'de' ? 'E-Mail' : 'ایمیل',
    rights: locale === 'de' ? 'Alle Rechte vorbehalten' : 'تمامی حقوق محفوظ است'
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Header 
        locale={locale} 
        translations={navigationTranslations}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer 
        locale={locale} 
        translations={footerTranslations}
        about={footer?.about || { title: '', description: '' }}
        quickLinks={footer?.quickLinks || { title: '', links: [] }}
        contact={footer?.contact || { title: '', address: '', email: '', phone: '' }}
      />
      <FloatingContactButton 
        locale={locale}
        translations={{
          whatsapp: locale === 'de' ? 'WhatsApp' : 'واتساپ',
          call: locale === 'de' ? 'Anruf' : 'تماس',
          email: locale === 'de' ? 'Email' : 'ایمیل'
        }}
      />
    </div>
  );
} 