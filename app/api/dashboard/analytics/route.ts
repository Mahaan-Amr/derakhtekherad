import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Authentication helper function
async function authenticate(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    
    let isAuthenticated = false;
    let userId = null;
    let userRole = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = await verifyToken(token);
        isAuthenticated = true;
        userId = payload.id;
        userRole = payload.role;
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }
    
    return { isAuthenticated, userId, userRole };
  } catch (error) {
    console.error('Authentication error:', error);
    return { isAuthenticated: false, userId: null, userRole: null };
  }
}

// Helper to get month names based on locale
function getMonthNames(locale: string): string[] {
  if (locale === 'fa') {
    return [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
  }
  
  return [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
  ];
}

// GET /api/dashboard/analytics - Get dashboard analytics data
export async function GET(request: NextRequest) {
  try {
    console.log('==== DASHBOARD ANALYTICS API REQUEST STARTED ====');
    
    // Authenticate the request
    const { isAuthenticated, userRole } = await authenticate(request);
    
    // Only allow admin access
    if (!isAuthenticated || userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized or insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'de';

    // Get the current date
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Generate analytics data for monthly user growth
    // We'll create monthly data based on actual user registrations
    const monthNames = getMonthNames(locale);
    const monthlyData = await generateMonthlyUserData(currentYear, monthNames);
    
    // Generate course distribution by level
    const coursesByLevel = await generateCoursesByLevel(locale);
    
    // Generate enrollment data by month
    const enrollmentsByMonth = await generateEnrollmentsByMonth(currentYear, monthNames);
    
    // Generate submission status data
    const submissionStatus = await generateSubmissionStatus(locale);
    
    const analytics = {
      monthlyUsers: monthlyData,
      enrollmentsByMonth: enrollmentsByMonth,
      coursesByLevel: coursesByLevel,
      submissionStatus: submissionStatus,
    };
    
    console.log('Dashboard analytics data generated successfully');
    console.log('==== DASHBOARD ANALYTICS API REQUEST COMPLETED ====');
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error generating dashboard analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard analytics' },
      { status: 500 }
    );
  }
}

// Generate monthly user registration data
async function generateMonthlyUserData(year: number, monthNames: string[]) {
  // Initialize array to hold user count for each month
  const monthlyUsers = Array(12).fill(0).map((_, index) => ({
    name: monthNames[index],
    count: 0
  }));
  
  // Get start and end dates for the given year
  const startDate = new Date(year, 0, 1); // January 1st of the year
  const endDate = new Date(year, 11, 31); // December 31st of the year
  
  // Query all user registrations for the given year
  const userRegistrations = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      createdAt: true
    }
  });
  
  // Update the count for each month based on actual registrations
  userRegistrations.forEach(user => {
    const month = user.createdAt.getMonth();
    monthlyUsers[month].count += 1;
  });
  
  // Return only the last 6 months for better visualization
  return monthlyUsers.slice(6);
}

// Generate course distribution by level
async function generateCoursesByLevel(locale: string) {
  // Get courses grouped by level
  const levels = await prisma.course.groupBy({
    by: ['level'],
    _count: {
      id: true
    }
  });
  
  // Map level names based on locale
  const levelNames: Record<string, { de: string, fa: string }> = {
    'A1': { de: 'Anfänger', fa: 'مبتدی' },
    'A2': { de: 'Grundlegende', fa: 'پایه' },
    'B1': { de: 'Mittelstufe', fa: 'متوسط' },
    'B2': { de: 'Fortgeschritten', fa: 'نیمه پیشرفته' },
    'C1': { de: 'Fortgeschritten+', fa: 'پیشرفته' },
    'C2': { de: 'Meisterhaft', fa: 'حرفه‌ای' }
  };
  
  return levels.map(level => ({
    name: locale === 'fa' ? levelNames[level.level]?.fa || level.level : levelNames[level.level]?.de || level.level,
    count: level._count.id
  }));
}

// Generate enrollment data by month
async function generateEnrollmentsByMonth(year: number, monthNames: string[]) {
  // Initialize array to hold enrollment count for each month
  const monthlyEnrollments = Array(12).fill(0).map((_, index) => ({
    name: monthNames[index],
    count: 0
  }));
  
  // Get start and end dates for the given year
  const startDate = new Date(year, 0, 1); // January 1st of the year
  const endDate = new Date(year, 11, 31); // December 31st of the year
  
  // Query all enrollments for the given year
  const enrollments = await prisma.enrollment.findMany({
    where: {
      enrollDate: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      enrollDate: true
    }
  });
  
  // Update the count for each month based on actual enrollments
  enrollments.forEach(enrollment => {
    const month = enrollment.enrollDate.getMonth();
    monthlyEnrollments[month].count += 1;
  });
  
  // Return only the last 6 months for better visualization
  return monthlyEnrollments.slice(6);
}

// Generate submission status data
async function generateSubmissionStatus(locale: string) {
  // Get count of graded submissions
  const gradedCount = await prisma.submission.count({
    where: {
      grade: {
        not: null
      }
    }
  });
  
  // Get count of pending submissions
  const pendingCount = await prisma.submission.count({
    where: {
      grade: null
    }
  });
  
  return [
    {
      name: locale === 'fa' ? 'نمره داده شده' : 'Bewertet',
      value: gradedCount
    },
    {
      name: locale === 'fa' ? 'در انتظار' : 'Ausstehend',
      value: pendingCount
    }
  ];
} 