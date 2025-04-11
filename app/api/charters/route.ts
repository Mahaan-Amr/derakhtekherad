import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';
import { verifyToken } from '@/lib/jwt';
import { z } from 'zod';

// Schema for validating charter data
const charterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleFa: z.string().min(1, "Farsi title is required"),
  description: z.string().min(1, "Description is required"),
  descriptionFa: z.string().min(1, "Farsi description is required"),
  iconName: z.string().optional(),
  orderIndex: z.number().optional(),
  isActive: z.boolean().optional(),
});

// Helper function to authenticate requests
async function authenticate(request: NextRequest) {
  try {
    console.log('Checking authentication for charters API...');
    
    let isAuthenticated = false;
    let isAdmin = false;
    let userId: string | null = null;

    // Try to authenticate via session first
    console.log('Attempting to authenticate via session...');
    const session = await getServerSession(authOptions);
    
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    if (session?.user) {
      console.log('User authenticated via session:', session.user.email);
      isAuthenticated = true;
      userId = session.user.id;
      isAdmin = session.user.role === 'ADMIN';
      console.log('Session authentication successful, isAdmin:', isAdmin);
    } 
    // If no session, try JWT token
    else {
      console.log('No session found, checking for JWT token...');
      const authHeader = request.headers.get('authorization');
      
      // Try to get token from cookies if no authorization header
      let token = null;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        // Try to get token from cookies
        const tokenCookie = request.cookies.get('token');
        if (tokenCookie) {
          token = tokenCookie.value;
          console.log('Found token in cookies');
        }
      }
      
      if (token) {
        try {
          const payload = await verifyToken(token);
          console.log('User authenticated via token:', payload.email);
          
          isAuthenticated = true;
          userId = payload.id;
          isAdmin = payload.role === 'ADMIN';
          console.log('Token authentication successful, isAdmin:', isAdmin);
        } catch (error) {
          console.error('Invalid token:', error);
        }
      } else {
        console.log('No token found in authorization header or cookies');
      }
    }

    // Check request cookies
    const allCookies = request.cookies.getAll();
    console.log('Request cookies:', allCookies.map(c => c.name));
    
    // Check session cookie specifically
    const sessionCookie = allCookies.find(c => c.name.startsWith('next-auth.session-token'));
    if (sessionCookie) {
      console.log('Session cookie found:', sessionCookie.name);
    } else {
      console.log('No session cookie found');
    }
    
    console.log('Final authentication result:', { isAuthenticated, isAdmin, userId });
    return { isAuthenticated, isAdmin, userId };
  } catch (error) {
    console.error('Authentication error:', error);
    return { isAuthenticated: false, isAdmin: false, userId: null };
  }
}

// GET /api/charters - Get all charters
export async function GET(request: NextRequest) {
  try {
    // Optional filter by active status
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    const where = activeOnly ? { isActive: true } : {};
    
    const charters = await prisma.charter.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
    });
    
    return NextResponse.json(charters);
  } catch (error) {
    console.error('Error fetching charters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charters' },
      { status: 500 }
    );
  }
}

// POST /api/charters - Create a new charter (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    
    if (!auth.isAuthenticated) {
      console.log('Create charter attempt - not authenticated. Auth:', auth);
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to continue.' },
        { status: 401 }
      );
    }
    
    if (!auth.isAdmin) {
      console.log('Create charter attempt - authenticated but not admin. Auth:', auth);
      return NextResponse.json(
        { error: 'Unauthorized. Only admin users can create charters.' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validate input data
    const validationResult = charterSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid charter data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    console.log('Looking for admin profile for user ID:', auth.userId);
    
    // Get the admin profile for the authenticated user
    const adminProfile = await prisma.admin.findFirst({
      where: { userId: auth.userId as string },
    });
    
    console.log('Admin profile found:', adminProfile ? 'yes' : 'no');
    
    if (!adminProfile) {
      console.log('Creating charter with system admin ID since no profile found');
      // If no admin profile found but user has ADMIN role, use a system admin ID
      // First check if there's any admin profile we can use
      const anyAdmin = await prisma.admin.findFirst();
      
      if (!anyAdmin) {
        return NextResponse.json(
          { error: 'No admin profile found in the system' },
          { status: 500 }
        );
      }
      
      // Create new charter with the first available admin ID
      const charter = await prisma.charter.create({
        data: {
          title: data.title,
          titleFa: data.titleFa,
          description: data.description,
          descriptionFa: data.descriptionFa,
          iconName: data.iconName,
          orderIndex: data.orderIndex || 0,
          isActive: data.isActive !== undefined ? data.isActive : true,
          adminId: anyAdmin.id,
        },
      });
      
      return NextResponse.json(charter, { status: 201 });
    }
    
    // Create new charter with the user's admin profile
    const charter = await prisma.charter.create({
      data: {
        title: data.title,
        titleFa: data.titleFa,
        description: data.description,
        descriptionFa: data.descriptionFa,
        iconName: data.iconName,
        orderIndex: data.orderIndex || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        adminId: adminProfile.id,
      },
    });
    
    return NextResponse.json(charter, { status: 201 });
  } catch (error) {
    console.error('Error creating charter:', error);
    return NextResponse.json(
      { error: 'Failed to create charter' },
      { status: 500 }
    );
  }
}

// PUT /api/charters/:id - Update a charter (admin only)
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    
    if (!auth.isAuthenticated) {
      console.log('Update charter attempt - not authenticated. Auth:', auth);
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to continue.' },
        { status: 401 }
      );
    }
    
    if (!auth.isAdmin) {
      console.log('Update charter attempt - authenticated but not admin. Auth:', auth);
      return NextResponse.json(
        { error: 'Unauthorized. Only admin users can update charters.' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Charter ID is required' },
        { status: 400 }
      );
    }
    
    // Validate input data
    const validationResult = charterSchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid charter data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Check if charter exists
    const existingCharter = await prisma.charter.findUnique({
      where: { id },
    });
    
    if (!existingCharter) {
      return NextResponse.json(
        { error: 'Charter not found' },
        { status: 404 }
      );
    }
    
    // Update charter
    const charter = await prisma.charter.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(charter);
  } catch (error) {
    console.error('Error updating charter:', error);
    return NextResponse.json(
      { error: 'Failed to update charter' },
      { status: 500 }
    );
  }
}

// DELETE /api/charters/:id - Delete a charter (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    
    if (!auth.isAuthenticated) {
      console.log('Delete charter attempt - not authenticated. Auth:', auth);
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to continue.' },
        { status: 401 }
      );
    }
    
    if (!auth.isAdmin) {
      console.log('Delete charter attempt - authenticated but not admin. Auth:', auth);
      return NextResponse.json(
        { error: 'Unauthorized. Only admin users can delete charters.' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Charter ID is required' },
        { status: 400 }
      );
    }
    
    // Check if charter exists
    const existingCharter = await prisma.charter.findUnique({
      where: { id },
    });
    
    if (!existingCharter) {
      return NextResponse.json(
        { error: 'Charter not found' },
        { status: 404 }
      );
    }
    
    // Delete charter
    await prisma.charter.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Charter deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting charter:', error);
    return NextResponse.json(
      { error: 'Failed to delete charter' },
      { status: 500 }
    );
  }
} 