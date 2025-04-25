import { redirect } from 'next/navigation';

export default async function RootPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  // Access locale asynchronously
  const { locale } = await params;
  
  // Redirect to the home page with the current locale
  redirect(`/${locale}/home`);

  // Navigation translations
  const nav = {
    home: locale === 'de' ? 'Startseite' : 'خانه',
    about: locale === 'de' ? 'Über' : 'درباره ما',
    courses: locale === 'de' ? 'Kurse' : 'دوره ها',
    blog: locale === 'de' ? 'Blog' : 'بلاگ',
    contact: locale === 'de' ? 'Kontakt' : 'تماس با ما',
    consultation: locale === 'de' ? 'Beratung' : 'مشاوره',
    login: locale === 'de' ? 'Anmelden' : 'ورود',
    signup: locale === 'de' ? 'Registrieren' : 'ثبت نام',
  };
} 