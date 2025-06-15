import { Locale } from '@/app/i18n/settings';
import { Metadata } from 'next';
import MainLayout from '@/app/components/layouts/MainLayout';
import Input from '@/app/components/ui/Input';
import Button from '@/app/components/ui/Button';
import Select from '@/app/components/ui/Select';
import { generateSeoMetadata, generateBreadcrumbSchema } from '@/app/lib/seo';
import JsonLd from '@/app/components/seo/JsonLd';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFooterData } from '@/app/lib/footer';

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  
  return generateSeoMetadata({
    title: {
      de: 'Kontakt',
      fa: 'تماس با ما'
    },
    description: {
      de: 'Nehmen Sie Kontakt mit der Derakhte Kherad Sprachschule auf. Wir helfen Ihnen gerne bei Fragen zu unseren Deutschkursen oder zur Beratung für ein Studium in Deutschland.',
      fa: 'با آموزشگاه زبان درخت خرد تماس بگیرید. ما برای پاسخگویی به سوالات شما در مورد دوره‌های زبان آلمانی یا مشاوره تحصیل در آلمان آماده هستیم.'
    },
    path: 'contact',
    keywords: {
      de: ['Kontakt', 'Derakhte Kherad', 'Deutschkurse', 'Sprachschule', 'Shiraz', 'Iran'],
      fa: ['تماس با ما', 'درخت خرد', 'دوره‌های زبان آلمانی', 'آموزشگاه زبان', 'شیراز', 'ایران']
    }
  }, locale as Locale);
}

export default async function ContactPage({ params }: ContactPageProps) {
  // Access locale asynchronously
  const { locale } = await params;
  
  // Define navigation translations
  const translations = {
    navigation: {
      home: locale === 'de' ? 'Startseite' : 'خانه',
      about: locale === 'de' ? 'Über' : 'درباره ما',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
      contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    },
    contact: {
      // existing translations...
    }
  };
  
  // Get footer data using the utility function
  const footer = getFooterData(locale as Locale, translations.navigation);
  
  // Determine RTL direction based on locale
  const isRtl = locale === 'fa';
  
  const inquiryTypes = [
    { value: 'general', label: locale === 'de' ? 'Allgemeine Anfrage' : 'درخواست عمومی' },
    { value: 'courses', label: locale === 'de' ? 'Kursinformationen' : 'اطلاعات دوره' },
    { value: 'registration', label: locale === 'de' ? 'Anmeldung' : 'ثبت نام' },
    { value: 'other', label: locale === 'de' ? 'Sonstiges' : 'سایر موارد' }
  ];
  
  // Create LocalBusiness structured data
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    'name': 'Derakhte Kherad',
    'image': 'https://derakhtekherad.com/site-logo/new-logo.svg',
    'address': {
      '@type': 'PostalAddress',
              'streetAddress': locale === 'de' ? 'Kohye Vahdat, Fereshteh Straße, Fereshteh 2 Gasse' : 'کوی وحدت، خیابان فرشته، کوچه فرشته 2',
      'addressLocality': 'Shiraz',
      'addressRegion': 'Fars',
      'postalCode': '123456',
      'addressCountry': 'IR'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 29.6257966,
      'longitude': 52.5563165
    },
    'url': `https://derakhtekherad.com/${locale}/contact`,
    'telephone': '+987136386652',
    'email': 'info@derakhtekherad.com',
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
        'opens': '09:00',
        'closes': '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Friday'],
        'opens': '09:00',
        'closes': '13:00'
      }
    ]
  };
  
  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { 
      name: locale === 'de' ? 'Startseite' : 'خانه', 
      item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}` 
    },
    {
      name: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      item: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/contact`
    }
  ]);
  
  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />
      <MainLayout locale={locale as Locale} navItems={translations.navigation} footer={footer}>
        <div className={`bg-white dark:bg-gray-900 py-12 sm:py-16 ${isRtl ? 'rtl' : 'ltr'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-12">
              <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
                {locale === 'de' ? 'Kontakt' : 'تماس با ما'}
              </h2>
              <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {locale === 'de' ? 'Nehmen Sie Kontakt mit uns auf' : 'با ما در تماس باشید'}
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                {locale === 'de' 
                  ? 'Haben Sie Fragen? Wir sind hier, um zu helfen.'
                  : 'سوالی دارید؟ ما اینجا هستیم تا به شما کمک کنیم.'
                }
              </p>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              {/* Contact Info */}
              <div className={`mb-12 lg:mb-0 ${isRtl ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    {locale === 'de' ? 'Kontaktinformationen' : 'اطلاعات تماس'}
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {locale === 'de' ? 'Adresse' : 'آدرس'}
                        </h4>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          {locale === 'de' 
                                            ? 'Kohye Vahdat, Fereshteh Straße, Fereshteh 2 Gasse'
                : 'کوی وحدت، خیابان فرشته، کوچه فرشته 2'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {locale === 'de' ? 'Telefon' : 'تلفن'}
                        </h4>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          {locale === 'fa' ? '۰۷۱۳۶۳۸۶۶۵۲' : '+98 71 3638 6652'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {locale === 'de' ? 'E-Mail' : 'ایمیل'}
                        </h4>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">info@derakhtekherad.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {locale === 'de' ? 'Öffnungszeiten' : 'ساعات کاری'}
                        </h4>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          {locale === 'de' 
                            ? 'Sonntag bis Donnerstag: 9:00 - 18:00 Uhr'
                            : 'یکشنبه تا پنجشنبه: ۹:۰۰ تا ۱۸:۰۰'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor">
                          <path d="M17.6 6.31999C16.8 5.49999 15.8 4.89999 14.7 4.49999C13.6 4.09999 12.5 3.99999 11.3 4.09999C10.1 4.19999 9.00001 4.49999 8.00001 5.09999C7.00001 5.59999 6.10001 6.39999 5.50001 7.29999C4.80001 8.19999 4.30001 9.29999 4.10001 10.4C3.80001 11.5 3.90001 12.7 4.10001 13.8C4.40001 14.9 4.90001 15.9 5.60001 16.8L4.00001 20.5C3.90001 20.7 3.90001 20.9 4.00001 21.2C4.10001 21.4 4.30001 21.5 4.50001 21.6C4.70001 21.7 4.90001 21.7 5.10001 21.6L9.00001 20C9.90001 20.6 10.8 21 11.8 21.3C12.8 21.5 13.7 21.6 14.7 21.5C15.7 21.4 16.7 21.1 17.6 20.6C18.5 20.1 19.3 19.4 19.9 18.6C20.6 17.6 21 16.6 21.3 15.5C21.5 14.4 21.6 13.3 21.4 12.2C21.3 11.1 20.9 10 20.4 9.09999C19.8 7.99999 18.8 7.09999 17.6 6.31999Z" fill="#25D366"/>
                          <path d="M16.8 15.6C16.6 16 16.3 16.3 16 16.6C15.7 16.8 15.4 16.9 15 16.9C14.6 16.9 14.3 16.8 13.9 16.6C13.1 16.2 12.3 15.6 11.5 15C11.1 14.7 10.8 14.3 10.4 14C10.1 13.7 9.80001 13.3 9.50001 12.9C9.20001 12.5 8.90001 12.1 8.60001 11.7C8.30001 11.3 8.10001 10.9 7.90001 10.5C7.70001 10.1 7.60001 9.69999 7.60001 9.29999C7.60001 8.89999 7.70001 8.49999 7.90001 8.19999C8.10001 7.89999 8.40001 7.59999 8.70001 7.39999C9.10001 7.19999 9.50001 7.09999 9.90001 7.19999C10.1 7.19999 10.3 7.29999 10.4 7.39999C10.5 7.49999 10.6 7.69999 10.7 7.89999L11.5 9.39999C11.6 9.59999 11.6 9.79999 11.6 9.89999C11.6 9.99999 11.6 10.1 11.5 10.2C11.5 10.3 11.4 10.4 11.3 10.5L11 10.8C10.9 10.9 10.8 11 10.8 11.1C10.8 11.2 10.8 11.3 10.9 11.4C11 11.6 11.2 11.8 11.4 12C11.6 12.2 11.8 12.4 12 12.6C12.2 12.8 12.4 13 12.6 13.2C12.8 13.4 13 13.6 13.2 13.7C13.3 13.8 13.4 13.8 13.5 13.8C13.6 13.8 13.7 13.7 13.8 13.6L14.1 13.3C14.2 13.2 14.3 13.1 14.4 13.1C14.5 13.1 14.6 13.1 14.7 13.1C14.9 13.1 15 13.1 15.2 13.2L16.7 14C16.9 14.1 17.1 14.2 17.2 14.3C17.3 14.4 17.4 14.6 17.4 14.8C17.2 15 17.1 15.3 16.8 15.6Z" fill="white"/>
                        </svg>
                      </div>
                      <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {locale === 'de' ? 'WhatsApp' : 'واتساپ'}
                        </h4>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          {locale === 'fa' ? '۰۹۳۶۰۲۱۷۶۸۴' : '+98 936 021 7684'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className={`${isRtl ? 'lg:order-1' : 'lg:order-2'}`}>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <Input
                        label={locale === 'de' ? 'Vorname' : 'نام'}
                        isRtl={isRtl}
                        type="text"
                        name="first-name"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label={locale === 'de' ? 'Nachname' : 'نام خانوادگی'}
                        isRtl={isRtl}
                        type="text"
                        name="last-name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Input
                      label={locale === 'de' ? 'E-Mail' : 'ایمیل'}
                      isRtl={isRtl}
                      type="email"
                      name="email"
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      label={locale === 'de' ? 'Telefon' : 'تلفن'}
                      isRtl={isRtl}
                      type="tel"
                      name="phone"
                    />
                  </div>
                  
                  <div>
                    <Select
                      label={locale === 'de' ? 'Art der Anfrage' : 'نوع درخواست'}
                      isRtl={isRtl}
                      name="inquiry-type"
                      options={inquiryTypes}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {locale === 'de' ? 'Nachricht' : 'پیام'}
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md"
                        required
                        dir={isRtl ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="w-full"
                    >
                      {locale === 'de' ? 'Nachricht senden' : 'ارسال پیام'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
} 