import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

// GET a specific hero slide by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization for admin-only operations
    const session = await getServerSession(authOptions);
    
    // Debug log to check session information
    console.log('Session in hero GET[id] route:', JSON.stringify(session, null, 2));
    
    // Temporarily bypass authentication for testing
    // In production, uncomment the check below
    /*
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    */
    
    const slideId = params.id;
    
    if (!slideId) {
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }
    
    // Get the hero slide
    const heroSlide = await db.heroSlide.findUnique({
      where: {
        id: slideId
      }
    });
    
    if (!heroSlide) {
      return NextResponse.json(
        { error: 'Hero slide not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(heroSlide, { status: 200 });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slide' },
      { status: 500 }
    );
  }
}

// DELETE a hero slide by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Check if the slide exists
    const existingSlide = await db.heroSlide.findUnique({
      where: { id },
    });
    
    if (!existingSlide) {
      return NextResponse.json(
        { error: 'Hero slide not found' },
        { status: 404 }
      );
    }
    
    // Delete the slide
    await db.heroSlide.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting hero slide with ID ${params.id}:`, error);
    
    const errorMessage = error.message || 'Unknown database error';
    const errorCode = error.code || 'UNKNOWN_ERROR';
    
    return NextResponse.json(
      { 
        error: 'Failed to delete hero slide', 
        details: errorMessage,
        code: errorCode 
      },
      { status: 500 }
    );
  }
}

// PATCH to update a hero slide by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const data = await req.json();
    
    // Check if the slide exists
    const existingSlide = await db.heroSlide.findUnique({
      where: { id },
    });
    
    if (!existingSlide) {
      return NextResponse.json(
        { error: 'Hero slide not found' },
        { status: 404 }
      );
    }
    
    // Update the slide
    const updatedSlide = await db.heroSlide.update({
      where: { id },
      data: {
        title: data.title,
        titleFa: data.titleFa,
        description: data.description,
        descriptionFa: data.descriptionFa,
        imageUrl: data.imageUrl,
        buttonOneText: data.buttonOneText,
        buttonOneFa: data.buttonOneFa,
        buttonOneLink: data.buttonOneLink,
        buttonTwoText: data.buttonTwoText,
        buttonTwoFa: data.buttonTwoFa,
        buttonTwoLink: data.buttonTwoLink,
        isActive: data.isActive,
        orderIndex: data.orderIndex,
      },
    });
    
    return NextResponse.json(updatedSlide, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating hero slide with ID ${params.id}:`, error);
    
    const errorMessage = error.message || 'Unknown database error';
    const errorCode = error.code || 'UNKNOWN_ERROR';
    
    return NextResponse.json(
      { 
        error: 'Failed to update hero slide', 
        details: errorMessage,
        code: errorCode 
      },
      { status: 500 }
    );
  }
} 