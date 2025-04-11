import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

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

// GET /api/courses/modules/lessons/materials/[id] - Get a specific material
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated } = await authenticate(req);
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const materialId = params.id;
    
    // Fetch material with related data
    const material = await prisma.material.findUnique({
      where: {
        id: materialId,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            titleFa: true,
            module: {
              select: {
                id: true,
                title: true,
                titleFa: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                    titleFa: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    if (!material) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(material);
  } catch (error) {
    console.error('Error fetching material:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/modules/lessons/materials/[id] - Update a material
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated, userId } = await authenticate(req);
    
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
        { error: 'Only admins can update materials' },
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
    
    const materialId = params.id;
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['title', 'titleFa', 'type', 'url', 'lessonId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id: materialId },
    });
    
    if (!existingMaterial) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }
    
    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
    });
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Validate material type
    const validTypes = ['DOCUMENT', 'VIDEO', 'AUDIO', 'LINK', 'OTHER'];
    if (!validTypes.includes(data.type)) {
      return NextResponse.json(
        { error: `Invalid material type. Valid types are: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Update material
    const updatedMaterial = await prisma.material.update({
      where: { id: materialId },
      data: {
        title: data.title,
        titleFa: data.titleFa,
        description: data.description,
        descriptionFa: data.descriptionFa,
        type: data.type,
        url: data.url,
        lessonId: data.lessonId,
      },
    });
    
    return NextResponse.json(updatedMaterial);
  } catch (error) {
    console.error('Error updating material:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/modules/lessons/materials/[id] - Delete a material
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated, userId } = await authenticate(req);
    
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
        { error: 'Only admins can delete materials' },
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
    
    const materialId = params.id;
    
    // Check if material exists
    const existingMaterial = await prisma.material.findUnique({
      where: { id: materialId },
    });
    
    if (!existingMaterial) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }
    
    // Delete material
    await prisma.material.delete({
      where: { id: materialId },
    });
    
    return NextResponse.json(
      { message: 'Material deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 