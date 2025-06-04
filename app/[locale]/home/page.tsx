import { Locale } from '@/app/i18n/settings';
import { Metadata } from 'next';
import MainLayout from '@/app/components/layouts/MainLayout';
import Button from '@/app/components/ui/Button';
import ImageWithFallback from '@/app/components/ui/ImageWithFallback';
import HeroSlider from '@/app/components/home/HeroSlider';
import { getHeroSlides } from '@/app/lib/hero';
import { getFeatureItems } from '@/app/lib/features';
import type { HeroSlide } from '@/app/lib/hero';
import prisma from '@/lib/db';
import StatisticsSection from '@/app/components/home/StatisticsSection';
import FeaturedCourses from '@/app/components/home/FeaturedCourses';
import LanguageLevelSection from '@/app/components/home/LanguageLevelSection';
import LatestBlogs from '@/app/components/home/LatestBlogs';
import StartTodaySection from '@/app/components/home/StartTodaySection';
import { getLatestBlogPosts } from '@/app/lib/blog';
import type { BlogPost } from '@/app/lib/blog';
import { Course } from '@/app/types/course';
import { generateSeoMetadata, generateOrganizationSchema } from '@/app/lib/seo';
import JsonLd from '@/app/components/seo/JsonLd';
import { getFooterData } from '@/app/lib/footer';

// Generate SEO metadata for home page
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generateSeoMetadata({
    title: {
      de: 'Startseite',
      fa: 'آکادمی زبان آلمانی درخت خرد'
    },
    description: {
      de: 'Derakhte Kherad ist ein führendes Institut für das Erlernen der deutschen Sprache in Shiraz, Iran. Wir bieten hochwertige Sprachkurse für alle Niveaus an.',
      fa: 'درخت خرد یک موسسه پیشرو در آموزش زبان آلمانی در شیراز، ایران است. ما دوره‌های زبان با کیفیت بالا را برای تمام سطوح ارائه می‌دهیم.'
    },
    image: {
      url: '/images/hero-home.jpg',
      alt: {
        de: 'Derakhte Kherad Deutsches Sprachinstitut',
        fa: 'موسسه زبان آلمانی درخت خرد'
      }
    },
    keywords: {
      de: ['Deutschkurs', 'Deutsch lernen', 'Sprachschule', 'Deutsches Sprachinstitut', 'Deutschkurse Iran'],
      fa: ['آموزش زبان آلمانی', 'کلاس آلمانی', 'موسسه زبان', 'درخت خرد', 'یادگیری آلمانی']
    }
  }, locale as Locale);
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
  // Define navigation translations
  const nav = {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    about: locale === 'de' ? 'Über' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
    blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
    login: locale === 'de' ? 'Anmelden' : 'ورود',
    signup: locale === 'de' ? 'Registrieren' : 'ثبت نام',
  };
  
  // Fetch hero slides
  let heroSlides: HeroSlide[] = [];
  try {
    heroSlides = await getHeroSlides();
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    // Will use empty array, which the HeroSlider component handles gracefully
  }
  
  // Fetch feature items
  let featureItems: Array<{
    id: string;
    title: string;
    titleFa: string;
    description: string;
    descriptionFa: string;
    iconName: string;
    isActive: boolean;
    orderIndex: number;
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
  }> = [];
  try {
    featureItems = await prisma.featureItem.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
  } catch (error) {
    console.error('Error fetching feature items:', error);
    // Will use default UI if no feature items are found
  }
  
  // Fetch statistics
  let statistics: Array<{
    id: string;
    title: string;
    titleFa: string;
    value: string;
    isActive: boolean;
    orderIndex: number;
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
  }> = [];
  try {
    statistics = await prisma.statistic.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Will use default UI if no statistics are found
  }
  
  // Fetch featured courses
  let featuredCourses: Course[] = [];
  try {
    // Directly query for courses with isActive=true
    const courses = await prisma.course.findMany({
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
      orderBy: {
        createdAt: 'desc'
      },
      take: 6
    });
    
    // Filter the featured ones client-side
    const filtered = courses.filter(course => course.featured === true);
    console.log(`Found ${filtered.length} featured courses out of ${courses.length} total`);
    
    // Transform Prisma result to Course type
    featuredCourses = filtered.map(course => ({
      id: course.id,
      title: course.title,
      titleFa: course.titleFa,
      description: course.description,
      descriptionFa: course.descriptionFa,
      level: course.level,
      capacity: course.capacity,
      startDate: course.startDate.toISOString(),
      endDate: course.endDate.toISOString(),
      timeSlot: course.timeSlot,
      location: course.location,
      thumbnail: course.thumbnail,
      isActive: course.isActive,
      featured: true, // Explicitly set this since we filtered for it
      teacherId: course.teacherId,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      teacher: course.teacher ? {
        id: course.teacher.id,
        user: {
          name: course.teacher.user.name
        }
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    // Will continue with empty array
  }
  
  // Fetch latest blog posts
  let latestPosts: BlogPost[] = [];
  try {
    latestPosts = await getLatestBlogPosts(2);
    console.log(`Fetched ${latestPosts.length} latest blog posts`);
  } catch (error) {
    console.error('Error fetching latest blog posts:', error);
    // Will continue with empty array
  }
  
  // Determine RTL direction based on locale
  const isRtl = locale === 'fa';
  
  // Generate structured data for the organization
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <JsonLd data={organizationSchema} />
      <MainLayout 
        locale={locale as Locale}
        navItems={nav}
        footer={getFooterData(locale as Locale, nav)}
      >
        {/* 1. Hero section */}
        <HeroSlider locale={locale as Locale} initialSlides={heroSlides} autoplay={false} />
        
        {/* 2. Why choose us section */}
      <div className={`bg-gray-50 dark:bg-gray-800 py-16 sm:py-24 ${isRtl ? 'rtl' : 'ltr'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              {locale === 'de' ? 'Warum Derakhte Kherad wählen?' : 'چرا درخت خرد را انتخاب کنیم؟'}
            </h2>
            <p className="mt-3 text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
              {locale === 'de' 
                ? 'Unsere Sprachschule bietet zahlreiche Vorteile für Ihre Sprachreise.'
                : 'مدرسه زبان ما مزایای متعددی برای سفر زبانی شما ارائه می‌دهد.'
              }
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featureItems.length > 0 ? (
                  featureItems.map((feature: {
                    id: string;
                    title: string;
                    titleFa: string;
                    description: string;
                    descriptionFa: string;
                    iconName: string;
                  }) => (
                    <div key={feature.id} className="pt-6">
                      <div className="flow-root bg-white dark:bg-gray-700 rounded-lg px-6 pb-8 shadow-md h-full">
                  <div className="-mt-6">
                    <div>
                            <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg text-white">
                              {renderFeatureIcon(feature.iconName)}
                      </span>
                    </div>
                          <h3 className="mt-8 text-lg font-semibold text-gray-900 dark:text-white">
                            {isRtl ? feature.titleFa : feature.title}
                    </h3>
                          <p className="mt-5 text-base text-gray-500 dark:text-gray-300">
                            {isRtl ? feature.descriptionFa : feature.description}
                    </p>
                  </div>
                </div>
              </div>
                  ))
                ) : (
                  defaultFeatures(locale as Locale).map((feature, index) => (
                    <div key={index} className="pt-6">
                      <div className="flow-root bg-white dark:bg-gray-700 rounded-lg px-6 pb-8 shadow-md h-full">
                  <div className="-mt-6">
                    <div>
                            <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg text-white">
                              {renderFeatureIcon(feature.icon)}
                      </span>
                    </div>
                          <h3 className="mt-8 text-lg font-semibold text-gray-900 dark:text-white">
                            {feature.title}
                    </h3>
                          <p className="mt-5 text-base text-gray-500 dark:text-gray-300">
                            {feature.description}
                    </p>
                  </div>
                </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 3. Statistics section */}
        <StatisticsSection locale={locale as Locale} statistics={statistics} />
        
        {/* 4. Featured courses section */}
        <FeaturedCourses locale={locale as Locale} courses={featuredCourses} />
        
        {/* 5. Language level section */}
        <LanguageLevelSection locale={locale as Locale} />
        
        {/* 6. Latest blog posts */}
        <LatestBlogs locale={locale as Locale} posts={latestPosts} />
        
        {/* 7. Start today section */}
        <StartTodaySection locale={locale as Locale} />
    </MainLayout>
    </>
  );
}

function renderFeatureIcon(iconName: string) {
  switch (iconName) {
    case 'teacher':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 17a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9.46c.35.61.54 1.3.54 2h10v11h-9v2h9zM15 7v2H9v3H7v-3H2V7h5V2h3v5h5zm-3.9 8.5a2.5 2.5 0 0 0-4.6 1.39c0 .17.02.33.04.49l1.46.32c0-.11-.01-.2-.01-.3 0-.69.56-1.25 1.25-1.25a1.25 1.25 0 0 1 1.16 1.72l.8 1.12a2.5 2.5 0 0 0-.1-3.49z" />
        </svg>
      );
    case 'certificate':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 3h16a2 2 0 0 1 2 2v6.17a3 3 0 1 0 0 5.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm8 15a7 7 0 1 0-7-7 7 7 0 0 0 7 7zm4-7a4 4 0 1 1-4-4 4 4 0 0 1 4 4z" />
        </svg>
      );
    case 'culture':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm6.918 6h-3.215a12.607 12.607 0 0 0-1.006-2.168A8.022 8.022 0 0 1 18.918 8zM12 4c.59 0 1.43 1.302 1.94 4H10.06c.51-2.702 1.35-4 1.94-4zm-4.697 4c.352-.812.808-1.545 1.354-2.168A8.022 8.022 0 0 0 5.082 8h3.215zM4 12c0-.695.081-1.37.233-2h3.843c-.1.656-.18 1.32-.18 2s.08 1.344.18 2H4.233A7.873 7.873 0 0 1 4 12zm5.082 6H5.082a8.022 8.022 0 0 1 3.571-2.168A12.607 12.607 0 0 0 9.082 18zm2.918 2c-.59 0-1.43-1.302-1.94-4h3.88c-.51 2.698-1.35 4-1.94 4zm2.697-4c-.352.812-.808 1.545-1.354 2.168A8.022 8.022 0 0 0 18.918 18h-3.215zM16 12c0-.682-.081-1.35-.184-2h4.099c.152.63.233 1.305.233 2s-.081 1.37-.233 2h-4.099c.103-.65.184-1.318.184-2zm-3.992-4h-.016a9.26 9.26 0 0 0-.184 2c0 .682.081 1.35.184 2h3.892c.103-.65.184-1.318.184-2s-.081-1.35-.184-2h-3.876zm-4.184 0h3.876c-.103.65-.184 1.318-.184 2s.081 1.35.184 2H7.824a9.26 9.26 0 0 1-.184-2c0-.682.081-1.35.184-2z" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      );
  }
}

function defaultFeatures(locale: Locale) {
  return [
    {
      title: locale === 'de' ? 'Erfahrene Lehrkräfte' : 'اساتید با تجربه',
      description: locale === 'de'
        ? 'Unsere qualifizierten Lehrer bringen umfangreiche Erfahrung mit.'
        : 'اساتید با تجربه و متخصص ما دارای سال‌ها تجربه تدریس هستند.',
      icon: 'teacher'
    },
    {
      title: locale === 'de' ? 'Offizielles Zertifikat' : 'گواهینامه رسمی',
      description: locale === 'de'
        ? 'Erhalten Sie ein offiziell anerkanntes Zertifikat am Ende Ihres Kurses.'
        : 'در پایان دوره گواهینامه رسمی قابل استفاده در مراکز علمی و دانشگاهی دریافت کنید.',
      icon: 'certificate'
    },
    {
      title: locale === 'de' ? 'Kultureller Austausch' : 'تبادل فرهنگی',
      description: locale === 'de'
        ? 'Erleben Sie die deutsche Kultur durch verschiedene kulturelle Aktivitäten.'
        : 'فرهنگ آلمانی را از طریق فعالیت‌های متنوع فرهنگی تجربه کنید.',
      icon: 'culture'
    }
  ];
}