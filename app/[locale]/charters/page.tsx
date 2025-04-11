import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import MainLayout from '@/app/components/layouts/MainLayout';
import { generateSeoMetadata } from '@/app/lib/seo';
import { prisma } from '@/lib/prisma';
import Timeline from '@/app/components/charters/Timeline';

export const generateMetadata = async ({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> => {
  const { locale } = await params;
  
  return generateSeoMetadata({
    title: {
      de: 'Unsere Grundsätze',
      fa: 'اصول ما'
    },
    description: {
      de: 'Entdecken Sie die Grundsätze und Werte des Instituts Derakhte Kherad.',
      fa: 'اصول و ارزش‌های مؤسسه درخت خرد را کشف کنید.'
    },
    path: 'charters',
    keywords: {
      de: ['Grundsätze', 'Werte', 'Institut', 'Derakhte Kherad', 'Leitlinien'],
      fa: ['اصول', 'ارزش‌ها', 'موسسه', 'درخت خرد', 'خط مشی']
    }
  }, locale as Locale);
};

export default async function ChartersPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
  // Determine RTL direction based on locale
  const isRtl = locale === 'fa';
  
  // Fetch active charters from the database
  const charters = await prisma.charter.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      orderIndex: 'asc',
    },
  });
  
  // Define navigation items
  const navItems = {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
    blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    about: locale === 'de' ? 'Über Uns' : 'درباره ما',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
  };
  
  // Define footer data
  const footer = {
    about: {
      title: locale === 'de' ? 'Über Derakhte Kherad' : 'درباره درخت خرد',
      description: locale === 'de'
        ? 'Das Institut Derakhte Kherad ist ein führendes Zentrum für das Erlernen der deutschen Sprache.'
        : 'موسسه درخت خرد، مرکزی پیشرو در آموزش زبان آلمانی.'
    },
    quickLinks: {
      title: locale === 'de' ? 'Schnelllinks' : 'دسترسی سریع',
      links: [
        { title: locale === 'de' ? 'Kurse' : 'دوره‌ها', href: `/${locale}/courses` },
        { title: locale === 'de' ? 'Kontakt' : 'تماس با ما', href: `/${locale}/contact` },
        { title: locale === 'de' ? 'Beratung' : 'مشاوره', href: `/${locale}/consultation` }
      ]
    },
    contact: {
      title: locale === 'de' ? 'Kontaktieren Sie uns' : 'تماس با ما',
      address: locale === 'de' ? 'Berlin, Deutschland' : 'تهران، ایران',
      email: 'info@derakhtekherad.com',
      phone: '+49 XXXX XXXXXX'
    }
  };
  
  return (
    <MainLayout locale={locale as Locale} navItems={navItems} footer={footer}>
      <div className={`min-h-screen ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Hero Section with background */}
        <div className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {locale === 'de' ? 'Unsere Grundsätze' : 'اصول ما'}
              </h1>
              
              <p className="text-xl md:text-2xl leading-relaxed opacity-90 max-w-3xl mx-auto">
                {locale === 'de' 
                  ? 'Bei Derakhte Kherad folgen wir bestimmten Grundsätzen, die unsere Arbeit und unseren Bildungsansatz leiten.'
                  : 'در درخت خرد، ما از اصول خاصی پیروی می‌کنیم که کار و رویکرد آموزشی ما را هدایت می‌کنند.'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            {charters.length > 0 ? (
              <Timeline 
                items={charters.map(charter => ({
                  id: charter.id,
                  title: locale === 'de' ? charter.title : charter.titleFa,
                  content: locale === 'de' ? charter.description : charter.descriptionFa,
                  iconName: charter.iconName || undefined,
                }))} 
                isRtl={isRtl}
              />
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-5xl mb-4">📜</div>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {locale === 'de' 
                    ? 'Unsere Grundsätze werden bald verfügbar sein.' 
                    : 'اصول ما به زودی در دسترس خواهد بود.'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary-700 dark:text-primary-400">
                {locale === 'de' 
                  ? 'Möchten Sie mehr über uns erfahren?' 
                  : 'آیا می‌خواهید بیشتر درباره ما بدانید؟'}
              </h2>
              <p className="mb-8 text-gray-700 dark:text-gray-300">
                {locale === 'de' 
                  ? 'Besuchen Sie unsere Über-Uns-Seite oder kontaktieren Sie uns für weitere Informationen.' 
                  : 'از صفحه درباره ما دیدن کنید یا برای اطلاعات بیشتر با ما تماس بگیرید.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={`/${locale}/about`} 
                  className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  {locale === 'de' ? 'Über Uns' : 'درباره ما'}
                </a>
                <a 
                  href={`/${locale}/contact`} 
                  className="inline-block px-6 py-3 bg-white dark:bg-gray-800 border border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  {locale === 'de' ? 'Kontakt' : 'تماس با ما'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 