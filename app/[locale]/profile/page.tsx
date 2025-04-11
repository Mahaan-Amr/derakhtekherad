import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import MainLayout from '@/app/components/layouts/MainLayout';
import ProfileForm from '@/app/components/profile/ProfileForm';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Profile | Derakhte Kherad',
  description: 'Manage your profile information',
};

// Define the profile page component
export default async function ProfilePage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
  // Define translations for the profile form
  const profileTranslations = {
    title: locale === 'de' ? 'Mein Profil' : 'پروفایل من',
    subtitle: locale === 'de' ? 'Bearbeiten Sie Ihre persönlichen Informationen' : 'اطلاعات شخصی خود را ویرایش کنید',
    personalInfo: locale === 'de' ? 'Persönliche Informationen' : 'اطلاعات شخصی',
    accountSettings: locale === 'de' ? 'Kontoeinstellungen' : 'تنظیمات حساب کاربری',
    save: locale === 'de' ? 'Speichern' : 'ذخیره',
    cancel: locale === 'de' ? 'Abbrechen' : 'انصراف'
  };
  
  // Define nav items for the layout
  const navItems = {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    about: locale === 'de' ? 'Über uns' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
    blog: locale === 'de' ? 'Blog' : 'وبلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    login: locale === 'de' ? 'Anmelden' : 'ورود',
  };
  
  // Define footer props
  const footer = {
    about: {
      title: locale === 'de' ? 'Über uns' : 'درباره ما',
      description: locale === 'de' 
        ? 'Derakhte Kherad ist ein Sprachinstitut, das sich auf das Unterrichten von Persisch und Deutsch spezialisiert hat.'
        : 'درخت خرد موسسه آموزش زبان است که در زمینه آموزش زبان‌های فارسی و آلمانی تخصص دارد.'
    },
    quickLinks: {
      title: locale === 'de' ? 'Schnelle Links' : 'لینک‌های سریع',
      links: [
        { title: locale === 'de' ? 'Startseite' : 'خانه', href: `/${locale}` },
        { title: locale === 'de' ? 'Kurse' : 'دوره‌ها', href: `/${locale}/courses` },
        { title: locale === 'de' ? 'Blog' : 'وبلاگ', href: `/${locale}/blog` }
      ]
    },
    contact: {
      title: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      address: locale === 'de' ? 'Berlin, Deutschland' : 'برلین، آلمان',
      email: 'info@derakhtekherad.com',
      phone: '+49 123 456789'
    }
  };
  
  return (
    <MainLayout locale={locale} navItems={navItems} footer={footer}>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {profileTranslations.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {profileTranslations.subtitle}
          </p>
          
          <ProfileForm 
            locale={locale} 
            translations={profileTranslations} 
          />
        </div>
      </div>
    </MainLayout>
  );
} 