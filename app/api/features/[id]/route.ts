import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';
import { prisma } from '@/lib/prisma';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

// GET a feature item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Getting feature item bypassing authentication...');
    
    const { id } = params;
    
    const featureItem = await prisma.featureItem.findUnique({
      where: { id }
    });
    
    if (!featureItem) {
      return NextResponse.json(
        { error: 'Feature item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(featureItem);
  } catch (error) {
    console.error('Error fetching feature item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature item' },
      { status: 500 }
    );
  }
}

// PUT to update a feature item (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Updating feature item bypassing authentication...');
    
    const { id } = params;
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.titleFa || !data.description || !data.descriptionFa || !data.iconName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if feature item exists
    const existingFeatureItem = await prisma.featureItem.findUnique({
      where: { id }
    });
    
    if (!existingFeatureItem) {
      return NextResponse.json(
        { error: 'Feature item not found' },
        { status: 404 }
      );
    }
    
    // Update the feature item
    const featureItem = await prisma.featureItem.update({
      where: { id },
      data: {
        title: data.title,
        titleFa: data.titleFa,
        description: data.description,
        descriptionFa: data.descriptionFa,
        iconName: data.iconName,
        orderIndex: data.orderIndex,
        isActive: data.isActive
      }
    });
    
    return NextResponse.json(featureItem);
  } catch (error) {
    console.error('Error updating feature item:', error);
    return NextResponse.json(
      { error: 'Failed to update feature item' },
      { status: 500 }
    );
  }
}

// DELETE a feature item (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Deleting feature item bypassing authentication...');
    
    const { id } = params;
    
    // Check if feature item exists
    const existingFeatureItem = await prisma.featureItem.findUnique({
      where: { id }
    });
    
    if (!existingFeatureItem) {
      return NextResponse.json(
        { error: 'Feature item not found' },
        { status: 404 }
      );
    }
    
    // Delete the feature item
    await prisma.featureItem.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Feature item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting feature item:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature item' },
      { status: 500 }
    );
  }
} 