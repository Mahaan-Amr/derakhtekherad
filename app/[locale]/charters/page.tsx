import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import MainLayout from '@/app/components/layouts/MainLayout';
import ChartersList from '@/app/components/charters/ChartersList';
import { getFooterData } from '@/app/lib/footer';

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: Locale } 
}): Promise<Metadata> {
  const locale = params.locale;
  
  return {
    title: locale === 'de' ? 'Unsere Charters | Derakhte Kherad' : 'منشور ما | درخت خرد',
    description: locale === 'de' 
      ? 'Erfahren Sie mehr Überere Leitlinien und Grundsätze, die unsere Arbeit und unser Engagement für qualitativ hochwertige Sprachbildung leiten'
      : 'با اصول و ارزش‌های ما که هدایت‌کننده فعالیت‌ها و تعهد ما به آموزش زبان با کیفیت است، آشنا شوید',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/charters`,
      languages: {
        'de': `${process.env.NEXT_PUBLIC_APP_URL}/de/charters`,
        'fa': `${process.env.NEXT_PUBLIC_APP_URL}/fa/charters`
      }
    }
  };
}

export default function ChartersPage({
  params
}: {
  params: { locale: Locale };
}) {
  const locale = params.locale;
  const isRtl = locale === 'fa';
  
  // Navigation items
  const navItems = {
    home: locale === 'de' ? 'Startseite' : 'صفحه اصلی',
    about: locale === 'de' ? 'Über' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
    blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
    login: locale === 'de' ? 'Anmelden' : 'ورود',
    signup: locale === 'de' ? 'Registrieren' : 'ثبت نام'
  };
  
  // Get footer data using the utility function
  const footerData = getFooterData(locale, navItems);

  // Charters specific translations
  const translations = {
    // Navigation items
    navItems,
    // Footer data included from utility function
    footer: footerData,
    charters: {
      pageTitle: locale === 'de' ? 'Unsere Charters' : 'منشور ما',
      subtitle: locale === 'de' 
        ? 'Die Grundsätze, die unsere Arbeit leiten'
        : 'اصولی که کار ما را هدایت می‌کند',
      // ... existing charter translations ...
    }
  };

  return (
    <MainLayout 
      locale={locale} 
      navItems={translations.navItems}
      footer={translations.footer}
    >
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          {translations.charters.pageTitle}
        </h1>
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
          {translations.charters.subtitle}
        </p>
        
        <ChartersList locale={locale} />
      </div>
    </MainLayout>
  );
} 