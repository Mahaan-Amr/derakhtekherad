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

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    console.log('==== DASHBOARD STATS API REQUEST STARTED ====');
    
    // Authenticate the request
    const { isAuthenticated, userRole } = await authenticate(request);
    
    // Only allow admin access
    if (!isAuthenticated || userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized or insufficient permissions' },
        { status: 403 }
      );
    }

    // Get the current date
    const now = new Date();
    
    // Calculate the start date for the previous month
    const previousMonthStart = new Date(now);
    previousMonthStart.setMonth(now.getMonth() - 1);
    previousMonthStart.setDate(1);
    previousMonthStart.setHours(0, 0, 0, 0);
    
    // Calculate the start date for the current month
    const currentMonthStart = new Date(now);
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    // Get total users count
    const totalUsers = await prisma.user.count();
    
    // Get new users this month
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: currentMonthStart
        }
      }
    });
    
    // Get new users last month
    const newUsersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart
        }
      }
    });

    // Calculate user growth percentage
    const userGrowthPercent = newUsersLastMonth > 0 
      ? Math.round((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100 * 10) / 10
      : 0;
    
    // Get active courses count
    const activeCourses = await prisma.course.count({
      where: {
        isActive: true
      }
    });
    
    // Get courses created this month
    const newCoursesThisMonth = await prisma.course.count({
      where: {
        createdAt: {
          gte: currentMonthStart
        }
      }
    });
    
    // Get courses created last month
    const newCoursesLastMonth = await prisma.course.count({
      where: {
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart
        }
      }
    });
    
    // Calculate course growth percentage
    const courseGrowthPercent = newCoursesLastMonth > 0
      ? Math.round((newCoursesThisMonth - newCoursesLastMonth) / newCoursesLastMonth * 100 * 10) / 10
      : 0;
    
    // Get new students count (users with role STUDENT)
    const newStudents = await prisma.user.count({
      where: {
        role: 'STUDENT',
        createdAt: {
          gte: currentMonthStart
        }
      }
    });
    
    // Get new students last month
    const newStudentsLastMonth = await prisma.user.count({
      where: {
        role: 'STUDENT',
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart
        }
      }
    });
    
    // Calculate student growth percentage
    const studentGrowthPercent = newStudentsLastMonth > 0
      ? Math.round((newStudents - newStudentsLastMonth) / newStudentsLastMonth * 100 * 10) / 10
      : 0;
    
    // Calculate total revenue (from enrollments)
    // In a real implementation, we would sum up actual payment records
    // For now, we'll simulate by multiplying enrollments by course prices
    const courseEnrollments = await prisma.enrollment.findMany({
      where: {
        enrollDate: {
          gte: currentMonthStart
        }
      },
      include: {
        course: {
          select: {
            price: true
          }
        }
      }
    });
    
    const revenue = courseEnrollments.reduce((sum, enrollment) => 
      sum + enrollment.course.price, 0);
    
    // Get previous month revenue
    const previousMonthEnrollments = await prisma.enrollment.findMany({
      where: {
        enrollDate: {
          gte: previousMonthStart,
          lt: currentMonthStart
        }
      },
      include: {
        course: {
          select: {
            price: true
          }
        }
      }
    });
    
    const previousMonthRevenue = previousMonthEnrollments.reduce((sum, enrollment) => 
      sum + enrollment.course.price, 0);
    
    // Calculate revenue growth percentage
    const revenueGrowthPercent = previousMonthRevenue > 0
      ? Math.round((revenue - previousMonthRevenue) / previousMonthRevenue * 100 * 10) / 10
      : 0;
    
    // Get latest users (for the "New Users" section)
    const latestUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    // Get latest courses (for the "New Courses" section)
    const latestCourses = await prisma.course.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        titleFa: true,
        level: true,
        teacherId: true,
        createdAt: true,
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    // Return all stats
    const stats = {
      totalUsers,
      activeCourses,
      newStudents,
      revenue,
      userGrowthPercent,
      courseGrowthPercent,
      studentGrowthPercent,
      revenueGrowthPercent,
      latestUsers,
      latestCourses
    };
    
    console.log('Dashboard stats generated:', stats);
    console.log('==== DASHBOARD STATS API REQUEST COMPLETED ====');
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error generating dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard stats' },
      { status: 500 }
    );
  }
} 