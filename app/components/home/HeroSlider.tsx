'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/app/i18n/settings';
import Button from '@/app/components/ui/Button';

interface HeroSlide {
  id: string;
  title: string;
  titleFa: string;
  description?: string | null;
  descriptionFa?: string | null;
  imageUrl: string;
  buttonOneText?: string | null;
  buttonOneFa?: string | null;
  buttonOneLink?: string | null;
  buttonTwoText?: string | null;
  buttonTwoFa?: string | null;
  buttonTwoLink?: string | null;
  isActive: boolean;
  orderIndex: number;
}

interface HeroSliderProps {
  locale: Locale;
  initialSlides?: HeroSlide[];
  autoplay?: boolean;
}

export default function HeroSlider({ 
  locale, 
  initialSlides = [],
  autoplay = false 
}: HeroSliderProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(initialSlides.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isRtl = locale === 'fa';
  
  // Fetch slides if not provided as props and set default to last slide
  useEffect(() => {
    if (initialSlides.length === 0) {
      fetchSlides();
    } else if (initialSlides.length > 0) {
      // Set the default to the last slide (leftmost circle)
      setCurrentSlide(initialSlides.length - 1);
    }
  }, [initialSlides]);
  
  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/hero');
      
      if (!response.ok) {
        // Try to get more detailed error information
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Server responded with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setSlides(data);
      // Set the default to the last slide (leftmost circle)
      if (data.length > 0) {
        setCurrentSlide(data.length - 1);
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching slides:', error);
      // Set a user-friendly error message
      setError(error.message || 'Failed to load slides. Please try again later.');
      setIsLoading(false);
    }
  };
  
  // Animation helper function with improved timing
  const animateToSlide = (index: number, dir: 'left' | 'right') => {
    if (isAnimating || index === currentSlide) return;
    
    setNextSlide(index);
    setDirection(dir);
    setIsAnimating(true);
    
    // Wait for animation to complete before updating current slide
    setTimeout(() => {
      setCurrentSlide(index);
      setNextSlide(null);
      setIsAnimating(false);
      setDirection(null);
    }, 500); // Match this to the CSS transition duration
  };
  
  // Autoplay functionality - only enabled if autoplay prop is true
  useEffect(() => {
    if (!autoplay || slides.length <= 1 || isAnimating) return;
    
    const interval = setInterval(() => {
      const next = (currentSlide + 1) % slides.length;
      animateToSlide(next, 'left');
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [slides.length, autoplay, currentSlide, isAnimating]);
  
  // Navigation handlers
  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide || isAnimating) return;
    
    const dir = index > currentSlide ? 'left' : 'right';
    animateToSlide(index, dir);
  }, [currentSlide, isAnimating]);
  
  const goToPrevSlide = useCallback(() => {
    if (isAnimating) return;
    
    const prev = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    animateToSlide(prev, 'right');
  }, [currentSlide, slides.length, isAnimating]);
  
  const goToNextSlide = useCallback(() => {
    if (isAnimating) return;
    
    const next = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    animateToSlide(next, 'left');
  }, [currentSlide, slides.length, isAnimating]);
  
  // If no slides are available yet
  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="text-gray-400 dark:text-gray-500">Loading...</div>
      </div>
    );
  }
  
  // If there was an error loading slides
  if (error) {
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }
  
  // If no slides are available at all
  if (slides.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {locale === 'de' ? 'Willkommen bei Derakhte Kherad' : 'به درخت خرد خوش آمدید'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {locale === 'de' 
              ? 'Entdecken Sie die deutsche und persische Sprache in unserer Sprachschule.' 
              : 'زبان آلمانی و فارسی را در مدرسه زبان ما کشف کنید.'}
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="default">
              {locale === 'de' ? 'Kurse entdecken' : 'کشف دوره‌ها'}
            </Button>
            <Button variant="secondary">
              {locale === 'de' ? 'Mehr erfahren' : 'بیشتر بدانید'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const slide = slides[currentSlide];
  
  // Get current slide content
  const title = locale === 'de' ? slide.title : slide.titleFa;
  const description = locale === 'de' ? slide.description : slide.descriptionFa;
  const buttonOneText = locale === 'de' ? slide.buttonOneText : slide.buttonOneFa;
  const buttonTwoText = locale === 'de' ? slide.buttonTwoText : slide.buttonTwoFa;
  
  // Define animation classes based on direction
  const animationClass = direction 
    ? isRtl 
      ? direction === 'left' ? 'animate-slide-left-rtl' : 'animate-slide-right-rtl'
      : direction === 'left' ? 'animate-slide-left' : 'animate-slide-right'
    : '';
  
  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden group">
      {/* Current slide background */}
      <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${animationClass}`}>
        <Image
          src={slide.imageUrl || '/images/fallback-hero.jpg'}
          alt={title}
          fill
          className="object-cover"
          priority
          unoptimized={process.env.NODE_ENV === 'development'} // Prevents optimization in dev mode for placeholder images
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        {/* Theme-colored gradient overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `linear-gradient(to right, rgba(var(--color-primary-rgb), 0.8), rgba(var(--color-primary-rgb), 0.2))`
          }}
        ></div>
      </div>
      
      {/* Next slide background (only visible during animation) */}
      {isAnimating && nextSlide !== null && (
        <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
          direction === 'left' ? 'translate-x-full' : '-translate-x-full'
        }`}>
          <Image
            src={slides[nextSlide].imageUrl || '/images/fallback-hero.jpg'}
            alt={locale === 'de' ? slides[nextSlide].title : slides[nextSlide].titleFa}
            fill
            className="object-cover"
            priority
            unoptimized={process.env.NODE_ENV === 'development'}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          {/* Theme-colored gradient overlay */}
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `linear-gradient(to right, rgba(var(--color-primary-rgb), 0.8), rgba(var(--color-primary-rgb), 0.2))`
            }}
          ></div>
        </div>
      )}
      
      {/* Content overlay - with appropriate z-index */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="container mx-auto px-4">
          <div className={`max-w-lg transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-white/90 mb-6">
                {description}
              </p>
            )}
            
            <div className={`flex flex-wrap gap-4 ${isRtl ? 'justify-end' : 'justify-start'}`}>
              {buttonOneText && slide.buttonOneLink && (
                <Link href={slide.buttonOneLink}>
                  <Button variant="default" className="min-w-[120px]">
                    {buttonOneText}
                  </Button>
                </Link>
              )}
              
              {buttonTwoText && slide.buttonTwoLink && (
                <Link href={slide.buttonTwoLink}>
                  <Button variant="secondary" className="min-w-[120px]">
                    {buttonTwoText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Previous/Next buttons - with higher z-index */}
      <button
        onClick={goToPrevSlide}
        disabled={isAnimating}
        className={`absolute top-1/2 -translate-y-1/2 ${
          isRtl ? 'right-2 md:right-4' : 'left-2 md:left-4'
        } w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 z-20 ${isAnimating ? 'cursor-not-allowed opacity-50' : ''}`}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
      </button>
      
      <button
        onClick={goToNextSlide}
        disabled={isAnimating}
        className={`absolute top-1/2 -translate-y-1/2 ${
          isRtl ? 'left-2 md:left-4' : 'right-2 md:right-4'
        } w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 z-20 ${isAnimating ? 'cursor-not-allowed opacity-50' : ''}`}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
      </button>
      
      {/* Indicators - with higher z-index */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
              } ${isAnimating ? 'cursor-not-allowed' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}