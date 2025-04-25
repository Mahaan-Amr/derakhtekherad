import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import MainLayout from '@/app/components/layouts/MainLayout';
import ImageWithFallback from '@/app/components/ui/ImageWithFallback';
import { generateSeoMetadata, generateOrganizationSchema } from '@/app/lib/seo';
import JsonLd from '@/app/components/seo/JsonLd';
import { getFooterData } from '@/app/lib/footer';

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
            <h1 className="text-3xl font-bold mb-6 text-center">
              {locale === 'de' ? 'Über' : 'درباره ما'}
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8 mb-10">
              <div className="md:w-1/2">
                <ImageWithFallback
                  src="/images/about-image-1.jpg"
                  alt={locale === 'de' ? 'Über Derakhte Kherad' : 'درباره درخت خرد'}
                  className="rounded-lg shadow-md w-full h-auto"
                  fallbackSrc="/images/placeholder.jpg"
                  width={600}
                  height={400}
                  priority // Mark as priority for better loading performance
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold mb-4">
                  {locale === 'de' ? 'Unsere Geschichte' : 'داستان ما'}
                </h2>
                <p className="mb-4">
                  {locale === 'de' 
                    ? 'Derakhte Kherad wurde 2015 mit der Vision gegründet, eine Brücke zwischen persischer und deutscher Kultur zu schaffen. Wir haben uns von einem kleinen Sprachzentrum zu einer renommierten Institution entwickelt.'
                    : 'درخت خرد در سال 2015 با چشم‌انداز ایجاد پلی بین فرهنگ ایرانی و آلمانی تأسیس شد. ما از یک مرکز کوچک زبان به یک مؤسسه معتبر تبدیل شده‌ایم.'}
                </p>
                <p>
                  {locale === 'de'
                    ? 'Unsere Lehrer bringen umfangreiche Erfahrung und Leidenschaft für Sprachen mit. Wir glauben, dass das Erlernen einer Sprache mehr als nur Grammatikregeln ist - es geht um das Eintauchen in eine neue Welt.'
                    : 'معلمان ما تجربه و اشتیاق فراوانی برای زبان‌ها به ارمغان می‌آورند. ما بر این باوریم که یادگیری یک زبان بیش از قوانین دستوری است - در مورد غوطه‌ور شدن در دنیای جدید است.'}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                {locale === 'de' ? 'Unsere Mission' : 'ماموریت ما'}
              </h2>
              <p className="text-center max-w-3xl mx-auto">
                {locale === 'de'
                  ? 'Wir bei Derakhte Kherad glauben, dass Sprache der Schlüssel zum interkulturellen Verständnis ist. Unsere Mission ist es, qualitativ hochwertige Sprachkurse anzubieten, die sowohl sprachliche Fähigkeiten als auch kulturelles Wissen vermitteln.'
                  : 'ما در درخت خرد بر این باوریم که زبان کلید درک بین فرهنگی است. ماموریت ما ارائه دوره‌های زبان با کیفیت بالا است که هم مهارت‌های زبانی و هم دانش فرهنگی را منتقل می‌کند.'}
              </p>
            </div>
            
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {locale === 'de' ? 'Unsere Werte' : 'ارزش‌های ما'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    {locale === 'de' ? 'Qualität' : 'کیفیت'}
                  </h3>
                  <p>
                    {locale === 'de'
                      ? 'Wir streben nach Exzellenz in allen Aspekten unserer Arbeit und verpflichten uns, die höchsten Standards in der Sprachbildung zu erfüllen.'
                      : 'ما به دنبال برتری در تمام جنبه‌های کار خود هستیم و متعهد می‌شویم که بالاترین استانداردها را در آموزش زبان برآورده کنیم.'}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    {locale === 'de' ? 'Innovation' : 'نوآوری'}
                  </h3>
                  <p>
                    {locale === 'de'
                      ? 'Wir entwickeln ständig neue Lehrmethoden und integrieren moderne Technologien, um das Lernerlebnis zu verbessern.'
                      : 'ما دائماً روش‌های آموزشی جدید را توسعه می‌دهیم و فناوری‌های مدرن را ادغام می‌کنیم تا تجربه یادگیری را بهبود بخشیم.'}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    {locale === 'de' ? 'Inklusion' : 'شمول'}
                  </h3>
                  <p>
                    {locale === 'de'
                      ? 'Wir schaffen eine einladende Umgebung für Lernende aller Hintergründe und fördern eine vielfältige und integrative Gemeinschaft.'
                      : 'ما محیطی دعوت‌کننده برای یادگیرندگان از همه پیشینه‌ها ایجاد می‌کنیم و جامعه‌ای متنوع و فراگیر را ترویج می‌دهیم.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
} 