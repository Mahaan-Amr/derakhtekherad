'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Button from '@/app/components/ui/Button';
import { toast } from 'react-hot-toast';

interface ProfileFormProps {
  locale: string;
  translations: {
    title: string;
    subtitle: string;
    personalInfo: string;
    accountSettings: string;
    save: string;
    cancel: string;
  };
}

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ locale, translations }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'account'
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name,
        email: user.email,
      }));
      
      // You would fetch additional profile data here
      // For example, from an API endpoint that gets user profile details
      // This is a placeholder for the actual API call
      const fetchUserProfile = async () => {
        try {
          // const response = await fetch(`/api/users/profile/${user.id}`);
          // const data = await response.json();
          // setFormData(prevData => ({
          //   ...prevData,
          //   phone: data.phone || '',
          //   bio: data.bio || '',
          // }));
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      
      fetchUserProfile();
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would call your API to update the user profile
      // This is a placeholder for the actual API call
      // await fetch(`/api/users/profile/${user?.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        locale === 'de' 
          ? 'Profil erfolgreich aktualisiert!' 
          : 'پروفایل با موفقیت بروزرسانی شد!',
        { duration: 3000 }
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(
        locale === 'de' 
          ? 'Fehler beim Aktualisieren des Profils.' 
          : 'خطا در بروزرسانی پروفایل.',
        { duration: 4000 }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const isRtl = locale === 'fa';
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-6 py-4 text-sm font-medium ${
            activeTab === 'personal'
              ? 'border-b-2 border-primary text-primary dark:text-primary-light'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('personal')}
        >
          {translations.personalInfo}
        </button>
        <button
          className={`px-6 py-4 text-sm font-medium ${
            activeTab === 'account'
              ? 'border-b-2 border-primary text-primary dark:text-primary-light'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('account')}
        >
          {translations.accountSettings}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {locale === 'de' ? 'Name' : 'نام'}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {locale === 'de' ? 'E-Mail' : 'ایمیل'}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {locale === 'de' ? 'E-Mail kann nicht geändert werden.' : 'ایمیل قابل تغییر نیست.'}
                </p>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {locale === 'de' ? 'Telefon' : 'تلفن'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {locale === 'de' ? 'Biografie' : 'بیوگرافی'}
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {locale === 'de' ? 'Kurze Beschreibung über dich.' : 'توضیح مختصر درباره خودتان.'}
              </p>
            </div>
          </div>
        )}
        
        {/* Account Settings Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {locale === 'de' ? 'Aktuelles Passwort' : 'رمز عبور فعلی'}
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {locale === 'de' ? 'Neues Passwort' : 'رمز عبور جدید'}
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {locale === 'de' ? 'Passwort bestätigen' : 'تایید رمز عبور'}
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>{locale === 'de' ? 'Passwortanforderungen:' : 'الزامات رمز عبور:'}</p>
              <ul className={`${isRtl ? 'mr-5' : 'ml-5'} list-disc`}>
                <li>{locale === 'de' ? 'Mindestens 8 Zeichen' : 'حداقل ۸ کاراکتر'}</li>
                <li>{locale === 'de' ? 'Mindestens ein Großbuchstabe' : 'حداقل یک حرف بزرگ'}</li>
                <li>{locale === 'de' ? 'Mindestens eine Zahl' : 'حداقل یک عدد'}</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
          <Button 
            variant="secondary"
            type="button"
            onClick={() => {
              // Reset form or navigate back
              if (activeTab === 'personal') {
                setFormData(prevData => ({
                  ...prevData,
                  name: user?.name || '',
                  phone: '',
                  bio: '',
                }));
              } else {
                setFormData(prevData => ({
                  ...prevData,
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }));
              }
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

export default ProfileForm; 