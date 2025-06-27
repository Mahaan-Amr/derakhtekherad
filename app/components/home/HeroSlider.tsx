'use client';

import { useState, useEffect, useCallback, useRef, TouchEvent, MouseEvent } from 'react';
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
  
  // Drag functionality states
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragThreshold] = useState(50); // Minimum distance to consider as a swipe
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track the animation timeout
  
  // Preload state - keep track of which slides we need to preload
  const [preloadedSlides, setPreloadedSlides] = useState<number[]>([]);
  
  const isRtl = locale === 'fa';
  
  // Calculate previous and next slide indices
  const prevSlideIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  const nextSlideIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
  
  // Preload adjacent slides when the current slide changes
  useEffect(() => {
    if (slides.length <= 1) return;
    
    // Preload the next and previous slides for smoother transitions
    setPreloadedSlides([prevSlideIndex, currentSlide, nextSlideIndex]);
  }, [currentSlide, prevSlideIndex, nextSlideIndex, slides.length]);
  
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
  const animateToSlide = useCallback((index: number, dir: 'left' | 'right') => {
    // Prevent multiple animations from running simultaneously
    if (isAnimating || index === currentSlide) return;
    
    // Clear any existing animation timeout to prevent state conflicts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Make sure the target slide is preloaded before animation
    if (!preloadedSlides.includes(index)) {
      setPreloadedSlides(prev => [...prev, index]);
      // Small delay to ensure image is loaded
      setTimeout(() => {
        setNextSlide(index);
        setDirection(dir);
        setIsAnimating(true);
      }, 50);
    } else {
      setNextSlide(index);
      setDirection(dir);
      setIsAnimating(true);
    }
    
    // Wait for animation to complete before updating current slide
    animationTimeoutRef.current = setTimeout(() => {
      setCurrentSlide(index);
      setNextSlide(null);
      setIsAnimating(false);
      setDirection(null);
      animationTimeoutRef.current = null;
    }, 500); // Match this to the CSS transition duration
  }, [currentSlide, isAnimating, preloadedSlides]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);
  
  // Touch and mouse event handlers
  const handleDragStart = useCallback((clientX: number) => {
    // Don't start dragging if we're already animating or only have one slide
    if (isAnimating || slides.length <= 1) return;
    
    // Ensure next and previous slides are preloaded before starting drag
    setPreloadedSlides([prevSlideIndex, currentSlide, nextSlideIndex]);
    
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  }, [isAnimating, slides.length, currentSlide, prevSlideIndex, nextSlideIndex, preloadedSlides]);
  
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  }, [isDragging]);
  
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    const diffX = currentX - startX;
    const isSignificantMove = Math.abs(diffX) > dragThreshold;
    
    // First end dragging state to avoid conflicts with animation
    setIsDragging(false);
    
    // Only trigger slide change if drag distance is significant
    if (isSignificantMove) {
      // For RTL, we need to invert the swipe direction logic
      const isNextSlide = isRtl ? diffX > 0 : diffX < 0;
      
      if (isNextSlide) {
        animateToSlide(nextSlideIndex, 'left');
      } else {
        animateToSlide(prevSlideIndex, 'right');
      }
    }
  }, [isDragging, currentX, startX, dragThreshold, isRtl, animateToSlide, prevSlideIndex, nextSlideIndex]);
  
  // Touch events
  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    // Don't handle touch events if touching a button or interactive element
    if (
      e.target instanceof Element && 
      (e.target.closest('button') || 
       e.target.closest('a') || 
       e.target.closest('.pointer-events-auto'))
    ) {
      return;
    }
    
    handleDragStart(e.touches[0].clientX);
  }, [handleDragStart]);
  
  const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    handleDragMove(e.touches[0].clientX);
  }, [handleDragMove]);
  
  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);
  
  // Mouse events
  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    // Don't initiate drag if clicking on a button or interactive element
    if (
      e.target instanceof Element && 
      (e.target.closest('button') || 
       e.target.closest('a') || 
       e.target.closest('.pointer-events-auto'))
    ) {
      return;
    }
    
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);
  
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isDragging) {
      handleDragMove(e.clientX);
    }
  }, [isDragging, handleDragMove]);
  
  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);
  
  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);
  
  // Mouse events for the window
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);
  
  // Autoplay functionality - only enabled if autoplay prop is true
  useEffect(() => {
    if (!autoplay || slides.length <= 1 || isAnimating) return;
    
    const interval = setInterval(() => {
      const next = (currentSlide + 1) % slides.length;
      animateToSlide(next, 'left');
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [slides.length, autoplay, currentSlide, isAnimating, animateToSlide]);
  
  // Navigation handlers
  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide || isAnimating || isDragging) return;
    
    const dir = index > currentSlide ? 'left' : 'right';
    animateToSlide(index, dir);
  }, [currentSlide, isAnimating, isDragging, animateToSlide]);
  
  const goToPrevSlide = useCallback(() => {
    if (isAnimating || isDragging) return;
    
    animateToSlide(prevSlideIndex, 'right');
  }, [isAnimating, isDragging, animateToSlide, prevSlideIndex]);
  
  const goToNextSlide = useCallback(() => {
    if (isAnimating || isDragging) return;
    
    animateToSlide(nextSlideIndex, 'left');
  }, [isAnimating, isDragging, animateToSlide, nextSlideIndex]);
  
  // Button handlers with stopPropagation
  const handlePrevButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to parent div
    goToPrevSlide();
  }, [goToPrevSlide]);
  
  const handleNextButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to parent div
    goToNextSlide();
  }, [goToNextSlide]);
  
  const handleIndicatorClick = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent event from bubbling to parent div
    goToSlide(index);
  }, [goToSlide]);
  
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
  
  // Compute drag styles - Improve the smoothness of the drag effect
  const dragDistance = isDragging ? currentX - startX : 0;
  const dragPercent = dragDistance / (sliderRef.current?.clientWidth || 1);
  const dragStyle = isDragging 
    ? { 
        transform: `translateX(${dragDistance}px)`,
        transition: 'none'
      } 
    : {};
    
  // Smooth transition for the next slide during drag
  const nextSlideTransform = isDragging
    ? dragDistance > 0
      ? `translateX(calc(100% + ${dragDistance}px))`
      : `translateX(calc(-100% + ${dragDistance}px))`
    : '';
  
  // Function to determine which slide to show during drag
  const getDragTargetSlide = useCallback(() => {
    if (dragDistance > 0) {
      return prevSlideIndex;
    } else {
      return nextSlideIndex;
    }
  }, [dragDistance, prevSlideIndex, nextSlideIndex]);
  
  // Get the slide to show during drag
  const dragTargetSlide = isDragging ? getDragTargetSlide() : null;
  
  // Preload images component
  const PreloadImages = () => (
    <div className="hidden">
      {preloadedSlides.map(index => (
        <Image 
          key={`preload-${slides[index].id}`}
          src={slides[index].imageUrl || '/images/fallback-hero.jpg'}
          alt="Preloading"
          width={1}
          height={1}
          priority
        />
      ))}
    </div>
  );
  
  return (
    <div 
      ref={sliderRef}
      className="relative w-full h-96 md:h-[500px] overflow-hidden group cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Preload adjacent slides */}
      {slides.length > 1 && <PreloadImages />}
      
      {/* Current slide background - improve animation smoothness */}
      <div 
        className={`absolute inset-0 will-change-transform ${
          isAnimating 
            ? `transition-transform duration-500 ease-in-out ${animationClass}` 
            : 'transition-transform duration-300 ease-out'
        }`}
        style={isDragging ? dragStyle : {}}
      >
        <Image
          src={slide.imageUrl || '/images/fallback-hero.jpg'}
          alt={title}
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
      
      {/* Next slide background (only visible during animation or dragging) - with improved positioning */}
      {((isAnimating && nextSlide !== null) || isDragging) && (
        <div 
          className={`absolute inset-0 will-change-transform ${
            isAnimating 
              ? 'transition-transform duration-500 ease-in-out' 
              : 'transition-none'
          } ${
            !isDragging 
              ? (direction === 'left' ? 'translate-x-full' : '-translate-x-full') 
              : (isRtl 
                ? (dragDistance > 0 ? '-translate-x-full' : 'translate-x-full') 
                : (dragDistance > 0 ? 'translate-x-full' : '-translate-x-full'))
          }`}
          style={isDragging ? { transform: nextSlideTransform } : {}}
        >
          <Image
            src={(nextSlide !== null 
                  ? slides[nextSlide].imageUrl 
                  : dragTargetSlide !== null
                    ? slides[dragTargetSlide].imageUrl
                    : '/images/fallback-hero.jpg'
                 )}
            alt={(nextSlide !== null 
                 ? (locale === 'de' ? slides[nextSlide].title : slides[nextSlide].titleFa) 
                 : "Adjacent slide")}
            fill
            className="object-cover"
            priority // Critical for immediate display
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
      
      {/* Content overlay - improve visibility during transitions */}
      <div className="absolute inset-0 flex items-center z-10 pointer-events-none">
        <div className="container mx-auto px-4">
          <div className={`max-w-lg transition-opacity duration-300 ${isAnimating || isDragging ? 'opacity-0' : 'opacity-100'}`}>
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
                <Link href={slide.buttonOneLink} className="pointer-events-auto">
                  <Button variant="default" className="min-w-[120px]">
                    {buttonOneText}
                  </Button>
                </Link>
              )}
              
              {buttonTwoText && slide.buttonTwoLink && (
                <Link href={slide.buttonTwoLink} className="pointer-events-auto">
                  <Button variant="accent" className="min-w-[120px]">
                    {buttonTwoText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Previous/Next buttons - with stopPropagation */}
      <button
        onClick={handlePrevButtonClick}
        disabled={isAnimating || isDragging}
        className={`absolute top-1/2 -translate-y-1/2 ${
          isRtl ? 'right-2 md:right-4' : 'left-2 md:left-4'
        } w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 z-20 pointer-events-auto ${isAnimating || isDragging ? 'cursor-not-allowed opacity-50' : ''}`}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
      </button>
      
      <button
        onClick={handleNextButtonClick}
        disabled={isAnimating || isDragging}
        className={`absolute top-1/2 -translate-y-1/2 ${
          isRtl ? 'left-2 md:left-4' : 'right-2 md:right-4'
        } w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 z-20 pointer-events-auto ${isAnimating || isDragging ? 'cursor-not-allowed opacity-50' : ''}`}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
      </button>
      
      {/* Indicators - with stopPropagation */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-auto">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleIndicatorClick(e, index)}
              disabled={isAnimating || isDragging}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-indicator scale-125' : 'bg-indicator-inactive hover:bg-indicator-hover'
              } ${isAnimating || isDragging ? 'cursor-not-allowed' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}