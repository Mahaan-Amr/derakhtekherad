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
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden text-white" style={{
        background: `linear-gradient(to bottom right, var(--color-primary-dark), var(--color-primary))`
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className={`container mx-auto px-4 py-24 relative z-10 ${isRtl ? 'rtl' : 'ltr'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {translations.charters.pageTitle}
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              {translations.charters.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Charters Content Section */}
      <div className={`bg-gray-50 dark:bg-gray-900 py-16 ${isRtl ? 'rtl' : 'ltr'}`}>
        <div className="container mx-auto px-4">
          <ChartersList locale={locale} />
        </div>
      </div>
    </MainLayout>
  );
} 