import { Locale } from '@/app/i18n/settings';
import { Metadata } from 'next';
import MainLayout from '@/app/components/layouts/MainLayout';
import CourseList from '@/app/components/courses/CourseList';
import { generateSeoMetadata, generateOrganizationSchema } from '@/app/lib/seo';
import JsonLd from '@/app/components/seo/JsonLd';
import prisma from '@/lib/db';
import { Course } from '@/app/types/course';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generateSeoMetadata({
    title: {
      de: 'Deutschkurse',
      fa: 'دوره‌های زبان آلمانی'
    },
    description: {
      de: 'Entdecken Sie unsere umfassenden Deutschkurse für alle Niveaustufen von A1 bis C2. Lernen Sie mit qualifizierten, muttersprachlichen Lehrern in kleinen Gruppen.',
      fa: 'دوره‌های جامع زبان آلمانی ما را برای تمام سطوح از A1 تا C2 کشف کنید. با معلمان مادری‌زبان در گروه‌های کوچک زبان بیاموزید.'
    },
    path: 'courses',
    image: {
      url: '/images/courses-hero.jpg',
      alt: {
        de: 'Deutschkurse bei Derakhte Kherad',
        fa: 'دوره‌های زبان آلمانی درخت خرد'
      }
    },
    keywords: {
      de: ['Deutschkurse', 'Sprachkurse', 'Deutsch lernen', 'A1', 'B1', 'C1', 'TestDaF', 'Sprachschule'],
      fa: ['دوره‌های زبان آلمانی', 'کلاس آلمانی', 'یادگیری آلمانی', 'سطح A1', 'سطح B1', 'سطح C1', 'آزمون TestDaF']
    }
  }, locale as Locale);
}

export default async function CoursesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
  // Basic translations for CourseList component
  const courseTranslations = {
    title: locale === 'de' ? 'Unsere Sprachkurse' : 'دوره‌های زبان ما',
    description: locale === 'de' 
      ? 'Entdecken Sie unsere umfassenden Sprachkurse, die von erfahrenen muttersprachlichen Lehrern unterrichtet werden.'
      : 'دوره‌های جامع زبان ما را که توسط معلمان مجرب بومی تدریس می‌شوند، کشف کنید.',
    customCoursesTitle: locale === 'de' ? 'Maßgeschneiderte Kurse' : 'دوره‌های سفارشی',
    customCoursesDescription: locale === 'de' 
      ? 'Benötigen Sie einen speziellen Sprachkurs? Wir bieten auch maßgeschneiderte Kurse für Einzelpersonen oder Gruppen an.'
      : 'آیا به یک دوره زبان خاص نیاز دارید؟ ما همچنین دوره‌های سفارشی برای افراد یا گروه‌ها ارائه می‌دهیم.',
    contactUs: locale === 'de' ? 'Kontaktieren Sie uns' : 'با ما تماس بگیرید',
    noCoursesFound: locale === 'de' ? 'Keine Kurse gefunden.' : 'هیچ دوره‌ای یافت نشد.'
  };
  
  // Navigation translations
  const nav = {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    about: locale === 'de' ? 'Über uns' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره ها',
    blog: locale === 'de' ? 'Blog' : 'بلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
    login: locale === 'de' ? 'Anmelden' : 'ورود',
    signup: locale === 'de' ? 'Registrieren' : 'ثبت نام',
  };
  
  // Create footer data for the MainLayout
  const footer = {
    about: {
      title: locale === 'de' ? 'Über Derakhte Kherad' : 'درباره درخت خرد',
      description: locale === 'de' 
        ? 'Derakhte Kherad ist eine spezialisierte Sprachschule, die sich der Vermittlung der deutschen Sprache an persischsprachige Lernende widmet.'
        : 'درخت خرد یک مدرسه زبان تخصصی است که به آموزش زبان آلمانی به فارسی‌زبانان اختصاص دارد.'
    },
    quickLinks: {
      title: locale === 'de' ? 'Schnelle Links' : 'لینک‌های سریع',
      links: [
        {
          title: locale === 'de' ? 'Startseite' : 'خانه',
          href: `/${locale}`
        },
        {
          title: locale === 'de' ? 'Kurse' : 'دوره‌ها',
          href: `/${locale}/courses`
        },
        {
          title: locale === 'de' ? 'Kontakt' : 'تماس با ما',
          href: `/${locale}/contact`
        }
      ]
    },
    contact: {
      title: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      address: locale === 'de' ? 'Musterstraße 123, 12345 Berlin, Deutschland' : 'خیابان نمونه ۱۲۳، برلین، آلمان',
      email: 'info@derakhtekherad.com',
      phone: '+49 123 456789'
    }
  };
  
  // Fetch courses for structured data
  let courses: any[] = [];
  try {
    courses = await prisma.course.findMany({
      where: {
        isActive: true
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      take: 10
    });
  } catch (error) {
    console.error('Error fetching courses for structured data:', error);
  }
  
  // Generate structured data for organization
  const organizationSchema = generateOrganizationSchema();
  
  // Generate schema.org CourseList structured data
  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': courses.map((course, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Course',
        'name': locale === 'de' ? course.title : course.titleFa,
        'description': locale === 'de' ? course.description : course.descriptionFa,
        'provider': {
          '@type': 'Organization',
          'name': 'Derakhte Kherad',
          'sameAs': process.env.NEXT_PUBLIC_APP_URL
        },
        'url': `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/courses/${course.id}`,
        'startDate': course.startDate,
        'endDate': course.endDate,
        'inLanguage': 'de',
        'offers': {
          '@type': 'Offer',
          'price': course.price,
          'priceCurrency': 'IRR'
        }
      }
    }))
  };
  
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={courseListSchema} />
      <MainLayout 
        locale={locale as Locale} 
        navItems={nav} 
        footer={footer}
      >
        <CourseList 
          locale={locale as Locale}
          translations={courseTranslations}
        />
      </MainLayout>
    </>
  );
}