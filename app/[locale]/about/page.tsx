import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import MainLayout from '@/app/components/layouts/MainLayout';
import { generateSeoMetadata, generateOrganizationSchema } from '@/app/lib/seo';
import JsonLd from '@/app/components/seo/JsonLd';
import { getFooterData } from '@/app/lib/footer';
import AboutPageContent from '@/app/components/about/AboutPageContent';

export const generateMetadata = async ({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> => {
  const { locale } = await params;
  
  return generateSeoMetadata({
    title: {
      de: 'Über',
      fa: 'درباره ما'
    },
    description: {
      de: 'Erfahren Sie mehr über Derakhte Kherad, unsere Geschichte, Werte und Mission als führendes Institut für das Erlernen der deutschen Sprache in Shiraz.',
      fa: 'درباره درخت خرد، تاریخچه، ارزش‌ها و ماموریت ما به عنوان یک موسسه پیشرو در آموزش زبان آلمانی در شیراز بیشتر بدانید.'
    },
    path: 'about',
    image: {
      url: '/images/about-image-1.jpg',
      alt: {
        de: 'Das Team von Derakhte Kherad',
        fa: 'تیم درخت خرد'
      }
    },
    keywords: {
      de: ['Über', 'Derakhte Kherad Geschichte', 'Deutsche Sprachschule', 'Deutsches Institut Iran', 'Deutschunterricht Shiraz'],
      fa: ['درباره ما', 'تاریخچه درخت خرد', 'مدرسه زبان آلمانی', 'موسسه آلمانی ایران', 'آموزش آلمانی شیراز']
    }
  }, locale as Locale);
};

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
  // Determine RTL direction based on locale
  const isRtl = locale === 'fa';
  
  // Define navigation items
  const navItems = {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
    blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    about: locale === 'de' ? 'Über' : 'درباره ما',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
  };
  
  // Get footer data using the utility function
  const footer = getFooterData(locale as Locale, navItems);
  
  // Generate structured data schema
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <JsonLd data={organizationSchema} />
      <MainLayout locale={locale as Locale} navItems={navItems} footer={footer}>
        <div className={`${isRtl ? 'rtl' : 'ltr'}`}>
          {/* About page content */}
          <div className="container mx-auto py-10 px-4">
            <AboutPageContent locale={locale as Locale} />
          </div>
        </div>
      </MainLayout>
    </>
  );
} 