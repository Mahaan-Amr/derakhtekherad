import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';
import { authOptions } from '@/app/api/auth/options';

const prisma = new PrismaClient();

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Helper function to check auth - returns user id and role
async function checkAuth(request: NextRequest) {
  console.log('Checking authentication...');
  
  // Initialize return values
  let isAuthenticated = false;
  let isTeacher = false;
  let userId = null;
  let teacherId = null;
  
  // Check for Bearer token in Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    console.log('Attempting JWT verification for token');
    try {
      const payload = await verifyToken(token);
      if (payload && payload.id) {
        console.log(`User authenticated via JWT token: ${payload.email}`);
        userId = payload.id;
        isAuthenticated = true;
        isTeacher = payload.role === 'TEACHER';
        
        if (isTeacher) {
          // Fetch the teacher ID for the authenticated user
          const teacher = await prisma.teacher.findFirst({
            where: { userId }
          });
          
          if (teacher) {
            teacherId = teacher.id;
            console.log(`Teacher ID found: ${teacherId}`);
          } else {
            console.log('User is marked as teacher but no teacher profile found');
            isTeacher = false;
          }
        } else {
          console.log('User is not a teacher via JWT token');
        }
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
    }
  }
  
  // If not authenticated via token, try session
  if (!isAuthenticated) {
    try {
      console.log('[next-auth][warn][DEBUG_ENABLED]');
      console.log('https://next-auth.js.org/warnings#debug_enabled');
      
      const session = await getServerSession(authOptions);
      console.log('Session data present:', !!session);
      
      if (session && session.user) {
        console.log(`User authenticated via NextAuth session: ${session.user.email}`);
        userId = session.user.id;
        isAuthenticated = true;
        isTeacher = session.user.role === 'TEACHER';
        
        if (isTeacher) {
          // Fetch the teacher ID for the authenticated user
          const teacher = await prisma.teacher.findFirst({
            where: { userId }
          });
          
          if (teacher) {
            teacherId = teacher.id;
            console.log(`Teacher ID found: ${teacherId}`);
          } else {
            console.log('User is marked as teacher but no teacher profile found');
            isTeacher = false;
          }
        } else {
          console.log('User is not a teacher via session');
        }
      }
    } catch (error) {
      console.error('NextAuth session check failed:', error);
    }
  }
  
  return { isAuthenticated, isTeacher, userId, teacherId };
}

// GET /api/courses/teacher - Get courses for the authenticated teacher
export async function GET(request: NextRequest) {
  console.log('==== TEACHER COURSES API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Get teacher courses attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow teacher to access their courses
    if (!auth.isTeacher || !auth.teacherId) {
      console.log('Get teacher courses attempt - not a teacher');
      return NextResponse.json(
        { error: 'Not authorized - teacher access required' },
        { status: 403 }
      );
    }
    
    console.log(`Teacher authenticated, fetching courses for teacher ID: ${auth.teacherId}`);
    
    // Get query parameters
    const { searchParams } = request.nextUrl;
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const includeStudents = searchParams.get('includeStudents') === 'true';
    
    // Build where clause
    const whereClause: any = {
      teacherId: auth.teacherId
    };
    
    // Filter active courses unless specifically asked for inactive ones
    if (!includeInactive) {
      whereClause.isActive = true;
    }
    
    // Fetch teacher's courses with students if requested
    const courses = await prisma.course.findMany({
      where: whereClause,
      orderBy: [
        { startDate: 'asc' }
      ],
      include: {
        _count: {
          select: {
            enrollments: true,
            modules: true,
            assignments: true
          }
        },
        // Only include enrollments and students if specifically requested
        ...(includeStudents ? {
          enrollments: {
            include: {
              student: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        } : {})
      }
    });
    
    console.log(`Found ${courses.length} courses for teacher ID: ${auth.teacherId}`);
    
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher courses' },
      { status: 500 }
    );
  } finally {
    console.log('==== TEACHER COURSES API REQUEST COMPLETED ====');
  }
} 