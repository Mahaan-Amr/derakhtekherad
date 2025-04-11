'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useAuth } from '@/app/context/AuthContext';

interface RegisterFormProps {
  locale?: string;
  showRoleSelector?: boolean;
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  locale = 'en',
  showRoleSelector = false,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER' | 'ADMIN'>('STUDENT');
  const [formErrors, setFormErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { register, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const isRtl = locale === 'fa';

  const validateForm = () => {
    const errors: { 
      name?: string; 
      email?: string; 
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!name) {
      errors.name = locale === 'de' 
        ? 'Name ist erforderlich' 
        : 'نام الزامی است';
      isValid = false;
    }

    if (!email) {
      errors.email = locale === 'de' 
        ? 'E-Mail ist erforderlich' 
        : 'ایمیل الزامی است';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = locale === 'de' 
        ? 'Ungültiges E-Mail-Format' 
        : 'فرمت ایمیل نامعتبر است';
      isValid = false;
    }

    if (!password) {
      errors.password = locale === 'de' 
        ? 'Passwort ist erforderlich' 
        : 'رمز عبور الزامی است';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = locale === 'de'
        ? 'Passwort muss mindestens 6 Zeichen lang sein'
        : 'رمز عبور باید حداقل 6 کاراکتر باشد';
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = locale === 'de'
        ? 'Passwörter stimmen nicht überein'
        : 'رمز عبور و تکرار آن مطابقت ندارند';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(name, email, password, role);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Default redirect to home page
        router.push(`/${locale}/home`);
      }
    } catch (err) {
      // Error is handled by the auth context
      console.error('Registration failed:', err);
    }
  };

  const roleOptions = [
    { value: 'STUDENT', label: locale === 'de' ? 'Student' : 'دانش‌آموز' },
    { value: 'TEACHER', label: locale === 'de' ? 'Lehrer' : 'معلم' },
    { value: 'ADMIN', label: locale === 'de' ? 'Administrator' : 'ادمین' },
  ];

  return (
    <div className="max-w-md w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <Input
          label={locale === 'de' ? 'Name' : 'نام'}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={formErrors.name}
          isRtl={isRtl}
          required
        />
        
        <Input
          label={locale === 'de' ? 'E-Mail' : 'ایمیل'}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={formErrors.email}
          isRtl={isRtl}
          required
        />
        
        <Input
          label={locale === 'de' ? 'Passwort' : 'رمز عبور'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={formErrors.password}
          isRtl={isRtl}
          required
        />
        
        <Input
          label={locale === 'de' ? 'Passwort bestätigen' : 'تکرار رمز عبور'}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={formErrors.confirmPassword}
          isRtl={isRtl}
          required
        />
        
        {showRoleSelector && (
          <Select
            label={locale === 'de' ? 'Rolle' : 'نقش'}
            value={role}
            onChange={(value) => setRole(value as 'STUDENT' | 'TEACHER' | 'ADMIN')}
            options={roleOptions}
            isRtl={isRtl}
          />
        )}
        
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {locale === 'de' ? 'Registrieren' : 'ثبت نام'}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm; 