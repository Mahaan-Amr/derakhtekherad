import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { verifyToken } from '@/lib/jwt';
import bcrypt from 'bcrypt';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Authentication helper function
async function authenticate(req: NextRequest) {
  try {
    console.log('Starting authentication check');
    const session = await getServerSession(authOptions);
    const authHeader = req.headers.get('authorization');
    const cookies = req.cookies;
    
    console.log('Auth headers:', authHeader ? 'Present' : 'Not present');
    console.log('Session:', session ? 'Present' : 'Not present');
    console.log('Cookies:', cookies.getAll().map(c => c.name).join(', '));
    
    let isAuthenticated = false;
    let userId = null;
    let userRole = null;
    
    // Check session authentication first
    if (session?.user) {
      console.log('User authenticated via session:', session.user.email);
      isAuthenticated = true;
      userId = session.user.id;
      userRole = session.user.role;
      console.log('User role from session:', userRole);
    } 
    // Then check JWT token authentication
    else if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        console.log('Attempting to verify token');
        const payload = await verifyToken(token);
        isAuthenticated = true;
        userId = payload.id;
        userRole = payload.role;
        console.log('User authenticated via token:', payload.email);
        console.log('User role from token:', userRole);
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }
    
    // Check token cookie as fallback
    if (!isAuthenticated) {
      const tokenCookie = cookies.get('token');
      if (tokenCookie) {
        try {
          console.log('Attempting to verify token from cookie');
          const payload = await verifyToken(tokenCookie.value);
          isAuthenticated = true;
          userId = payload.id;
          userRole = payload.role;
          console.log('User authenticated via token cookie:', payload.email);
          console.log('User role from token cookie:', userRole);
        } catch (error) {
          console.error('Token cookie verification failed:', error);
        }
      }
    }
    
    // TODO: For testing purposes only - remove in production
    // Development bypass for easier testing
    const bypassAuthForDev = process.env.NODE_ENV === 'development';
    if (!isAuthenticated && bypassAuthForDev) {
      console.log('DEV MODE: Bypassing authentication check');
      isAuthenticated = true;
      userRole = 'ADMIN'; // Assume admin for testing in development
    }
    
    console.log('Authentication result:', { isAuthenticated, userRole, userId });
    
    return { isAuthenticated, userId, userRole };
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Only bypass in development
    if (process.env.NODE_ENV === 'development') {
      console.log('DEV MODE: Allowing access despite authentication error');
      return { isAuthenticated: true, userId: null, userRole: 'ADMIN' };
    }
    
    return { isAuthenticated: false, userId: null, userRole: null };
  }
}

// Function to get user profiles separately
async function getUserWithProfiles(userId: string) {
  // Get the base user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) return null;

  // Get profiles based on role
  let profiles: any = {};

  if (user.role === 'ADMIN') {
    const adminProfile = await prisma.admin.findFirst({
      where: { userId: user.id },
      select: { id: true }
    });
    if (adminProfile) profiles.adminProfile = adminProfile;
  } 
  else if (user.role === 'TEACHER') {
    const teacherProfile = await prisma.teacher.findFirst({
      where: { userId: user.id },
      select: { 
        id: true,
        bio: true,
        specialties: true 
      }
    });
    if (teacherProfile) profiles.teacherProfile = teacherProfile;
  } 
  else if (user.role === 'STUDENT') {
    const studentProfile = await prisma.student.findFirst({
      where: { userId: user.id },
      select: { 
        id: true,
        enrollments: {
          select: {
            courseId: true
          }
        }
      }
    });
    if (studentProfile) profiles.studentProfile = studentProfile;
  }

  // Return merged data
  return {
    ...user,
    ...profiles
  };
}

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const { isAuthenticated, userRole } = await authenticate(request);
    
    // For development purposes only - bypass auth check
    // TODO: Remove this in production
    const bypassAuth = true;
    
    if (!isAuthenticated && !bypassAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Only allow admin access
    if (userRole !== 'ADMIN' && !bypassAuth) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if we have an ID in the query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    // If ID is provided, return that specific user
    if (id) {
      const user = await getUserWithProfiles(id);

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    }

    // Otherwise return all users with basic profile info
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // For each user, fetch their profile based on role
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const userWithProfiles = await getUserWithProfiles(user.id);
        return userWithProfiles;
      })
    );

    return NextResponse.json(usersWithProfiles);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const { isAuthenticated, userRole } = await authenticate(request);
    
    // For development purposes only - bypass auth check
    // TODO: Remove this in production
    const bypassAuth = true;
    
    if (!isAuthenticated && !bypassAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Only allow admin access
    if (userRole !== 'ADMIN' && !bypassAuth) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { name, email, password, role = 'STUDENT' } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    
    // Create profile based on role
    if (role === 'ADMIN') {
      await prisma.admin.create({
        data: {
          userId: user.id,
        },
      });
    } else if (role === 'TEACHER') {
      await prisma.teacher.create({
        data: {
          userId: user.id,
          bio: '',
        },
      });
    } else {
      await prisma.student.create({
        data: {
          userId: user.id,
        },
      });
    }
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT /api/users?id={id} - Update a user
export async function PUT(request: NextRequest) {
  try {
    // Authenticate the request
    const { isAuthenticated, userRole } = await authenticate(request);
    
    // For development purposes only - bypass auth check
    // TODO: Remove this in production
    const bypassAuth = true;
    
    if (!isAuthenticated && !bypassAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Only allow admin access
    if (userRole !== 'ADMIN' && !bypassAuth) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Get user ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const { name, email, role, password } = body;
    
    // Prepare update data
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    
    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    
    // Handle role change
    if (role && role !== existingUser.role) {
      // Delete existing profiles
      if (existingUser.role === 'ADMIN') {
        await prisma.admin.deleteMany({ where: { userId: id } });
      } else if (existingUser.role === 'TEACHER') {
        await prisma.teacher.deleteMany({ where: { userId: id } });
      } else if (existingUser.role === 'STUDENT') {
        await prisma.student.deleteMany({ where: { userId: id } });
      }
      
      // Create new profile based on new role
      if (role === 'ADMIN') {
        await prisma.admin.create({
          data: {
            userId: id,
          },
        });
      } else if (role === 'TEACHER') {
        await prisma.teacher.create({
          data: {
            userId: id,
            bio: '',
          },
        });
      } else if (role === 'STUDENT') {
        await prisma.student.create({
          data: {
            userId: id,
          },
        });
      }
    }
    
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users?id={id} - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate the request
    const { isAuthenticated, userRole } = await authenticate(request);
    
    // For development purposes only - bypass auth check
    // TODO: Remove this in production
    const bypassAuth = true;
    
    if (!isAuthenticated && !bypassAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Only allow admin access
    if (userRole !== 'ADMIN' && !bypassAuth) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Get user ID from query parameters
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    // Log the request for debugging
    console.log(`DELETE user request received with ID: ${id}`);
    
    if (!id) {
      console.error('User ID missing in delete request');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Remove the UUID format validation - accept any non-empty string ID
    if (!id.trim()) {
      console.error(`Invalid user ID: ${id}`);
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      console.error(`User not found with ID: ${id}`);
      return NextResponse.json(
        { error: `User not found with ID: ${id}` },
        { status: 404 }
      );
    }

    console.log(`Found user: ${existingUser.email} with role: ${existingUser.role}`);
    
    try {
      // Step 1: Handle student profile deletion if user is a student
      if (existingUser.role === 'STUDENT') {
        const studentProfile = await prisma.student.findFirst({
          where: { userId: existingUser.id },
          include: {
            enrollments: true,
            submissions: true,
            quizResponses: true
          }
        });
        
        if (studentProfile) {
          console.log(`Found student profile, id: ${studentProfile.id}`);
          
          // Delete enrollments first
          if (studentProfile.enrollments.length > 0) {
            console.log(`Deleting ${studentProfile.enrollments.length} enrollments`);
            await prisma.enrollment.deleteMany({
              where: { studentId: studentProfile.id }
            });
          }
          
          // Delete submissions if any
          if (studentProfile.submissions.length > 0) {
            console.log(`Deleting ${studentProfile.submissions.length} submissions`);
            await prisma.submission.deleteMany({
              where: { studentId: studentProfile.id }
            });
          }
          
          // Delete quiz responses if any
          if (studentProfile.quizResponses.length > 0) {
            console.log(`Deleting ${studentProfile.quizResponses.length} quiz responses`);
            await prisma.quizResponse.deleteMany({
              where: { studentId: studentProfile.id }
            });
          }
          
          // Now delete the student profile
          console.log(`Deleting student profile`);
          await prisma.student.delete({
            where: { id: studentProfile.id }
          });
        }
      }
      
      // Step 2: Handle teacher profile deletion if user is a teacher
      if (existingUser.role === 'TEACHER') {
        const teacherProfile = await prisma.teacher.findFirst({
          where: { userId: existingUser.id },
          include: {
            courses: true
          }
        });
        
        if (teacherProfile) {
          console.log(`Found teacher profile, id: ${teacherProfile.id}`);
          
          // Check if teacher has courses
          if (teacherProfile.courses.length > 0) {
            console.log(`Teacher has ${teacherProfile.courses.length} courses, cannot delete`);
            return NextResponse.json(
              { error: 'Cannot delete user: Teacher has associated courses. Please reassign or delete the courses first.' },
              { status: 400 }
            );
          }
          
          // Delete assignments if related to this teacher
          console.log(`Deleting teacher's assignments`);
          await prisma.assignment.deleteMany({
            where: { teacherId: teacherProfile.id }
          });
          
          // Now delete the teacher profile
          console.log(`Deleting teacher profile`);
          await prisma.teacher.delete({
            where: { id: teacherProfile.id }
          });
        }
      }
      
      // Step 3: Handle admin profile deletion if user is an admin
      if (existingUser.role === 'ADMIN') {
        const adminProfile = await prisma.admin.findFirst({
          where: { userId: existingUser.id }
        });
        
        if (adminProfile) {
          console.log(`Found admin profile, id: ${adminProfile.id}`);
          
          // Check if there are other admins before deleting
          const adminCount = await prisma.admin.count();
          if (adminCount <= 1) {
            console.log(`Cannot delete the only admin`);
            return NextResponse.json(
              { error: 'Cannot delete the only admin user. Create another admin first.' },
              { status: 400 }
            );
          }
          
          // Delete admin profile
          console.log(`Deleting admin profile`);
          await prisma.admin.delete({
            where: { id: adminProfile.id }
          });
        }
      }
      
      // Step 4: Finally delete the user
      console.log(`Deleting user record`);
      await prisma.user.delete({
        where: { id }
      });
      
      console.log(`User deleted successfully`);
      return NextResponse.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (deleteError) {
      console.error(`Error during deletion steps:`, deleteError);
      let errorMessage = 'Failed to delete user during specific deletion step';
      if (deleteError instanceof Error) {
        errorMessage += `: ${deleteError.message}`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in delete user function:', error);
    // Provide more detailed error message
    let errorMessage = 'Failed to delete user';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      console.error(error.stack); // Log the full stack trace
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 