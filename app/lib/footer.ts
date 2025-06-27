import { Locale } from '../i18n/settings';

/**
 * Generates consistent footer data for use across all pages
 */
export function getFooterData(locale: Locale, navItems?: any) {
  // Default navigation items if not provided
  const nav = navItems || {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    about: locale === 'de' ? 'Über' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
    blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
  };
  
  return {
    about: {
      title: locale === 'de' ? 'Über' : 'درباره ما',
      description: locale === 'de' 
        ? 'Derakhte Kherad ist eine spezialisierte Akademie für deutsche Sprache und Kultur mit Sitz in Shiraz, Iran.' 
        : 'درخت خرد یک آکادمی آموزش تخصصی زبان و فرهنگ آلمانی در شیراز، ایران است.'
    },
    quickLinks: {
      title: locale === 'de' ? 'Schnelllinks' : 'لینک‌های سریع',
      links: [
        { title: nav.home, href: `/${locale}` },
        { title: nav.about, href: `/${locale}/about` },
        { title: nav.courses, href: `/${locale}/courses` },
        { title: nav.blog, href: `/${locale}/blog` },
        { title: nav.contact, href: `/${locale}/contact` }
      ]
    },
    contact: {
      title: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      address: locale === 'de' ? 'Kohye Vahdat, Fereshteh Straße, Fereshteh 2 Gasse' : 'کوی وحدت، خیابان فرشته، کوچه فرشته 2',
      email: 'info@derakhtekherad.com',
      phone: locale === 'de' ? 'Festnetz: 071-36386652 | Mobil: 0936-0217684' : 'تلفن ثابت: ۰۷۱۳۶۳۸۶۶۵۲ | موبایل: ۰۹۳۶۰۲۱۷۶۸۴'
    }
  };
} 