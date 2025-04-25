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
        ? 'Derakhte Kherad ist ein Institut für persische Sprache und Kultur mit Sitz in Shiraz, Iran.' 
        : 'درخت خرد یک موسسه آموزش زبان و فرهنگ فارسی در شیراز، ایران است.'
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
      address: locale === 'de' ? 'Kohye Vahdat, Gasse gegenüber dem Negin Parkplatz (Fereshteh 2), neben dem Yara Supermarkt' : 'کوی وحدت، کوچه روبروی پارکینگ نگین(فرشته 2)، جنب سوپر مارکت یارا',
      email: 'info@derakhtekherad.com',
      phone: locale === 'de' ? 'Festnetz: 071-36386652 | Mobil: 0936-0217684' : 'تلفن ثابت: ۰۷۱۳۶۳۸۶۶۵۲ | موبایل: ۰۹۳۶۰۲۱۷۶۸۴'
    }
  };
} 