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

// Helper function to get a specific assignment
async function fetchAssignmentById(id: string, teacherId: string | null = null) {
  const whereClause: any = { id };
  
  // If teacherId is provided, ensure the assignment belongs to this teacher
  if (teacherId) {
    whereClause.teacherId = teacherId;
  }
  
  const assignment = await prisma.assignment.findFirst({
    where: whereClause,
    include: {
      course: {
        select: {
          id: true,
          title: true,
          titleFa: true,
        }
      },
      submissions: {
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
    }
  });

  if (!assignment) {
    return { error: 'Assignment not found', status: 404 };
  }

  return { assignment };
}

// GET /api/assignments - Get assignments
export async function GET(request: NextRequest) {
  console.log('==== ASSIGNMENTS API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Get assignments attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow teacher or admin to access assignments
    if (!auth.isTeacher && !auth.userId) {
      console.log('Get assignments attempt - not authorized');
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    const courseId = searchParams.get('courseId');
    
    // If ID is provided, return that specific assignment
    if (id) {
      const result = await fetchAssignmentById(id, auth.isTeacher ? auth.teacherId : null);
      
      if (result.error) {
        return NextResponse.json(
          { error: result.error },
          { status: result.status }
        );
      }

      return NextResponse.json(result.assignment);
    }
    
    // Otherwise, return assignments based on filters
    const whereClause: any = {};
    
    // If teacher, only show their assignments
    if (auth.isTeacher && auth.teacherId) {
      whereClause.teacherId = auth.teacherId;
    }
    
    // If courseId is provided, filter by course
    if (courseId) {
      whereClause.courseId = courseId;
    }
    
    // Fetch assignments
    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      orderBy: {
        dueDate: 'asc'
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            titleFa: true,
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      }
    });
    
    console.log(`Found ${assignments.length} assignments`);
    
    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  } finally {
    console.log('==== ASSIGNMENTS API REQUEST COMPLETED ====');
  }
}

// POST /api/assignments - Create a new assignment
export async function POST(request: NextRequest) {
  console.log('==== CREATE ASSIGNMENT API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Create assignment attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow teachers to create assignments
    if (!auth.isTeacher || !auth.teacherId) {
      console.log('Create assignment attempt - not a teacher');
      return NextResponse.json(
        { error: 'Not authorized - teacher access required' },
        { status: 403 }
      );
    }
    
    console.log(`Teacher authenticated, proceeding with assignment creation`);
    
    // Parse request body
    const data = await request.json();
    const { 
      title, 
      titleFa, 
      description, 
      descriptionFa, 
      dueDate, 
      courseId 
    } = data;
    
    // Validate required fields
    if (!title || !titleFa || !dueDate || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify the course exists and belongs to this teacher
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: auth.teacherId
      }
    });
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or does not belong to this teacher' },
        { status: 404 }
      );
    }
    
    // Create the assignment
    const assignment = await prisma.assignment.create({
      data: {
        title,
        titleFa,
        description,
        descriptionFa,
        dueDate: new Date(dueDate),
        courseId,
        teacherId: auth.teacherId
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            titleFa: true,
          }
        }
      }
    });
    
    console.log('Assignment created successfully:', assignment.id);
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  } finally {
    console.log('==== CREATE ASSIGNMENT API REQUEST COMPLETED ====');
  }
}

// PUT /api/assignments?id=... - Update an assignment
export async function PUT(request: NextRequest) {
  console.log('==== UPDATE ASSIGNMENT API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Update assignment attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow teachers to update assignments
    if (!auth.isTeacher || !auth.teacherId) {
      console.log('Update assignment attempt - not a teacher');
      return NextResponse.json(
        { error: 'Not authorized - teacher access required' },
        { status: 403 }
      );
    }
    
    console.log(`Teacher authenticated, proceeding with assignment update`);
    
    // Get assignment ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the assignment exists and belongs to this teacher
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        id,
        teacherId: auth.teacherId
      }
    });
    
    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found or does not belong to this teacher' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { 
      title, 
      titleFa, 
      description, 
      descriptionFa, 
      dueDate, 
      courseId 
    } = data;
    
    // If courseId is provided, verify it belongs to this teacher
    if (courseId) {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          teacherId: auth.teacherId
        }
      });
      
      if (!course) {
        return NextResponse.json(
          { error: 'Course not found or does not belong to this teacher' },
          { status: 404 }
        );
      }
    }
    
    // Update the assignment
    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(titleFa && { titleFa }),
        ...(description !== undefined && { description }),
        ...(descriptionFa !== undefined && { descriptionFa }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(courseId && { courseId })
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            titleFa: true,
          }
        }
      }
    });
    
    console.log('Assignment updated successfully:', id);
    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    );
  } finally {
    console.log('==== UPDATE ASSIGNMENT API REQUEST COMPLETED ====');
  }
}

// DELETE /api/assignments?id=... - Delete an assignment
export async function DELETE(request: NextRequest) {
  console.log('==== DELETE ASSIGNMENT API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Delete assignment attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow teachers to delete assignments
    if (!auth.isTeacher || !auth.teacherId) {
      console.log('Delete assignment attempt - not a teacher');
      return NextResponse.json(
        { error: 'Not authorized - teacher access required' },
        { status: 403 }
      );
    }
    
    console.log(`Teacher authenticated, proceeding with assignment deletion`);
    
    // Get assignment ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the assignment exists and belongs to this teacher
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        id,
        teacherId: auth.teacherId
      },
      include: {
        submissions: true
      }
    });
    
    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found or does not belong to this teacher' },
        { status: 404 }
      );
    }
    
    // Optionally, check if there are submissions and warn/prevent deletion
    if (existingAssignment.submissions.length > 0) {
      // Here you could either prevent deletion or implement cascade delete
      // For this implementation, we'll delete the assignment and its submissions
      console.log(`Assignment has ${existingAssignment.submissions.length} submissions which will also be deleted`);
    }
    
    // Delete the assignment (cascades to submissions due to Prisma schema relations)
    await prisma.assignment.delete({
      where: { id }
    });
    
    console.log('Assignment deleted successfully:', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    );
  } finally {
    console.log('==== DELETE ASSIGNMENT API REQUEST COMPLETED ====');
  }
} 