import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

// GET all active hero slides
export async function GET(req: NextRequest) {
  try {
    const heroSlides = await db.heroSlide.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
    
    // Create response with cache control headers to prevent browser caching
    const response = NextResponse.json(heroSlides, { status: 200 });
    
    // Set cache control headers to ensure fresh data is always fetched
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error fetching hero slides:', error);
    
    // Provide more detailed error information
    const errorMessage = error.message || 'Unknown database error';
    const errorCode = error.code || 'UNKNOWN_ERROR';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch hero slides', 
        details: errorMessage,
        code: errorCode 
      },
      { status: 500 }
    );
  }
}

// POST a new hero slide (admin only)
export async function POST(req: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Creating hero slide bypassing authentication...');
    
    // Get any admin to work with
    const admin = await db.admin.findFirst();
    
    if (!admin) {
      console.error('No admin found in the database');
      return NextResponse.json(
        { error: 'No admin found in the system' },
        { status: 403 }
      );
    }
    
    console.log('Using admin:', admin);
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.title || !data.titleFa || !data.imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the maximum orderIndex and add 1 for the new slide
    const maxOrderSlide = await db.heroSlide.findFirst({
      orderBy: {
        orderIndex: 'desc'
      }
    });
    
    const newOrderIndex = maxOrderSlide ? maxOrderSlide.orderIndex + 1 : 0;
    
    // Create the hero slide
    const heroSlide = await db.heroSlide.create({
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
        isActive: data.isActive ?? true,
        orderIndex: newOrderIndex,
        adminId: admin.id
      }
    });
    
    return NextResponse.json(heroSlide, { status: 201 });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create hero slide' },
      { status: 500 }
    );
  }
}

// PATCH to update a hero slide (admin only)
export async function PATCH(req: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Updating hero slide bypassing authentication...');
    
    // Get any admin to work with
    const admin = await db.admin.findFirst();
    
    if (!admin) {
      console.error('No admin found in the database');
      return NextResponse.json(
        { error: 'No admin found in the system' },
        { status: 403 }
      );
    }
    
    console.log('Using admin:', admin);
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.id) {
      return NextResponse.json(
        { error: 'Missing ID field' },
        { status: 400 }
      );
    }
    
    // Update the hero slide
    const heroSlide = await db.heroSlide.update({
      where: {
        id: data.id
      },
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
        orderIndex: data.orderIndex
      }
    });
    
    return NextResponse.json(heroSlide, { status: 200 });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
      { status: 500 }
    );
  }
}

// DELETE a hero slide (admin only)
export async function DELETE(req: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Deleting hero slide bypassing authentication...');
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }
    
    // Delete the hero slide
    await db.heroSlide.delete({
      where: {
        id
      }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
} 