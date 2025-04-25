import { Metadata } from 'next';
import { Locale } from '@/app/i18n/settings';
import LoginPage from '@/app/components/auth/LoginPage';

// Generate metadata for the page
export const metadata: Metadata = {
  title: 'Login | Derakhte Kherad',
  description: 'Log in to your Derakhte Kherad account',
};

// Define the login page component
export default async function Login({
  params,
  searchParams
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: { callbackUrl?: string };
}) {
  // Access locale asynchronously
  const { locale } = await params;
  const { callbackUrl } = searchParams;
  
  // Define translations for login page
  const translations = {
    navigation: {
      home: locale === 'de' ? 'Startseite' : 'خانه',
      about: locale === 'de' ? 'Über' : 'درباره ما',
      courses: locale === 'de' ? 'Kurse' : 'دوره‌ها',
      teachers: locale === 'de' ? 'Lehrer' : 'اساتید',
      blog: locale === 'de' ? 'Blog' : 'وبلاگ',
      contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
      login: locale === 'de' ? 'Anmelden' : 'ورود',
      darkMode: locale === 'de' ? 'Dunkelmodus' : 'حالت تاریک',
      lightMode: locale === 'de' ? 'Hellmodus' : 'حالت روشن'
    },
    footer: {
      address: locale === 'de' ? 'Adresse' : 'آدرس',
      phone: locale === 'de' ? 'Telefon' : 'تلفن',
      email: locale === 'de' ? 'E-Mail' : 'ایمیل',
      rights: locale === 'de' ? 'Alle Rechte vorbehalten' : 'تمامی حقوق محفوظ است'
    },
    login: {
      title: locale === 'de' ? 'Anmelden' : 'ورود',
      subtitle: locale === 'de' ? 'Melden Sie sich an, um fortzufahren' : 'برای ادامه وارد شوید',
      email: locale === 'de' ? 'E-Mail' : 'ایمیل',
      password: locale === 'de' ? 'Passwort' : 'رمز عبور',
      remember: locale === 'de' ? 'Angemeldet bleiben' : 'مرا به خاطر بسپار',
      forgot: locale === 'de' ? 'Passwort vergessen?' : 'رمز عبور را فراموش کرده‌اید؟',
      login: locale === 'de' ? 'Anmelden' : 'ورود',
      noAccount: locale === 'de' ? 'Noch kein Konto?' : 'حساب کاربری ندارید؟',
      register: locale === 'de' ? 'Registrieren' : 'ثبت نام',
      back: locale === 'de' ? 'Zurück zur Startseite' : 'بازگشت به صفحه اصلی'
    }
  };

  return (
    <LoginPage
      locale={locale}
      translations={translations}
      callbackUrl={callbackUrl}
    />
  );
} 