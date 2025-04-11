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

// Helper function to get a specific student (not exported)
async function fetchStudentById(id: string) {
  const student = await prisma.student.findUnique({
    where: { id },
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
              startDate: true,
              endDate: true,
              teacher: {
                include: {
                  user: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!student) {
    return { error: 'Student not found', status: 404 };
  }

  return { student };
}

// GET /api/students - Get all students or a specific student by ID
export async function GET(request: NextRequest) {
  try {
    // Check if we have an ID in the query parameters
    // Use nextUrl instead of request.url for static generation compatibility
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    // If ID is provided, return that specific student
    if (id) {
      const result = await fetchStudentById(id);
      
      if (result.error) {
        return NextResponse.json(
          { error: result.error },
          { status: result.status }
        );
      }

      return NextResponse.json(result.student);
    }

    // Otherwise return all students
    const students = await prisma.student.findMany({
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
                startDate: true,
                endDate: true,
                isActive: true,
                teacher: {
                  include: {
                    user: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
  console.log('==== CREATE STUDENT API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));

  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Create student attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow admin users to create students
    if (!auth.isAdmin) {
      console.log('Create student attempt - not admin');
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    console.log('Admin authenticated, proceeding with student creation');
    
    // Parse request body
    const data = await request.json();
    const { userId, phone, photo } = data;
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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
    
    // Check if user is already a student
    const existingStudent = await prisma.student.findFirst({
      where: { userId }
    });
    
    if (existingStudent) {
      return NextResponse.json(
        { error: 'User is already a student' },
        { status: 400 }
      );
    }
    
    // Update user role to STUDENT if not already
    if (user.role !== 'STUDENT') {
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'STUDENT' }
      });
    }
    
    // Create the student record
    const student = await prisma.student.create({
      data: {
        userId,
        phone,
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
        enrollments: true
      }
    });
    
    console.log('Student created successfully:', student.id);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  } finally {
    console.log('==== CREATE STUDENT API REQUEST COMPLETED ====');
  }
}

// PUT /api/students?id=... - Update a student
export async function PUT(request: NextRequest) {
  console.log('==== UPDATE STUDENT API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Update student attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow admin users to update students
    if (!auth.isAdmin) {
      console.log('Update student attempt - not admin');
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    console.log('Admin authenticated, proceeding with student update');
    
    // Get student ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id },
      include: { enrollments: true }
    });
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { phone, photo } = data;
    
    // Update the student
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        phone,
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
        enrollments: true
      }
    });
    
    console.log('Student updated successfully:', id);
    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  } finally {
    console.log('==== UPDATE STUDENT API REQUEST COMPLETED ====');
  }
}

// DELETE /api/students?id=... - Delete a student
export async function DELETE(request: NextRequest) {
  console.log('==== DELETE STUDENT API REQUEST STARTED ====');
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Check authentication and authorization
    const auth = await checkAuth(request);
    
    if (!auth.isAuthenticated) {
      console.log('Delete student attempt - not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow admin users to delete students
    if (!auth.isAdmin) {
      console.log('Delete student attempt - not admin');
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    console.log('Admin authenticated, proceeding with student deletion');
    
    // Get student ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    // Log the ID for debugging
    console.log(`Attempting to delete student with ID: ${id}`);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id },
      include: { 
        enrollments: true,
        user: true
      }
    });
    
    if (!existingStudent) {
      return NextResponse.json(
        { error: `Student not found with ID: ${id}` },
        { status: 404 }
      );
    }
    
    // Check if the student has active enrollments
    if (existingStudent.enrollments.length > 0) {
      return NextResponse.json(
        { 
          error: 'Student has active enrollments. Please unenroll the student from courses first.',
          enrollments: existingStudent.enrollments.map(e => ({ id: e.id, courseId: e.courseId }))
        },
        { status: 400 }
      );
    }
    
    // Begin transaction to delete the student
    await prisma.$transaction(async (tx) => {
      // Delete the student record
      await tx.student.delete({
        where: { id }
      });
      
      // No need to update user role, as STUDENT is the default role
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  } finally {
    console.log('==== DELETE STUDENT API REQUEST COMPLETED ====');
  }
} 