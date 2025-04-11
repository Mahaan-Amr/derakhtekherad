import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { NextRequest } from 'next/server';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Authentication helper function
async function authenticate(req: Request) {
  const session = await getServerSession(authOptions);
  const authHeader = req.headers.get('authorization');
  
  let isAuthenticated = false;
  let userId = null;
  
  if (session?.user) {
    isAuthenticated = true;
    userId = session.user.id;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = await verifyToken(token);
      isAuthenticated = true;
      userId = payload.id;
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }
  
  if (!isAuthenticated) {
    return { isAuthenticated: false, userId: null };
  }
  
  return { isAuthenticated, userId };
}

// GET /api/courses/:id - Get a single course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: true,
        admin: true
      }
    });
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/:id - Update a course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Updating course bypassing authentication...');
    
    const { id } = params;
    
    // Get any admin to work with
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      console.error('No admin found in the database');
      return NextResponse.json(
        { error: 'No admin found in the system' },
        { status: 403 }
      );
    }
    
    console.log('Using admin:', admin);
    
    // Parse request body
    const data = await request.json();
    const {
      title,
      titleFa,
      description,
      descriptionFa,
      price,
      discountPrice,
      thumbnail,
      level,
      published,
      featured,
      teacherId,
      capacity,
      startDate,
      endDate,
      timeSlot,
      location
    } = data;
    
    // Validate required fields
    if (!title || !titleFa || !description || !descriptionFa) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });
    
    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        titleFa,
        description,
        descriptionFa,
        price: price ? parseFloat(price) : undefined,
        level,
        isActive: published !== undefined ? !!published : undefined,
        featured: featured !== undefined ? !!featured : undefined,
        thumbnail,
        capacity: capacity ? Number(capacity) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        timeSlot,
        location,
        teacherId: teacherId || existingCourse.teacherId
      } as any
    });
    
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/:id - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[Courses API] Attempting to delete course with ID:', params.id);
    
    const { id } = params;
    
    // Check for authentication
    const { isAuthenticated, userId } = await authenticate(request);
    
    if (!isAuthenticated) {
      console.error('[Courses API] Not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Check if the user is an admin
    const admin = await prisma.admin.findFirst({
      where: {
        userId: userId || undefined
      }
    });
    
    if (!admin) {
      console.error('[Courses API] User is not an admin', { userId });
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    console.log('[Courses API] Authorized admin:', admin.id);
    
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: true,
        modules: {
          include: {
            lessons: {
              include: {
                materials: true
              }
            }
          }
        },
        assignments: {
          include: {
            submissions: true
          }
        },
        quizzes: {
          include: {
            questions: true,
            responses: true
          }
        }
      }
    });
    
    if (!course) {
      console.error('[Courses API] Course not found:', id);
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    console.log('[Courses API] Found course to delete:', {
      id: course.id,
      title: course.title,
      moduleCount: course.modules.length,
      enrollmentCount: course.enrollments.length
    });
    
    // Delete all related records in order to avoid foreign key constraint issues
    
    // 1. Delete all material resources first (deepest level)
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lesson.materials.length > 0) {
          console.log(`[Courses API] Deleting ${lesson.materials.length} materials for lesson ${lesson.id}`);
          await prisma.material.deleteMany({
            where: { lessonId: lesson.id }
          });
        }
      }
    }
    
    // 2. Delete all lessons
    for (const module of course.modules) {
      if (module.lessons.length > 0) {
        console.log(`[Courses API] Deleting ${module.lessons.length} lessons for module ${module.id}`);
        await prisma.lesson.deleteMany({
          where: { moduleId: module.id }
        });
      }
    }
    
    // 3. Delete all modules
    if (course.modules.length > 0) {
      console.log(`[Courses API] Deleting ${course.modules.length} modules for course ${id}`);
      await prisma.courseModule.deleteMany({
        where: { courseId: id }
      });
    }
    
    // 4. Delete quiz responses, questions, and quizzes
    for (const quiz of course.quizzes) {
      if (quiz.responses.length > 0) {
        console.log(`[Courses API] Deleting ${quiz.responses.length} responses for quiz ${quiz.id}`);
        await prisma.quizResponse.deleteMany({
          where: { quizId: quiz.id }
        });
      }
      
      if (quiz.questions.length > 0) {
        console.log(`[Courses API] Deleting ${quiz.questions.length} questions for quiz ${quiz.id}`);
        await prisma.question.deleteMany({
          where: { quizId: quiz.id }
        });
      }
    }
    
    if (course.quizzes.length > 0) {
      console.log(`[Courses API] Deleting ${course.quizzes.length} quizzes for course ${id}`);
      await prisma.quiz.deleteMany({
        where: { courseId: id }
      });
    }
    
    // 5. Delete submissions and assignments
    for (const assignment of course.assignments) {
      if (assignment.submissions.length > 0) {
        console.log(`[Courses API] Deleting ${assignment.submissions.length} submissions for assignment ${assignment.id}`);
        await prisma.submission.deleteMany({
          where: { assignmentId: assignment.id }
        });
      }
    }
    
    if (course.assignments.length > 0) {
      console.log(`[Courses API] Deleting ${course.assignments.length} assignments for course ${id}`);
      await prisma.assignment.deleteMany({
        where: { courseId: id }
      });
    }
    
    // 6. Delete enrollments
    if (course.enrollments.length > 0) {
      console.log(`[Courses API] Deleting ${course.enrollments.length} enrollments for course ${id}`);
      await prisma.enrollment.deleteMany({
        where: { courseId: id }
      });
    }
    
    // 7. Finally, delete the course
    console.log('[Courses API] Deleting course:', id);
    await prisma.course.delete({
      where: { id }
    });
    
    console.log('[Courses API] Course and all related data deleted successfully');
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('[Courses API] Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 