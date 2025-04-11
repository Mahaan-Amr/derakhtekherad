'use client';

import { motion } from 'framer-motion';
import { Locale } from '@/app/i18n/settings';
import { useEffect, useRef, useState } from 'react';

type Statistic = {
  id: string;
  title: string;
  titleFa: string;
  value: string;
  isActive: boolean;
  orderIndex: number;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
};

interface StatisticsSectionProps {
  locale: Locale;
  statistics: Statistic[];
}

// Function to parse and format statistics values
const parseStatValue = (value: string) => {
  // Extract prefix, number, and suffix
  const prefix = value.match(/^[^\d]*/) ? value.match(/^[^\d]*/)![0] : '';
  const suffix = value.match(/[^\d]*$/) ? value.match(/[^\d]*$/)![0] : '';
  
  // Extract the numeric part
  const numericStr = value.replace(/[^\d.]/g, '');
  const numeric = parseFloat(numericStr) || 0;
  
  return {
    prefix,
    numeric,
    suffix,
    formatted: (num: number) => `${prefix}${Math.round(num).toLocaleString()}${suffix}`
  };
};

export default function StatisticsSection({ locale, statistics }: StatisticsSectionProps) {
  // If no statistics are available, don't render the section
  if (!statistics || statistics.length === 0) {
    return null;
  }

  // State to track current theme
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // State to track animation progress for each statistic
  const [animatedValues, setAnimatedValues] = useState<{[key: string]: number}>({});
  
  // State to track if animation has started
  const [animationStarted, setAnimationStarted] = useState(false);
  
  // Reference to the section element
  const sectionRef = useRef<HTMLElement>(null);
  
  // Track animation duration
  const animationDuration = 2000; // ms
  const animationSteps = 60;
  
  // Update theme state based on system/user preference
  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    // Check on load
    checkTheme();
    
    // Create observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    
    // Start observing the html element for class changes
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Set up intersection observer to trigger animation
  useEffect(() => {
    // Initialize all counters to 0
    const initialValues: {[key: string]: number} = {};
    statistics.forEach(stat => {
      initialValues[stat.id] = 0;
    });
    setAnimatedValues(initialValues);
    
    // Create intersection observer
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animationStarted) {
          setAnimationStarted(true);
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );
    
    observer.observe(sectionRef.current);
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [statistics, animationStarted]);
  
  // Run counter animation when triggered
  useEffect(() => {
    if (!animationStarted) return;
    
    const timers: NodeJS.Timeout[] = [];
    statistics.forEach(stat => {
      const { numeric } = parseStatValue(stat.value);
      const step = numeric / animationSteps;
      
      for (let i = 1; i <= animationSteps; i++) {
        const timer = setTimeout(() => {
          setAnimatedValues(prev => ({
            ...prev,
            [stat.id]: Math.min(step * i, numeric)
          }));
        }, (animationDuration / animationSteps) * i);
        
        timers.push(timer);
      }
    });
    
    // Clean up timers on unmount
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [statistics, animationStarted, animationDuration, animationSteps]);

  // Title based on locale
  const getTitle = (stat: Statistic) => locale === 'de' ? stat.title : stat.titleFa;
  
  // Canvas ref for network animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Node class
    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x <= 0 || this.x >= canvas!.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas!.height) this.vy *= -1;
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        ctx.closePath();
      }
    }
    
    // Create nodes
    const nodeCount = 50;
    const nodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      nodes.push(new Node(x, y));
    }
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      
      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  // Animations for statistics
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Determine RTL direction based on locale
  const isRtl = locale === 'fa';

  return (
    <section 
      ref={sectionRef}
      className={`relative overflow-hidden py-16 ${isRtl ? 'rtl' : 'ltr'}`}
    >
      {/* Background with animation */}
      <div className="absolute inset-0 bg-primary">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 text-white">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-12">
          {locale === 'de' ? 'Statistiken und Zahlen von Derakhte Kherad' : 'آمار و ارقام درخت خرد'}
        </h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {statistics.map((stat) => {
            const { formatted } = parseStatValue(stat.value);
            return (
              <motion.div 
                key={stat.id} 
                className="flex flex-col items-center justify-center text-center"
                variants={itemVariants}
              >
                <span className="text-4xl md:text-5xl font-bold mb-3">
                  {formatted(animatedValues[stat.id] || 0)}
                </span>
                <h3 className="text-lg font-medium">
                  {getTitle(stat)}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
} 