import { ReactNode } from 'react';
import { Locale } from '../../i18n/settings';
import Header from '../common/Header';
import Footer from '../common/Footer';
import FloatingContactButton from '../contact/FloatingContactButton';

interface MainLayoutProps {
  children: ReactNode;
  locale: Locale;
  navItems: {
    home: string;
    about: string;
    courses: string;
    blog: string;
    contact: string;
    consultation?: string; // Make consultation optional for backward compatibility
    login: string;
    signup: string;
  };
  footerData: {
    about: {
      title: string;
      description: string;
    };
    quickLinks: {
      title: string;
      links: {
        title: string;
        href: string;
      }[];
    };
    contact: {
      title: string;
      address: string;
      email: string;
      phone: string;
    };
    translations: {
      address: string;
      phone: string;
      email: string;
      rights: string;
    };
  };
}

export default function MainLayout({ children, locale, navItems, footerData }: MainLayoutProps) {
  // Contact button translations
  const contactTranslations = {
    whatsapp: locale === 'de' ? 'WhatsApp' : 'واتساپ',
    call: locale === 'de' ? 'Anrufen' : 'تماس',
    email: locale === 'de' ? 'E-Mail' : 'ایمیل',
  };

  return (
    <>
      <Header 
        locale={locale} 
        items={{
          home: navItems.home,
          about: navItems.about,
          courses: navItems.courses,
          blog: navItems.blog,
          contact: navItems.contact,
          consultation: navItems.consultation || (locale === 'de' ? 'Beratung' : 'مشاوره'),
          login: navItems.login,
          signup: navItems.signup,
        }}
      />
      <main>{children}</main>
      <Footer 
        locale={locale} 
        translations={footerData.translations}
        about={footerData.about}
        quickLinks={footerData.quickLinks}
        contact={footerData.contact}
      />
      <FloatingContactButton 
        locale={locale}
        translations={contactTranslations}
      />
    </>
  );
} 