import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { verifyToken } from '@/lib/jwt';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Initialize with log option to fix enableTracing issue
const prisma = new PrismaClient({
  log: ['query'],
});

// Helper function to check authentication with both NextAuth and JWT token
async function checkAuth(request: NextRequest) {
  console.log('Checking authentication...');
  
  // Try session auth first
  const session = await getServerSession(authOptions);
  let isAuthenticated = false;
  let isAdmin = false;
  let userId = '';
  
  if (session?.user) {
    console.log('User authenticated via session:', session.user.email);
    isAuthenticated = true;
    if (session.user.role === 'ADMIN') {
      console.log('User is admin via session');
      isAdmin = true;
    }
    userId = session.user.id;
  }
  
  // Then try JWT token if session auth failed
  if (!isAuthenticated) {
    const authHeader = request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        console.log('Attempting JWT verification for token');
        const payload = await verifyToken(token);
        if (payload) {
          isAuthenticated = true;
          userId = payload.id;
          console.log('User authenticated via JWT token:', payload.email);
          if (payload.role === 'ADMIN') {
            isAdmin = true;
            console.log('User is admin via JWT token');
          }
        }
      } catch (error: any) {
        console.log('JWT token verification error:', error.message);
      }
    }
  }
  
  return { isAuthenticated, isAdmin, userId };
}

// Helper function to get a specific teacher (not exported)
async function fetchTeacherById(id: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true, 
          email: true
        }
      },
      courses: true
    }
  });

  if (!teacher) {
    return { error: 'Teacher not found', status: 404 };
  }

  return { teacher };
}

// GET /api/teachers - Get all teachers
export async function GET(request: NextRequest) {
  try {
    // Check if we have an ID in the query parameters
    // Use nextUrl instead of request.url for static generation compatibility
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    // If ID is provided, return that specific teacher
    if (id) {
      const result = await fetchTeacherById(id);
      
      if (result.error) {
        return NextResponse.json(
          { error: result.error },
          { status: result.status }
        );
      }

      return NextResponse.json(result.teacher);
    }

    // Otherwise return all teachers
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        courses: {
          select: {
            id: true,
            title: true,
            titleFa: true,
            level: true
          }
        }
      }
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}

// POST /api/teachers - Create a new teacher
export async function POST(request: NextRequest) {
  console.log('==== CREATE TEACHER API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));

  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Create teacher attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow admin users to create teachers
    if (!auth.isAdmin) {
      console.log('Create teacher attempt - not admin');
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    console.log('Admin authenticated, proceeding with teacher creation');
    
    // Parse request body
    const data = await request.json();
    const { userId, bio, bioFa, specialties, photo } = data;
    
    // Validate required fields
    if (!userId || !bio) {
      return NextResponse.json(
        { error: 'User ID and bio are required' },
        { status: 400 }
      );
    }
    
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user is already a teacher
    const existingTeacher = await prisma.teacher.findFirst({
      where: { userId }
    });
    
    if (existingTeacher) {
      return NextResponse.json(
        { error: 'User is already a teacher' },
        { status: 400 }
      );
    }
    
    // Update user role to TEACHER if not already
    if (user.role !== 'TEACHER') {
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'TEACHER' }
      });
    }
    
    // Create the teacher record
    const teacher = await prisma.teacher.create({
      data: {
        userId,
        bio,
        bioFa,
        specialties,
        photo
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        courses: true
      }
    });
    
    console.log('Teacher created successfully:', teacher.id);
    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 }
    );
  } finally {
    console.log('==== CREATE TEACHER API REQUEST COMPLETED ====');
  }
}

// PUT /api/teachers?id=... - Update a teacher
export async function PUT(request: NextRequest) {
  console.log('==== UPDATE TEACHER API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Update teacher attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow admin users to update teachers
    if (!auth.isAdmin) {
      console.log('Update teacher attempt - not admin');
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    console.log('Admin authenticated, proceeding with teacher update');
    
    // Get teacher ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
      include: { courses: true }
    });
    
    if (!existingTeacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { bio, bioFa, specialties, photo } = data;
    
    // Update the teacher
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        bio,
        bioFa,
        specialties,
        photo
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        courses: true
      }
    });
    
    console.log('Teacher updated successfully:', id);
    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    );
  } finally {
    console.log('==== UPDATE TEACHER API REQUEST COMPLETED ====');
  }
}

// DELETE /api/teachers?id=... - Delete a teacher
export async function DELETE(request: NextRequest) {
  console.log('==== DELETE TEACHER API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Delete teacher attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow admin users to delete teachers
    if (!auth.isAdmin) {
      console.log('Delete teacher attempt - not admin');
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    console.log('Admin authenticated, proceeding with teacher deletion');
    
    // Get teacher ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    // Log the ID for debugging
    console.log(`Attempting to delete teacher with ID: ${id}`);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
      include: { 
        courses: true,
        user: true
      }
    });
    
    if (!existingTeacher) {
      return NextResponse.json(
        { error: `Teacher not found with ID: ${id}` },
        { status: 404 }
      );
    }
    
    // Check if the teacher has courses
    if (existingTeacher.courses.length > 0) {
      return NextResponse.json(
        { 
          error: 'Teacher has assigned courses. Please reassign or delete these courses first.',
          courses: existingTeacher.courses.map(c => ({ id: c.id, title: c.title }))
        },
        { status: 400 }
      );
    }
    
    // Begin transaction to delete the teacher
    await prisma.$transaction(async (tx) => {
      // Delete the teacher record
      await tx.teacher.delete({
        where: { id }
      });
      
      // Update the user's role if needed (optional)
      // Only change role if user is a TEACHER (not if they're also an ADMIN)
      if (existingTeacher.user.role === 'TEACHER') {
        await tx.user.update({
          where: { id: existingTeacher.userId },
          data: { role: 'STUDENT' }
        });
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json(
      { error: 'Failed to delete teacher' },
      { status: 500 }
    );
  } finally {
    console.log('==== DELETE TEACHER API REQUEST COMPLETED ====');
  }
} 