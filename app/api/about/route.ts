import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';

// GET about page data
export async function GET(request: NextRequest) {
  try {
    const aboutPage = await prisma.aboutPage.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!aboutPage) {
      return NextResponse.json(
        { error: 'About page data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(aboutPage);
  } catch (error) {
    console.error('Error fetching about page data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about page data' },
      { status: 500 }
    );
  }
}

// POST/PUT about page data (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Get any admin to work with (for development)
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json(
        { error: 'No admin found in the system' },
        { status: 403 }
      );
    }

    // Check if about page data already exists
    const existingAboutPage = await prisma.aboutPage.findFirst();
    
    let aboutPage;
    if (existingAboutPage) {
      // Update existing about page
      aboutPage = await prisma.aboutPage.update({
        where: { id: existingAboutPage.id },
        data: {
          ...data,
          adminId: admin.id,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new about page
      aboutPage = await prisma.aboutPage.create({
        data: {
          ...data,
          adminId: admin.id
        }
      });
    }

    return NextResponse.json(aboutPage);
  } catch (error) {
    console.error('Error updating about page data:', error);
    return NextResponse.json(
      { error: 'Failed to update about page data' },
      { status: 500 }
    );
  }
}

// DELETE about page data (admin only) - resets to defaults
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Delete all about page data
    await prisma.aboutPage.deleteMany();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting about page data:', error);
    return NextResponse.json(
      { error: 'Failed to delete about page data' },
      { status: 500 }
    );
  }
} 