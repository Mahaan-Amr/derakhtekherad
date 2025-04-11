'use client';

import { useState } from 'react';
import { Locale } from '@/app/i18n/settings';
import { useAuth } from '@/app/context/AuthContext';

interface AdminSettingsContentProps {
  locale: Locale;
  translations: {
    title: string;
    generalSettings: string;
    siteName: string;
    siteDescription: string;
    maintenance: string;
    enableMaintenance: string;
    maintenanceMessage: string;
    notificationSettings: string;
    emailNotifications: string;
    newUserNotification: string;
    newEnrollmentNotification: string;
    backupSettings: string;
    createBackup: string;
    backupFrequency: string;
    daily: string;
    weekly: string;
    monthly: string;
    restoreBackup: string;
    securitySettings: string;
    passwordPolicy: string;
    minimumPasswordLength: string;
    requireSpecialCharacters: string;
    requireNumbers: string;
    sessionTimeout: string;
    save: string;
    cancel: string;
    saved: string;
    error: string;
    loading: string;
  };
}

const AdminSettingsContent: React.FC<AdminSettingsContentProps> = ({
  locale,
  translations
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // General settings state
  const [siteName, setSiteName] = useState('Derakhte Kherad');
  const [siteDescription, setSiteDescription] = useState('Premier language school specializing in German and Farsi');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('We are currently performing scheduled maintenance. Please check back later.');
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newUserNotification, setNewUserNotification] = useState(true);
  const [newEnrollmentNotification, setNewEnrollmentNotification] = useState(true);
  
  // Backup settings state
  const [backupFrequency, setBackupFrequency] = useState('weekly');
  
  // Security settings state
  const [minimumPasswordLength, setMinimumPasswordLength] = useState(8);
  const [requireSpecialCharacters, setRequireSpecialCharacters] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setSaveSuccess(false);
      setSaveError(null);
      
      // In a real application, this would be an API call to save the settings
      // For now, we'll just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // API call would look something like this:
      /*
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          general: {
            siteName,
            siteDescription,
            maintenanceMode,
            maintenanceMessage
          },
          notifications: {
            emailNotifications,
            newUserNotification,
            newEnrollmentNotification
          },
          backup: {
            backupFrequency
          },
          security: {
            minimumPasswordLength,
            requireSpecialCharacters,
            requireNumbers,
            sessionTimeout
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      */
      
      setSaveSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      
      // In a real application, this would be an API call to create a backup
      // For now, we'll just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // API call would look something like this:
      /*
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create backup');
      }
      */
      
      alert(locale === 'de' ? 'Sicherung erfolgreich erstellt' : 'پشتیبان با موفقیت ایجاد شد');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert(locale === 'de' ? 'Fehler beim Erstellen der Sicherung' : 'خطا در ایجاد پشتیبان');
    } finally {
      setLoading(false);
    }
  };
  
  // Form section component for better organization
  const SettingsSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode 
  }) => (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate">
            {translations.title}
          </h2>
        </div>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
        {/* General Settings */}
        <SettingsSection title={translations.generalSettings}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.siteName}
              </label>
              <input
                type="text"
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.siteDescription}
              </label>
              <input
                type="text"
                id="siteDescription"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="maintenanceMode"
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="maintenanceMode" className="font-medium text-gray-700 dark:text-gray-300">
                  {translations.enableMaintenance}
                </label>
              </div>
            </div>
            
            {maintenanceMode && (
              <div className="mt-4">
                <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {translations.maintenanceMessage}
                </label>
                <textarea
                  id="maintenanceMessage"
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}
          </div>
        </SettingsSection>
        
        {/* Notification Settings */}
        <SettingsSection title={translations.notificationSettings}>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                  {translations.emailNotifications}
                </label>
              </div>
            </div>
            
            {emailNotifications && (
              <>
                <div className="ml-7 flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newUserNotification"
                      type="checkbox"
                      checked={newUserNotification}
                      onChange={(e) => setNewUserNotification(e.target.checked)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newUserNotification" className="font-medium text-gray-700 dark:text-gray-300">
                      {translations.newUserNotification}
                    </label>
                  </div>
                </div>
                
                <div className="ml-7 flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newEnrollmentNotification"
                      type="checkbox"
                      checked={newEnrollmentNotification}
                      onChange={(e) => setNewEnrollmentNotification(e.target.checked)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newEnrollmentNotification" className="font-medium text-gray-700 dark:text-gray-300">
                      {translations.newEnrollmentNotification}
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        </SettingsSection>
        
        {/* Backup Settings */}
        <SettingsSection title={translations.backupSettings}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.backupFrequency}
              </label>
              <div className="mt-2">
                <select
                  id="backupFrequency"
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="daily">{translations.daily}</option>
                  <option value="weekly">{translations.weekly}</option>
                  <option value="monthly">{translations.monthly}</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={handleCreateBackup}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-offset-gray-800"
              >
                {translations.createBackup}
              </button>
            </div>
          </div>
        </SettingsSection>
        
        {/* Security Settings */}
        <SettingsSection title={translations.securitySettings}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="minimumPasswordLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.minimumPasswordLength}
              </label>
              <input
                type="number"
                id="minimumPasswordLength"
                value={minimumPasswordLength}
                onChange={(e) => setMinimumPasswordLength(parseInt(e.target.value, 10))}
                min={6}
                max={20}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {translations.sessionTimeout}
              </label>
              <input
                type="number"
                id="sessionTimeout"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value, 10))}
                min={5}
                max={240}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="requireSpecialCharacters"
                  type="checkbox"
                  checked={requireSpecialCharacters}
                  onChange={(e) => setRequireSpecialCharacters(e.target.checked)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="requireSpecialCharacters" className="font-medium text-gray-700 dark:text-gray-300">
                  {translations.requireSpecialCharacters}
                </label>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="requireNumbers"
                  type="checkbox"
                  checked={requireNumbers}
                  onChange={(e) => setRequireNumbers(e.target.checked)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="requireNumbers" className="font-medium text-gray-700 dark:text-gray-300">
                  {translations.requireNumbers}
                </label>
              </div>
            </div>
          </div>
        </SettingsSection>
        
        {/* Save Button and Status Messages */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {translations.cancel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {translations.loading}
              </>
            ) : translations.save}
          </button>
        </div>
        
        {saveSuccess && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md dark:bg-green-900/20 dark:text-green-400">
            <p>{translations.saved}</p>
          </div>
        )}
        
        {saveError && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md dark:bg-red-900/20 dark:text-red-400">
            <p>{saveError}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminSettingsContent; 