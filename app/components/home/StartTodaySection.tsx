'use client';

import { Locale } from '@/app/i18n/settings';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';

interface StartTodaySectionProps {
  locale: Locale;
}

export default function StartTodaySection({ locale }: StartTodaySectionProps) {
  const isRtl = locale === 'fa';
  
  const translations = {
    title: locale === 'de' ? 'Sind Sie bereit anzufangen?' : 'آماده شروع هستید؟',
    subtitle: locale === 'de' 
      ? 'Kontaktieren Sie uns noch heute'
      : 'همین امروز با ما تماس بگیرید',
    button: locale === 'de' ? 'Beratung anfordern' : 'درخواست مشاوره'
  };
  
  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className={`text-4xl font-bold mb-4 ${isRtl ? 'rtl' : 'ltr'}`}>{translations.title}</h2>
        <p className={`text-xl mb-8 ${isRtl ? 'rtl' : 'ltr'}`}>{translations.subtitle}</p>
        <Link href={`/${locale}/consultation`} passHref>
          <Button variant="default" size="lg" className="bg-white text-primary hover:bg-gray-100 dark:bg-gray-100">
            {translations.button}
          </Button>
        </Link>
      </div>
    </section>
  );
} 