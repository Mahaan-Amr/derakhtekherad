'use client';

import { useState } from 'react';
import Button from '@/app/components/ui/Button';
import { toast } from 'react-hot-toast';

interface SettingsFormProps {
  locale: string;
  translations: {
    title: string;
    subtitle: string;
    appearance: string;
    notifications: string;
    language: string;
    privacy: string;
    save: string;
    cancel: string;
  };
}

interface UserSettings {
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: 'en' | 'de' | 'fa';
  shareData: boolean;
  activityStatus: boolean;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ locale, translations }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance'); // 'appearance', 'notifications', 'language', 'privacy'
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    language: locale as 'en' | 'de' | 'fa',
    shareData: true,
    activityStatus: true,
  });
  
  const handleToggle = (field: keyof UserSettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLanguageChange = (value: 'en' | 'de' | 'fa') => {
    setSettings(prev => ({
      ...prev,
      language: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would call your API to update the user settings
      // This is a placeholder for the actual API call
      // await fetch(`/api/users/settings/${user?.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(settings),
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        locale === 'de' 
          ? 'Einstellungen erfolgreich aktualisiert!' 
          : 'تنظیمات با موفقیت بروزرسانی شد!',
        { duration: 3000 }
      );
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Aktualisieren der Einstellungen.' 
          : 'خطا در بروزرسانی تنظیمات.',
        { duration: 4000 }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function for tab buttons
  const TabButton = ({ id, label }: { id: string, label: string }) => (
    <button
      type="button"
      className={`px-6 py-4 text-sm font-medium ${
        activeTab === id
          ? 'border-b-2 border-primary text-primary dark:text-primary-light'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      }`}
      onClick={() => setActiveTab(id)}
    >
      {label}
    </button>
  );
  
  // Helper function for toggle switches
  const ToggleSwitch = ({ 
    id, 
    label, 
    description, 
    checked, 
    onChange 
  }: { 
    id: string, 
    label: string, 
    description?: string, 
    checked: boolean, 
    onChange: () => void 
  }) => (
    <div className="flex items-start py-4">
      <div className="flex-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        type="button"
        className={`${
          checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
        onClick={onChange}
        id={id}
        aria-pressed={checked}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        >
          <span
            className={`${
              checked ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
            } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
            aria-hidden="true"
          >
            <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
              <path
                d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span
            className={`${
              checked ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
            } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
            aria-hidden="true"
          >
            <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <TabButton id="appearance" label={translations.appearance} />
        <TabButton id="notifications" label={translations.notifications} />
        <TabButton id="language" label={translations.language} />
        <TabButton id="privacy" label={translations.privacy} />
      </div>
      
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <ToggleSwitch
              id="darkMode"
              label={locale === 'de' ? 'Dunkler Modus' : 'حالت تاریک'}
              description={
                locale === 'de'
                  ? 'Dunkles Farbschema für die gesamte Anwendung'
                  : 'طرح رنگی تیره برای کل برنامه'
              }
              checked={settings.darkMode}
              onChange={() => handleToggle('darkMode')}
            />
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {locale === 'de' ? 'Farbschema' : 'طرح رنگی'}
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {['primary', 'indigo', 'green'].map(color => (
                  <div 
                    key={color}
                    className={`h-12 rounded-md cursor-pointer ${
                      color === 'primary' 
                        ? 'bg-primary ring-2 ring-primary ring-offset-2' 
                        : color === 'indigo' 
                        ? 'bg-indigo-600 hover:ring-2 hover:ring-indigo-600 hover:ring-offset-2' 
                        : 'bg-green-600 hover:ring-2 hover:ring-green-600 hover:ring-offset-2'
                    }`}
                    onClick={() => {
                      // Handle color scheme change
                      toast.success(
                        locale === 'de' 
                          ? 'Farbschema wird in einer zukünftigen Version verfügbar sein.' 
                          : 'طرح رنگی در نسخه‌های آینده در دسترس خواهد بود.',
                        { duration: 3000 }
                      );
                    }}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {locale === 'de' 
                  ? 'Wählen Sie ein Farbschema für die Anwendung' 
                  : 'یک طرح رنگی برای برنامه انتخاب کنید'}
              </p>
            </div>
          </div>
        )}
        
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <ToggleSwitch
              id="emailNotifications"
              label={locale === 'de' ? 'E-Mail-Benachrichtigungen' : 'اعلان‌های ایمیلی'}
              description={
                locale === 'de'
                  ? 'Erhalten Sie E-Mail-Benachrichtigungen über neue Kurse, Aufgaben und Ankündigungen'
                  : 'دریافت اعلان‌های ایمیلی برای دوره‌ها، تکالیف و اطلاعیه‌های جدید'
              }
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            
            <ToggleSwitch
              id="pushNotifications"
              label={locale === 'de' ? 'Push-Benachrichtigungen' : 'اعلان‌های فوری'}
              description={
                locale === 'de'
                  ? 'Erhalten Sie Push-Benachrichtigungen in Ihrem Browser'
                  : 'دریافت اعلان‌های فوری در مرورگر'
              }
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
          </div>
        )}
        
        {/* Language Tab */}
        {activeTab === 'language' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {locale === 'de' ? 'Bevorzugte Sprache' : 'زبان ترجیحی'}
              </label>
              <div className="mt-4 space-y-3">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'de', label: 'Deutsch' },
                  { id: 'fa', label: 'فارسی' },
                ].map(lang => (
                  <div key={lang.id} className="flex items-center">
                    <input
                      id={`lang-${lang.id}`}
                      name="language"
                      type="radio"
                      checked={settings.language === lang.id}
                      onChange={() => handleLanguageChange(lang.id as 'en' | 'de' | 'fa')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`lang-${lang.id}`}
                      className="ml-3 rtl:mr-3 rtl:ml-0 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {lang.label}
                    </label>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {locale === 'de'
                  ? 'Sprache für Benutzeroberfläche und Inhalte'
                  : 'زبان برای رابط کاربری و محتوا'}
              </p>
            </div>
          </div>
        )}
        
        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <ToggleSwitch
              id="shareData"
              label={locale === 'de' ? 'Nutzungsdaten teilen' : 'اشتراک‌گذاری داده‌های استفاده'}
              description={
                locale === 'de'
                  ? 'Helfen Sie uns, die Anwendung zu verbessern, indem Sie anonyme Nutzungsdaten teilen'
                  : 'با اشتراک‌گذاری داده‌های ناشناس استفاده به ما کمک کنید تا برنامه را بهبود دهیم'
              }
              checked={settings.shareData}
              onChange={() => handleToggle('shareData')}
            />
            
            <ToggleSwitch
              id="activityStatus"
              label={locale === 'de' ? 'Aktivitätsstatus anzeigen' : 'نمایش وضعیت فعالیت'}
              description={
                locale === 'de'
                  ? 'Anderen Benutzern zeigen, wann Sie online sind'
                  : 'نمایش وضعیت آنلاین بودن شما به سایر کاربران'
              }
              checked={settings.activityStatus}
              onChange={() => handleToggle('activityStatus')}
            />
            
            <div className="pt-4">
              <button
                type="button"
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                onClick={() => {
                  toast.error(
                    locale === 'de'
                      ? 'Diese Funktion ist derzeit nicht verfügbar.'
                      : 'این عملکرد در حال حاضر در دسترس نیست.',
                    { duration: 3000 }
                  );
                }}
              >
                {locale === 'de' ? 'Alle Meine Daten Löschen' : 'حذف تمام داده‌های من'}
              </button>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {locale === 'de'
                  ? 'Dies löscht dauerhaft alle Ihre persönlichen Daten und Aktivitäten.'
                  : 'این کار تمام داده‌های شخصی و فعالیت‌های شما را به طور دائمی حذف می‌کند.'}
              </p>
            </div>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
          <Button 
            variant="secondary"
            type="button"
            onClick={() => {
              // Reset to default settings
              setSettings({
                darkMode: false,
                emailNotifications: true,
                pushNotifications: true,
                language: locale as 'en' | 'de' | 'fa',
                shareData: true,
                activityStatus: true,
              });
              
              toast.success(
                locale === 'de' 
                  ? 'Auf Standardeinstellungen zurückgesetzt' 
                  : 'به تنظیمات پیش‌فرض بازنشانی شد',
                { duration: 3000 }
              );
            }}
          >
            {translations.cancel}
          </Button>
          
          <Button
            variant="default"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {locale === 'de' ? 'Speichern...' : 'در حال ذخیره...'}
              </span>
            ) : translations.save}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm; 