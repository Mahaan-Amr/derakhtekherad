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

// GET /api/students/teacher - Get students for the authenticated teacher's courses
export async function GET(request: NextRequest) {
  console.log('==== TEACHER STUDENTS API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Get teacher students attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow teacher to access their students
    if (!auth.isTeacher || !auth.teacherId) {
      console.log('Get teacher students attempt - not a teacher');
      return NextResponse.json(
        { error: 'Not authorized - teacher access required' },
        { status: 403 }
      );
    }
    
    console.log(`Teacher authenticated, fetching students for teacher ID: ${auth.teacherId}`);
    
    // Get query parameters
    const { searchParams } = request.nextUrl;
    const courseId = searchParams.get('courseId');
    const search = searchParams.get('search');
    const studentId = searchParams.get('studentId');
    
    // If studentId is provided, return detailed information for that specific student
    if (studentId) {
      console.log(`Fetching detailed information for student ID: ${studentId}`);
      
      // First, check if this student is enrolled in any of the teacher's courses
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          studentId,
          course: {
            teacherId: auth.teacherId
          }
        }
      });
      
      if (!enrollment) {
        return NextResponse.json(
          { error: 'Student not found or not enrolled in any of your courses' },
          { status: 404 }
        );
      }
      
      // Fetch detailed student information
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          enrollments: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  titleFa: true,
                  level: true,
                  teacherId: true
                }
              }
            },
            where: {
              course: {
                teacherId: auth.teacherId
              }
            }
          }
        }
      });
      
      if (!student) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        );
      }
      
      // Get assignment submissions for this student in the teacher's courses
      const submissions = await prisma.submission.findMany({
        where: {
          studentId,
          assignment: {
            teacherId: auth.teacherId
          }
        },
        include: {
          assignment: {
            select: {
              id: true,
              title: true,
              titleFa: true,
              dueDate: true,
              courseId: true
            }
          }
        }
      });
      
      // Calculate statistics
      const totalSubmissions = submissions.length;
      const gradedSubmissions = submissions.filter(s => s.grade !== null).length;
      const avgGrade = submissions.length > 0 && gradedSubmissions > 0
        ? submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions
        : null;
      
      // Get total assignments for the teacher's courses that the student is enrolled in
      const courseIds = student.enrollments.map(e => e.courseId);
      const totalAssignments = await prisma.assignment.count({
        where: {
          teacherId: auth.teacherId,
          courseId: {
            in: courseIds
          }
        }
      });
      
      const studentDetail = {
        ...student,
        statistics: {
          totalSubmissions,
          gradedSubmissions,
          pendingSubmissions: totalSubmissions - gradedSubmissions,
          avgGrade,
          totalAssignments,
          completionRate: totalAssignments > 0 
            ? (totalSubmissions / totalAssignments) * 100 
            : 0
        },
        submissions
      };
      
      return NextResponse.json({ student: studentDetail });
    }
    
    // Build the query to get students enrolled in the teacher's courses
    let whereClause: any = {
      course: {
        teacherId: auth.teacherId
      }
    };
    
    // If courseId is provided, filter by that specific course
    if (courseId) {
      whereClause.courseId = courseId;
    }
    
    // Get all enrollments for the teacher's courses
    const enrollments = await prisma.enrollment.findMany({
      where: whereClause,
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
        },
        course: {
          select: {
            id: true,
            title: true,
            titleFa: true
          }
        }
      }
    });
    
    // Extract unique students (a student might be enrolled in multiple courses)
    const studentsMap = new Map();
    
    enrollments.forEach(enrollment => {
      const studentId = enrollment.student.id;
      
      // If search term is provided, filter by student name or email
      if (search) {
        const searchLower = search.toLowerCase();
        const studentName = enrollment.student.user.name?.toLowerCase() || '';
        const studentEmail = enrollment.student.user.email?.toLowerCase() || '';
        
        if (!studentName.includes(searchLower) && !studentEmail.includes(searchLower)) {
          return; // Skip this student if not matching search
        }
      }
      
      if (!studentsMap.has(studentId)) {
        // First time seeing this student
        studentsMap.set(studentId, {
          id: studentId,
          user: enrollment.student.user,
          phone: enrollment.student.phone,
          photo: enrollment.student.photo,
          enrollments: [enrollment]
        });
      } else {
        // Add this enrollment to the existing student record
        const student = studentsMap.get(studentId);
        student.enrollments.push(enrollment);
        studentsMap.set(studentId, student);
      }
    });
    
    // Convert map to array
    const students = Array.from(studentsMap.values());
    
    // Also get the list of courses taught by this teacher
    const courses = await prisma.course.findMany({
      where: {
        teacherId: auth.teacherId
      },
      select: {
        id: true,
        title: true,
        titleFa: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });
    
    console.log(`Found ${students.length} students across ${courses.length} courses`);
    
    return NextResponse.json({ 
      students,
      courses,
      totalCount: students.length
    });
  } catch (error) {
    console.error('Error fetching teacher students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher students' },
      { status: 500 }
    );
  } finally {
    console.log('==== TEACHER STUDENTS API REQUEST COMPLETED ====');
  }
} 