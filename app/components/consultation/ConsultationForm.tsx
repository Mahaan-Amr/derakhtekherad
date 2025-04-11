'use client';

import React, { useState } from 'react';
import { Locale } from '@/app/i18n/settings';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface ConsultationFormProps {
  locale: Locale;
  translations: {
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    currentLevelLabel: string;
    currentLevelOptions: { value: string; label: string }[];
    preferredTimeLabel: string;
    preferredTimeOptions: { value: string; label: string }[];
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submitting: string;
    successMessage: string;
    errorMessage: string;
    requiredField: string;
  };
}

export default function ConsultationForm({ locale, translations }: ConsultationFormProps) {
  const isRtl = locale === 'fa';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentLevel: '',
    preferredTime: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = translations.requiredField;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = translations.requiredField;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = locale === 'de' ? 'Ungültige E-Mail-Adresse' : 'آدرس ایمیل نامعتبر است';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = translations.requiredField;
    }
    
    if (!formData.currentLevel) {
      newErrors.currentLevel = translations.requiredField;
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = translations.requiredField;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would send this data to your API
      // await fetch('/api/consultation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(translations.successMessage);
      setFormSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        currentLevel: '',
        preferredTime: '',
        message: ''
      });
    } catch (error) {
      toast.error(translations.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    const fieldsToValidate = formStep === 0 
      ? ['name', 'email', 'phone'] 
      : ['currentLevel', 'preferredTime'];

    const stepErrors: Record<string, string> = {};
    
    if (formStep === 0) {
      if (!formData.name.trim()) {
        stepErrors.name = translations.requiredField;
      }
      
      if (!formData.email.trim()) {
        stepErrors.email = translations.requiredField;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        stepErrors.email = locale === 'de' ? 'Ungültige E-Mail-Adresse' : 'آدرس ایمیل نامعتبر است';
      }
      
      if (!formData.phone.trim()) {
        stepErrors.phone = translations.requiredField;
      }
    } else if (formStep === 1) {
      if (!formData.currentLevel) {
        stepErrors.currentLevel = translations.requiredField;
      }
      
      if (!formData.preferredTime) {
        stepErrors.preferredTime = translations.requiredField;
      }
    }
    
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      setFormStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setFormStep(prev => prev - 1);
  };
  
  // Framer motion variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    })
  };

  const inputVariants = {
    initial: { y: 10, opacity: 0 },
    animate: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.5
      }
    }),
    focus: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    hover: { 
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  if (formSubmitted) {
    return (
      <motion.div
        className={`bg-white p-10 rounded-lg shadow-md text-center ${isRtl ? 'rtl' : 'ltr'}`}
        variants={successVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {locale === 'de' ? 'Vielen Dank!' : 'با تشکر از شما!'}
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          {translations.successMessage}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFormSubmitted(false)}
          className="px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition duration-300"
        >
          {locale === 'de' ? 'Zurück zur Startseite' : 'بازگشت به صفحه اصلی'}
        </motion.button>
      </motion.div>
    );
  }
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Form progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 px-8 py-4 border-b">
        <div className="flex justify-between items-center">
          {[0, 1, 2].map(step => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  formStep >= step 
                    ? 'border-primary bg-primary text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                {step + 1}
              </div>
              <span className={`text-xs mt-1 ${formStep >= step ? 'text-primary' : 'text-gray-400'}`}>
                {step === 0 
                  ? locale === 'de' ? 'Kontaktdaten' : 'اطلاعات تماس'
                  : step === 1 
                    ? locale === 'de' ? 'Sprachniveau' : 'سطح زبان'
                    : locale === 'de' ? 'Nachricht' : 'پیام'
                }
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${(formStep / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-8">
        {/* Step 1: Contact Information */}
        {formStep === 0 && (
          <motion.div
            custom={1}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold mb-4">
              {locale === 'de' ? 'Ihre Kontaktdaten' : 'اطلاعات تماس شما'}
            </h3>
            
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              whileFocus="focus"
              whileHover="hover"
              custom={1}
            >
              <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                {translations.nameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </motion.div>
            
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              whileFocus="focus"
              whileHover="hover"
              custom={2}
            >
              <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                {translations.emailLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </motion.div>
            
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              whileFocus="focus"
              whileHover="hover"
              custom={3}
            >
              <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium">
                {translations.phoneLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Language Level */}
        {formStep === 1 && (
          <motion.div
            custom={1}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold mb-4">
              {locale === 'de' ? 'Ihr Sprachniveau' : 'سطح زبان شما'}
            </h3>
            
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              whileFocus="focus"
              whileHover="hover"
              custom={1}
            >
              <label htmlFor="currentLevel" className="block text-gray-700 mb-2 font-medium">
                {translations.currentLevelLabel} <span className="text-red-500">*</span>
              </label>
              <select
                id="currentLevel"
                name="currentLevel"
                value={formData.currentLevel}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${errors.currentLevel ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">{locale === 'de' ? 'Bitte auswählen' : 'انتخاب کنید'}</option>
                {translations.currentLevelOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.currentLevel && <p className="text-red-500 text-sm mt-1">{errors.currentLevel}</p>}
            </motion.div>
            
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              whileFocus="focus"
              whileHover="hover"
              custom={2}
            >
              <label htmlFor="preferredTime" className="block text-gray-700 mb-2 font-medium">
                {translations.preferredTimeLabel} <span className="text-red-500">*</span>
              </label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${errors.preferredTime ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">{locale === 'de' ? 'Bitte auswählen' : 'انتخاب کنید'}</option>
                {translations.preferredTimeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Message */}
        {formStep === 2 && (
          <motion.div
            custom={1}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold mb-4">
              {locale === 'de' ? 'Ihre Nachricht' : 'پیام شما'}
            </h3>
            
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              whileFocus="focus"
              whileHover="hover"
              custom={1}
            >
              <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">
                {translations.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder={translations.messagePlaceholder}
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
      
      <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800 border-t flex justify-between">
        {formStep > 0 && (
          <motion.button
            type="button"
            onClick={prevStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="py-2 px-5 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {locale === 'de' ? 'Zurück' : 'بازگشت'}
          </motion.button>
        )}
        
        <div className={`${formStep > 0 ? '' : 'ml-auto'}`}>
          {formStep < 2 ? (
            <motion.button
              type="button"
              onClick={nextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-2 px-6 bg-primary text-white rounded-md font-medium shadow-md hover:shadow-lg hover:bg-primary-dark transition-all duration-300"
            >
              {locale === 'de' ? 'Weiter' : 'ادامه'}
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-3 px-8 bg-primary text-white rounded-md font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {translations.submitting}
                </div>
              ) : (
                translations.submitButton
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.form>
  );
} 