'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/app/i18n/settings';
import ImageWithFallback from '@/app/components/ui/ImageWithFallback';

interface AboutPageData {
  titleDe: string;
  titleFa: string;
  storyTitleDe: string;
  storyTitleFa: string;
  storyContentDe: string;
  storyContentFa: string;
  storyImage?: string;
  missionTitleDe: string;
  missionTitleFa: string;
  missionContentDe: string;
  missionContentFa: string;
  valuesTitleDe: string;
  valuesTitleFa: string;
  value1TitleDe: string;
  value1TitleFa: string;
  value1ContentDe: string;
  value1ContentFa: string;
  value2TitleDe: string;
  value2TitleFa: string;
  value2ContentDe: string;
  value2ContentFa: string;
  value3TitleDe: string;
  value3TitleFa: string;
  value3ContentDe: string;
  value3ContentFa: string;
}

interface AboutPageContentProps {
  locale: Locale;
}

export default function AboutPageContent({ locale }: AboutPageContentProps) {
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default static content as fallback
  const defaultContent: AboutPageData = {
    titleDe: 'Über',
    titleFa: 'درباره ما',
    storyTitleDe: 'Unsere Geschichte',
    storyTitleFa: 'داستان ما',
    storyContentDe: 'Derakhte Kherad wurde 2015 mit der Vision gegründet, eine Brücke zwischen persischer und deutscher Kultur zu schaffen. Wir haben uns von einem kleinen Sprachzentrum zu einer renommierten Institution entwickelt.\n\nUnsere Lehrer bringen umfangreiche Erfahrung und Leidenschaft für Sprachen mit. Wir glauben, dass das Erlernen einer Sprache mehr als nur Grammatikregeln ist - es geht um das Eintauchen in eine neue Welt.',
    storyContentFa: 'درخت خرد در سال 2015 با چشم‌انداز ایجاد پلی بین فرهنگ ایرانی و آلمانی تأسیس شد. ما از یک مرکز کوچک زبان به یک مؤسسه معتبر تبدیل شده‌ایم.\n\nمعلمان ما تجربه و اشتیاق فراوانی برای زبان‌ها به ارمغان می‌آورند. ما بر این باوریم که یادگیری یک زبان بیش از قوانین دستوری است - در مورد غوطه‌ور شدن در دنیای جدید است.',
    storyImage: '/images/about-image-1.jpg',
    missionTitleDe: 'Unsere Mission',
    missionTitleFa: 'ماموریت ما',
    missionContentDe: 'Wir bei Derakhte Kherad glauben, dass Sprache der Schlüssel zum interkulturellen Verständnis ist. Unsere Mission ist es, qualitativ hochwertige Sprachkurse anzubieten, die sowohl sprachliche Fähigkeiten als auch kulturelles Wissen vermitteln.',
    missionContentFa: 'ما در درخت خرد بر این باوریم که زبان کلید درک بین فرهنگی است. ماموریت ما ارائه دوره‌های زبان با کیفیت بالا است که هم مهارت‌های زبانی و هم دانش فرهنگی را منتقل می‌کند.',
    valuesTitleDe: 'Unsere Werte',
    valuesTitleFa: 'ارزش‌های ما',
    value1TitleDe: 'Qualität',
    value1TitleFa: 'کیفیت',
    value1ContentDe: 'Wir streben nach Exzellenz in allen Aspekten unserer Arbeit und verpflichten uns, die höchsten Standards in der Sprachbildung zu erfüllen.',
    value1ContentFa: 'ما به دنبال برتری در تمام جنبه‌های کار خود هستیم و متعهد می‌شویم که بالاترین استانداردها را در آموزش زبان برآورده کنیم.',
    value2TitleDe: 'Innovation',
    value2TitleFa: 'نوآوری',
    value2ContentDe: 'Wir entwickeln ständig neue Lehrmethoden und integrieren moderne Technologien, um das Lernerlebnis zu verbessern.',
    value2ContentFa: 'ما دائماً روش‌های آموزشی جدید را توسعه می‌دهیم و فناوری‌های مدرن را ادغام می‌کنیم تا تجربه یادگیری را بهبود بخشیم.',
    value3TitleDe: 'Inklusion',
    value3TitleFa: 'شمول',
    value3ContentDe: 'Wir schaffen eine einladende Umgebung für Lernende aller Hintergründe und fördern eine vielfältige und integrative Gemeinschaft.',
    value3ContentFa: 'ما محیطی دعوت‌کننده برای یادگیرندگان از همه پیشینه‌ها ایجاد می‌کنیم و جامعه‌ای متنوع و فراگیر را ترویج می‌دهیم.',
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/about');

      if (!response.ok) {
        if (response.status === 404) {
          // No data found, use defaults
          setAboutData(defaultContent);
          setIsLoading(false);
          return;
        }
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setAboutData(data);
    } catch (error: any) {
      console.error('Error fetching about data:', error);
      setError(error.message);
      // Use default content on error
      setAboutData(defaultContent);
    } finally {
      setIsLoading(false);
    }
  };

  // Use the fetched data or fallback to default content
  const content = aboutData || defaultContent;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">
          {locale === 'de' ? 'Wird geladen...' : 'در حال بارگذاری...'}
        </span>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">
        {locale === 'de' ? content.titleDe : content.titleFa}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="md:w-1/2">
          <ImageWithFallback
            src={content.storyImage || '/images/about-image-1.jpg'}
            alt={locale === 'de' ? 'Über Derakhte Kherad' : 'درباره درخت خرد'}
            className="rounded-lg shadow-md w-full h-auto"
            fallbackSrc="/images/placeholder.jpg"
            width={600}
            height={400}
            priority
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">
            {locale === 'de' ? content.storyTitleDe : content.storyTitleFa}
          </h2>
          <div className="space-y-4">
            {(locale === 'de' ? content.storyContentDe : content.storyContentFa)
              .split('\n\n')
              .map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {locale === 'de' ? content.missionTitleDe : content.missionTitleFa}
        </h2>
        <p className="text-center max-w-3xl mx-auto">
          {locale === 'de' ? content.missionContentDe : content.missionContentFa}
        </p>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {locale === 'de' ? content.valuesTitleDe : content.valuesTitleFa}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary">
              {locale === 'de' ? content.value1TitleDe : content.value1TitleFa}
            </h3>
            <p>
              {locale === 'de' ? content.value1ContentDe : content.value1ContentFa}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary">
              {locale === 'de' ? content.value2TitleDe : content.value2TitleFa}
            </h3>
            <p>
              {locale === 'de' ? content.value2ContentDe : content.value2ContentFa}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-primary">
              {locale === 'de' ? content.value3TitleDe : content.value3TitleFa}
            </h3>
            <p>
              {locale === 'de' ? content.value3ContentDe : content.value3ContentFa}
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 