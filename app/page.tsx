import { redirect } from 'next/navigation';
import { defaultLocale } from './i18n/settings';
import Image from "next/image";

export default function Home() {
  // This ensures we always redirect to the default locale
  redirect(`/${defaultLocale}/home`);
}
