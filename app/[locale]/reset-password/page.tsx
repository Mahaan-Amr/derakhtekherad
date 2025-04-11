'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/app/components/layouts/MainLayout';
import ResetPasswordForm from '@/app/components/auth/ResetPasswordForm';
import { Locale } from '@/app/i18n/settings';

// This component handles client-side token extraction and rendering
function ResetPasswordClient({ 
  locale,
  token
}: { 
  locale: Locale, 
  token: string | null 
}) {
  const isRtl = locale === 'fa';

  // Define translations for the reset password form
  const resetPasswordTranslations = {
    title: locale === 'de' ? 'Passwort zurücksetzen' : 'بازنشانی رمز عبور',
    subtitle: locale === 'de' 
      ? 'Erstellen Sie ein neues Passwort für Ihr Konto' 
      : 'رمز عبور جدیدی برای حساب کاربری خود ایجاد کنید',
    noToken: locale === 'de'
      ? 'Ungültiger oder fehlender Reset-Token. Bitte fordern Sie einen neuen Link zum Zurücksetzen des Passworts an.'
      : 'توکن بازنشانی نامعتبر یا گم شده است. لطفا یک لینک بازنشانی رمز عبور جدید درخواست کنید.',
    backToLogin: locale === 'de'
      ? 'Zurück zur Anmeldeseite'
      : 'بازگشت به صفحه ورود'
  };
  
  // Define nav items for layout
  const navItems = {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    about: locale === 'de' ? 'Über uns' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
    blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    login: locale === 'de' ? 'Anmelden' : 'ورود',
  };
  
  // Define footer props
  const footer = {
    about: {
      title: locale === 'de' ? 'Über uns' : 'درباره ما',
      description: locale === 'de' 
        ? 'Derakhte Kherad ist ein Sprachinstitut, das sich auf das Unterrichten von Persisch und Deutsch spezialisiert hat.'
        : 'درخت خرد موسسه آموزش زبان است که در زمینه آموزش زبان‌های فارسی و آلمانی تخصص دارد.'
    },
    quickLinks: {
      title: locale === 'de' ? 'Schnelle Links' : 'لینک‌های سریع',
      links: [
        { title: locale === 'de' ? 'Startseite' : 'خانه', href: `/${locale}` },
        { title: locale === 'de' ? 'Kurse' : 'دوره‌ها', href: `/${locale}/courses` },
        { title: locale === 'de' ? 'Blog' : 'وبلاگ', href: `/${locale}/blog` }
      ]
    },
    contact: {
      title: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      address: locale === 'de' ? 'Shiraz, Iran' : 'شیراز، ایران',
      email: 'info@derakhtekherad.com',
      phone: locale === 'de' ? '+98 71 1234 5678' : '۵۶۷۸ ۱۲۳۴ ۷۱ ۹۸+'
    }
  };

  return (
    <MainLayout locale={locale} navItems={navItems} footer={footer}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          <h1 className={`text-3xl font-bold mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
            {resetPasswordTranslations.title}
          </h1>
          <p className={`text-gray-600 mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
            {resetPasswordTranslations.subtitle}
          </p>

          {token ? (
            <ResetPasswordForm 
              locale={locale} 
              token={token} 
            />
          ) : (
            <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              <p className="text-yellow-700">
                {resetPasswordTranslations.noToken}
              </p>
              <a 
                href={`/${locale}/home`}
                className="mt-4 inline-block text-primary hover:text-primary-dark font-medium"
              >
                {resetPasswordTranslations.backToLogin}
              </a>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// This is the page component that awaits the params and renders the client component
export default async function ResetPasswordPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  return (
    <ResetPasswordClientWrapper locale={locale as Locale} />
  );
}

// This wrapper handles the search params
function ResetPasswordClientWrapper({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  return <ResetPasswordClient locale={locale} token={token} />;
} 