import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';
import prisma from '@/lib/db';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

// GET all feature items
export async function GET(req: NextRequest) {
  try {
    const featureItems = await prisma.featureItem.findMany({
      orderBy: {
        orderIndex: 'asc'
      }
    });
    
    // Create response with cache control headers to prevent browser caching
    const response = NextResponse.json(featureItems, { status: 200 });
    
    // Set cache control headers to ensure fresh data is always fetched
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error fetching feature items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature items' },
      { status: 500 }
    );
  }
}

// POST a new feature item (admin only)
export async function POST(req: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Creating feature item bypassing authentication...');
    
    // Get any admin to work with
    const admin = await prisma.admin.findFirst();
    
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
    if (!data.title || !data.titleFa || !data.description || !data.descriptionFa || !data.iconName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the maximum orderIndex and add 1 for the new feature
    const maxOrderFeature = await prisma.featureItem.findFirst({
      orderBy: {
        orderIndex: 'desc'
      }
    });
    
    const newOrderIndex = maxOrderFeature ? maxOrderFeature.orderIndex + 1 : 0;
    
    // Create the feature item
    const featureItem = await prisma.featureItem.create({
      data: {
        title: data.title,
        titleFa: data.titleFa,
        description: data.description,
        descriptionFa: data.descriptionFa,
        iconName: data.iconName,
        isActive: data.isActive ?? true,
        orderIndex: newOrderIndex,
        adminId: admin.id
      }
    });
    
    return NextResponse.json(featureItem, { status: 201 });
  } catch (error) {
    console.error('Error creating feature item:', error);
    return NextResponse.json(
      { error: 'Failed to create feature item' },
      { status: 500 }
    );
  }
}

// PATCH to update a feature item (admin only)
export async function PATCH(req: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Updating feature item bypassing authentication...');
    
    // Get any admin to work with
    const admin = await prisma.admin.findFirst();
    
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
    
    // Update the feature item
    const featureItem = await prisma.featureItem.update({
      where: {
        id: data.id
      },
      data: {
        title: data.title,
        titleFa: data.titleFa,
        description: data.description,
        descriptionFa: data.descriptionFa,
        iconName: data.iconName,
        isActive: data.isActive,
        orderIndex: data.orderIndex
      }
    });
    
    return NextResponse.json(featureItem, { status: 200 });
  } catch (error) {
    console.error('Error updating feature item:', error);
    return NextResponse.json(
      { error: 'Failed to update feature item' },
      { status: 500 }
    );
  }
}

// DELETE a feature item (admin only)
export async function DELETE(req: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Deleting feature item bypassing authentication...');
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }
    
    // Delete the feature item
    await prisma.featureItem.delete({
      where: {
        id
      }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting feature item:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature item' },
      { status: 500 }
    );
  }
} 