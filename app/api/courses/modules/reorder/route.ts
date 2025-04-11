import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

interface ModuleOrderItem {
  id: string;
  orderIndex: number;
}

// PUT /api/courses/modules/reorder - Update module order
export async function PUT(req: Request) {
  try {
    // Authentication check
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
    
    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can reorder modules' },
        { status: 403 }
      );
    }
    
    // Check for admin profile
    const adminProfile = await prisma.admin.findFirst({
      where: { userId: user.id }
    });
    
    if (!adminProfile) {
      return NextResponse.json(
        { error: 'Admin profile not found' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const data = await req.json();
    
    // Validate required fields
    if (!data.courseId || !data.modules || !Array.isArray(data.modules)) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId and modules array' },
        { status: 400 }
      );
    }
    
    // Validate course exists
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Update module order indices
    const updates = data.modules.map((item: ModuleOrderItem) => 
      prisma.courseModule.update({
        where: { id: item.id },
        data: { orderIndex: item.orderIndex },
      })
    );
    
    await prisma.$transaction(updates);
    
    // Fetch updated modules with new order
    const updatedModules = await prisma.courseModule.findMany({
      where: { courseId: data.courseId },
      orderBy: { orderIndex: 'asc' },
    });
    
    return NextResponse.json({
      message: 'Module order updated successfully',
      modules: updatedModules,
    });
  } catch (error) {
    console.error('Error reordering modules:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 