'use client';

import { useState } from 'react';
import { Locale } from '@/app/i18n/settings';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';

interface LanguageLevelSectionProps {
  locale: Locale;
}

export default function LanguageLevelSection({ locale }: LanguageLevelSectionProps) {
  const isRtl = locale === 'fa';
  
  const translations = {
    title: locale === 'de' ? 'Bestimmen Sie Ihr Sprachniveau' : 'تعیین سطح زبان',
    subtitle: locale === 'de' 
      ? 'Optimieren Sie Ihren Lernweg mit einer standardisierten Einstufung'
      : 'با تعیین سطح استاندارد، مسیر یادگیری خود را بهینه کنید',
    description: locale === 'de'
      ? 'Das Institut Derakhte Kherad bewertet Ihr deutsches Sprachniveau nach internationalen CEFR-Standards. Dieser umfassende Test bewertet Ihre Fähigkeiten im Sprechen, Hören, Schreiben und Lesen.'
      : 'مؤسسه درخت خرد با استفاده از استانداردهای بین‌المللی CEFR، سطح فعلی زبان آلمانی شما را ارزیابی می‌کند. این آزمون جامع، مهارت‌های گفتاری، شنیداری، نوشتاری و خواندن شما را می‌سنجد.',
    features: {
      standard: locale === 'de' ? 'Standardisierter Test nach internationalen Kriterien' : 'آزمون استاندارد مطابق با معیارهای بین‌المللی',
      skills: locale === 'de' ? 'Genaue Bewertung aller vier Sprachfähigkeiten' : 'ارزیابی دقیق چهار مهارت اصلی زبان',
      feedback: locale === 'de' ? 'Detailliertes Feedback von erfahrenen Prüfern' : 'بازخورد تخصصی از اساتید مجرب',
      recommendation: locale === 'de' ? 'Kursempfehlung basierend auf Testergebnissen' : 'توصیه دوره مناسب بر اساس نتایج'
    },
    levels: {
      a1: locale === 'de' ? 'Anfänger' : 'مبتدی',
      b1: locale === 'de' ? 'Mittelstufe' : 'متوسط',
      c1: locale === 'de' ? 'Fortgeschritten' : 'پیشرفته'
    },
    bookTestButton: locale === 'de' ? 'Einstufungstest buchen' : 'رزرو آزمون تعیین سطح',
    startTodayButton: locale === 'de' ? 'Heute starten' : 'همین امروز شروع کنید!',
    specialDiscount: locale === 'de' 
      ? 'Sonderangebot: Melden Sie sich bis Ende Mai an'
      : 'تخفیف ویژه ثبت‌نام تا پایان فروردین ماه'
  };
  
  return (
    <section 
      className={`py-16 text-white ${isRtl ? 'rtl' : 'ltr'}`}
      style={{ 
        backgroundColor: 'var(--color-primary)',
        color: 'white' 
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">{translations.title}</h2>
            <p className="text-xl text-gray-100 mb-4">{translations.subtitle}</p>
            <p className="text-gray-200 mb-8">{translations.description}</p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-white mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{translations.features.standard}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-white mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{translations.features.skills}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-white mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{translations.features.feedback}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-white mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{translations.features.recommendation}</span>
              </li>
            </ul>
            
            <Link href={`/${locale}/consultation`} passHref>
              <Button variant="outline" className="bg-white text-primary border-white hover:bg-gray-100 hover:text-primary-dark">{translations.bookTestButton}</Button>
            </Link>
          </div>
          
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="rounded-lg p-10 text-center w-full max-w-md shadow-md" style={{ backgroundColor: 'var(--color-primary-dark)' }}>
              <h3 className="text-5xl font-bold mb-4">A1-C2</h3>
              <p className="text-xl uppercase mb-8">CEFR</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="rounded p-4 shadow-sm" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <h4 className="text-2xl font-bold mb-1">C1</h4>
                  <p className="text-sm">{translations.levels.c1}</p>
                </div>
                <div className="rounded p-4 shadow-sm" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <h4 className="text-2xl font-bold mb-1">B1</h4>
                  <p className="text-sm">{translations.levels.b1}</p>
                </div>
                <div className="rounded p-4 shadow-sm" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <h4 className="text-2xl font-bold mb-1">A1</h4>
                  <p className="text-sm">{translations.levels.a1}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 py-12" style={{ backgroundColor: 'var(--color-primary-dark)' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{translations.startTodayButton}</h2>
          <p className="text-xl mb-8">{translations.specialDiscount}</p>
          <Link href={`/${locale}/consultation`} passHref>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white text-primary-dark font-bold border-white hover:bg-gray-100 hover:text-primary dark:text-primary-dark"
            >
              {locale === 'de' ? 'Kostenlose Beratung' : 'مشاوره رایگان'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 