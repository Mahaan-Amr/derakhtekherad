import { Locale } from '@/app/i18n/settings';
import { Metadata } from 'next';
import MainLayout from '@/app/components/layouts/MainLayout';
import ConsultationForm from '@/app/components/consultation/ConsultationForm';
import { generateSeoMetadata, generateBreadcrumbSchema } from '@/app/lib/seo';
import JsonLd from '@/app/components/seo/JsonLd';
import { Suspense } from 'react';

export async function generateMetadata({ 
  params 
}: { 
  params: { locale: Locale } 
}): Promise<Metadata> {
  const { locale } = params;
  
  return generateSeoMetadata({
    title: {
      de: 'Persönliche Beratung',
      fa: 'مشاوره تخصصی'
    },
    description: {
      de: 'Buchen Sie ein persönliches Beratungsgespräch mit unseren Experten für deutsche Sprachkurse. Wir helfen Ihnen, den richtigen Kurs zu finden.',
      fa: 'با کارشناسان ما یک جلسه مشاوره تخصصی رزرو کنید. ما به شما کمک می‌کنیم تا دوره مناسب خود را پیدا کنید.'
    },
    path: 'consultation',
    image: {
      url: '/images/consultation-hero.jpg',
      alt: {
        de: 'Professionelle Beratung bei Derakhte Kherad',
        fa: 'مشاوره تخصصی در درخت خرد'
      }
    },
    keywords: {
      de: ['Sprachberatung', 'Deutschkurse', 'Persönliche Beratung', 'Lerntipps', 'Kursauswahl'],
      fa: ['مشاوره زبان', 'دوره‌های زبان آلمانی', 'مشاوره تخصصی', 'راهنمای یادگیری', 'انتخاب دوره']
    }
  }, locale);
}

export default function ConsultationPage({
  params
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const isRtl = locale === 'fa';

  const translations = {
    navItems: {
      home: locale === 'de' ? 'Startseite' : 'صفحه اصلی',
      about: locale === 'de' ? 'Über Uns' : 'درباره ما',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
      contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
      login: locale === 'de' ? 'Anmelden' : 'ورود',
      signup: locale === 'de' ? 'Registrieren' : 'ثبت نام'
    },
    footer: {
      about: {
        title: locale === 'de' ? 'Über Derakhte Kherad' : 'درباره درخت خرد',
        description: locale === 'de'
          ? 'Das Institut Derakhte Kherad ist ein führendes Zentrum für das Erlernen der deutschen Sprache.'
          : 'موسسه درخت خرد، مرکزی پیشرو در آموزش زبان آلمانی.'
      },
      quickLinks: {
        title: locale === 'de' ? 'Schnelllinks' : 'دسترسی سریع',
        links: [
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
        title: locale === 'de' ? 'Kontaktieren Sie uns' : 'تماس با ما',
        address: locale === 'de'
          ? 'Berlin, Deutschland'
          : 'تهران، ایران',
        email: 'info@derakhtekherad.com',
        phone: '+49 XXXX XXXXXX'
      }
    },
    consult: {
      title: locale === 'de' ? 'Persönliche Beratung' : 'مشاوره تخصصی',
      subtitle: locale === 'de' 
        ? 'Buchen Sie ein persönliches Beratungsgespräch mit unseren Experten'
        : 'یک جلسه مشاوره تخصصی با کارشناسان ما رزرو کنید',
      description: locale === 'de'
        ? 'Unsere erfahrenen Berater stehen Ihnen zur Verfügung, um Ihnen bei der Wahl des richtigen Kurses zu helfen und alle Ihre Fragen zu beantworten. Füllen Sie einfach das Formular aus, und wir werden uns innerhalb von 24 Stunden mit Ihnen in Verbindung setzen.'
        : 'مشاوران باتجربه ما آماده پاسخگویی به سوالات شما و کمک به انتخاب بهترین دوره متناسب با نیازهای شما هستند. کافیست فرم زیر را تکمیل کنید تا در کمتر از ۲۴ ساعت با شما تماس بگیریم.',
      benefits: {
        title: locale === 'de' ? 'Vorteile einer persönlichen Beratung' : 'مزایای مشاوره تخصصی',
        items: [
          {
            icon: 'AcademicCapIcon',
            title: locale === 'de' ? 'Passgenaue Kurswahl' : 'انتخاب دوره متناسب',
            description: locale === 'de' 
              ? 'Wir helfen Ihnen, den perfekten Kurs basierend auf Ihrem aktuellen Niveau zu finden'
              : 'به شما کمک می‌کنیم دوره مناسب را بر اساس سطح فعلی‌تان پیدا کنید'
          },
          {
            icon: 'ClockIcon',
            title: locale === 'de' ? 'Zeiteinsparung' : 'صرفه‌جویی در زمان',
            description: locale === 'de'
              ? 'Vermeiden Sie unnötige Kurswechsel und starten Sie direkt im richtigen Programm'
              : 'از تغییر دوره‌های غیرضروری جلوگیری کنید و مستقیماً در برنامه مناسب شروع کنید'
          },
          {
            icon: 'UserIcon',
            title: locale === 'de' ? 'Persönliche Lernplanung' : 'برنامه‌ریزی یادگیری شخصی',
            description: locale === 'de'
              ? 'Erhalten Sie einen individuellen Lernplan, der auf Ihre Ziele zugeschnitten ist'
              : 'یک برنامه یادگیری شخصی متناسب با اهداف شما دریافت کنید'
          }
        ]
      },
      form: {
        nameLabel: locale === 'de' ? 'Ihr Name' : 'نام و نام خانوادگی',
        emailLabel: locale === 'de' ? 'E-Mail-Adresse' : 'آدرس ایمیل',
        phoneLabel: locale === 'de' ? 'Telefonnummer' : 'شماره تماس',
        currentLevelLabel: locale === 'de' ? 'Aktuelles Sprachniveau' : 'سطح فعلی زبان',
        currentLevelOptions: [
          { value: 'none', label: locale === 'de' ? 'Keine Vorkenntnisse' : 'بدون آشنایی' },
          { value: 'a1', label: locale === 'de' ? 'Grundstufe (A1)' : 'مبتدی (A1)' },
          { value: 'a2', label: locale === 'de' ? 'Grundstufe (A2)' : 'پایه (A2)' },
          { value: 'b1', label: locale === 'de' ? 'Mittelstufe (B1)' : 'متوسط (B1)' },
          { value: 'b2', label: locale === 'de' ? 'Mittelstufe (B2)' : 'متوسط بالا (B2)' },
          { value: 'c1', label: locale === 'de' ? 'Fortgeschritten (C1)' : 'پیشرفته (C1)' },
          { value: 'c2', label: locale === 'de' ? 'Fortgeschritten (C2)' : 'پیشرفته (C2)' }
        ],
        preferredTimeLabel: locale === 'de' ? 'Bevorzugte Kontaktzeit' : 'زمان ترجیحی تماس',
        preferredTimeOptions: [
          { value: 'morning', label: locale === 'de' ? 'Vormittag (9-12 Uhr)' : 'صبح (۹-۱۲)' },
          { value: 'afternoon', label: locale === 'de' ? 'Nachmittag (12-17 Uhr)' : 'بعدازظهر (۱۲-۱۷)' },
          { value: 'evening', label: locale === 'de' ? 'Abend (17-20 Uhr)' : 'عصر (۱۷-۲۰)' }
        ],
        messageLabel: locale === 'de' ? 'Ihre Nachricht' : 'پیام شما',
        messagePlaceholder: locale === 'de' 
          ? 'Bitte teilen Sie uns mit, wie wir Ihnen helfen können...'
          : 'لطفا توضیح دهید چگونه می‌توانیم به شما کمک کنیم...',
        submitButton: locale === 'de' ? 'Beratung anfordern' : 'درخواست مشاوره',
        submitting: locale === 'de' ? 'Wird gesendet...' : 'در حال ارسال...',
        successMessage: locale === 'de' 
          ? 'Ihre Anfrage wurde erfolgreich gesendet. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.'
          : 'درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.',
        errorMessage: locale === 'de'
          ? 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
          : 'خطایی رخ داده است. لطفا بعدا دوباره تلاش کنید.',
        requiredField: locale === 'de' ? 'Dieses Feld ist erforderlich' : 'این فیلد الزامی است'
      }
    }
  };

  // Create breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { 
      name: locale === 'de' ? 'Startseite' : 'خانه', 
      item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}` 
    },
    {
      name: locale === 'de' ? 'Persönliche Beratung' : 'مشاوره تخصصی',
      item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/consultation`
    }
  ]);
  
  // Create FAQ schema for consultation
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': locale === 'de' ? 'Wie finde ich den richtigen Deutschkurs?' : 'چگونه دوره آلمانی مناسب را پیدا کنم؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': locale === 'de' 
            ? 'Unsere Experten helfen Ihnen bei der Auswahl des richtigen Kurses basierend auf Ihrem aktuellen Niveau, Ihren Lernzielen und Ihrem Zeitplan. Buchen Sie eine persönliche Beratung, um eine maßgeschneiderte Empfehlung zu erhalten.'
            : 'کارشناسان ما به شما در انتخاب دوره مناسب بر اساس سطح فعلی، اهداف یادگیری و برنامه زمانی شما کمک می‌کنند. برای دریافت توصیه‌های شخصی‌سازی شده، یک جلسه مشاوره رزرو کنید.'
        }
      },
      {
        '@type': 'Question',
        'name': locale === 'de' ? 'Was erwartet mich in einer Beratungssitzung?' : 'در جلسه مشاوره چه انتظاری باید داشته باشم؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': locale === 'de'
            ? 'In einer persönlichen Beratungssitzung besprechen wir Ihre Sprachkenntnisse, Lernziele und den Zeitrahmen. Wir informieren Sie über verfügbare Kurse, Lehrmethoden und beantworten alle Ihre Fragen.'
            : 'در جلسه مشاوره شخصی، ما در مورد مهارت‌های زبانی، اهداف یادگیری و چارچوب زمانی شما صحبت می‌کنیم. شما را با دوره‌های موجود، روش‌های آموزشی آشنا کرده و به تمام سؤالات شما پاسخ می‌دهیم.'
        }
      },
      {
        '@type': 'Question',
        'name': locale === 'de' ? 'Wie lange dauert eine Beratungssitzung?' : 'مدت زمان جلسه مشاوره چقدر است؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': locale === 'de'
            ? 'Eine typische Beratungssitzung dauert etwa 30 Minuten, kann aber je nach Ihren individuellen Bedürfnissen und Fragen verlängert werden.'
            : 'یک جلسه مشاوره معمولی حدود ۳۰ دقیقه طول می‌کشد، اما بسته به نیازها و سؤالات فردی شما می‌تواند طولانی‌تر شود.'
        }
      },
      {
        '@type': 'Question',
        'name': locale === 'de' ? 'Ist die Beratung kostenlos?' : 'آیا مشاوره رایگان است؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': locale === 'de'
            ? 'Ja, wir bieten kostenlose Beratungsgespräche an, um Ihnen bei der Auswahl des optimalen Lernwegs zu helfen.'
            : 'بله، ما جلسات مشاوره رایگان ارائه می‌دهیم تا به شما در انتخاب مسیر یادگیری بهینه کمک کنیم.'
        }
      },
      {
        '@type': 'Question',
        'name': locale === 'de' ? 'Wie kann ich mich auf die Beratung vorbereiten?' : 'چگونه برای مشاوره آماده شوم؟',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': locale === 'de'
            ? 'Denken Sie über Ihre Lernziele nach, notieren Sie Ihre Fragen und überlegen Sie, wann Sie mit dem Kurs beginnen möchten und wie viel Zeit Sie für das Lernen einplanen können.'
            : 'درمورد اهداف یادگیری خود فکر کنید، سؤالات خود را یادداشت کنید و در مورد زمان شروع دوره و مدت زمانی که می‌توانید برای یادگیری اختصاص دهید، تصمیم بگیرید.'
        }
      }
    ]
  };

  // Function to render icon components based on icon name
  const renderIcon = (iconName: string) => {
    return (
      <>
        {iconName === 'AcademicCapIcon' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20v-6" />
          </svg>
        )}
        {iconName === 'ClockIcon' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {iconName === 'UserIcon' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </>
    );
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <MainLayout locale={locale} navItems={translations.navItems} footer={translations.footer}>
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
            <div 
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {translations.consult.title}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
                {translations.consult.subtitle}
              </p>
              <p className="text-white text-opacity-90 mb-10 max-w-2xl mx-auto">
                {translations.consult.description}
              </p>
              <div 
                className="inline-block"
              >
                <a 
                  href="#consultation-form" 
                  className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {locale === 'de' ? 'Jetzt anmelden' : 'همین حالا ثبت‌نام کنید'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`bg-gray-50 dark:bg-gray-900 py-16 ${isRtl ? 'rtl' : 'ltr'}`}>
          <div className="container mx-auto px-4">
            <div 
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {translations.consult.benefits.title}
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
            </div>

            <div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {translations.consult.benefits.items.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-primary"
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6 mx-auto">
                    {renderIcon(benefit.icon)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-center">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`bg-white dark:bg-gray-800 py-16 ${isRtl ? 'rtl' : 'ltr'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {locale === 'de' ? 'Häufig gestellte Fragen' : 'سوالات متداول'}
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faqSchema.mainEntity.map((faq: any, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {faq.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.acceptedAnswer.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Form Section */}
        <div id="consultation-form" className={`bg-gray-100 dark:bg-gray-900 py-16 ${isRtl ? 'rtl' : 'ltr'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {locale === 'de' ? 'Kontaktieren Sie uns für eine Beratung' : 'برای مشاوره با ما تماس بگیرید'}
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
              <p className="mt-6 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                {locale === 'de' 
                  ? 'Füllen Sie das Formular aus und ein Berater wird sich innerhalb von 24 Stunden mit Ihnen in Verbindung setzen.'
                  : 'فرم را پر کنید و یک مشاور در عرض ۲۴ ساعت با شما تماس خواهد گرفت.'
                }
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <Suspense fallback={<div className="p-8">Loading form...</div>}>
                <ConsultationForm locale={locale} translations={translations.consult.form} />
              </Suspense>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
} 