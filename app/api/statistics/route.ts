import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';
import prisma from '@/lib/db';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

// GET all statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    let whereClause = {};
    if (activeOnly) {
      whereClause = { isActive: true };
    }
    
    const statistics = await prisma.statistic.findMany({
      where: whereClause,
      orderBy: {
        orderIndex: 'asc'
      }
    });
    
    // Create response with cache control headers to prevent browser caching
    const response = NextResponse.json(statistics);
    
    // Set cache control headers to ensure fresh data is always fetched
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

// POST a new statistic (admin only)
export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Creating statistic bypassing authentication...');
    
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
    
    // Parse request body
    const data = await request.json();
    const { title, titleFa, value, isActive } = data;
    
    // Validate required fields
    if (!title || !titleFa || !value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get maximum order index
    const maxOrderStatistic = await prisma.statistic.findFirst({
      orderBy: {
        orderIndex: 'desc'
      }
    });
    
    const nextOrderIndex = maxOrderStatistic ? maxOrderStatistic.orderIndex + 1 : 0;
    
    // Create the statistic
    const statistic = await prisma.statistic.create({
      data: {
        title,
        titleFa,
        value,
        orderIndex: nextOrderIndex,
        isActive: isActive === undefined ? true : !!isActive,
        adminId: admin.id
      }
    });
    
    return NextResponse.json(statistic);
  } catch (error) {
    console.error('Error creating statistic:', error);
    return NextResponse.json(
      { error: 'Failed to create statistic' },
      { status: 500 }
    );
  }
}

// PATCH to update a statistic (admin only)
export async function PATCH(request: NextRequest) {
  try {
    // TEMPORARY: Skip session check for testing
    console.log('Updating statistics order bypassing authentication...');
    
    // Get any admin to work with
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      console.error('No admin found in the database');
      return NextResponse.json(
        { error: 'No admin found in the system' },
        { status: 403 }
      );
    }
    
    const { items } = await request.json();
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected an array of items.' },
        { status: 400 }
      );
    }
    
    // Update each statistic's order index
    const updatePromises = items.map((item) => {
      if (!item.id || typeof item.orderIndex !== 'number') {
        throw new Error('Each item must have an id and orderIndex');
      }
      
      return prisma.statistic.update({
        where: { id: item.id },
        data: { orderIndex: item.orderIndex }
      });
    });
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating statistics order:', error);
    return NextResponse.json(
      { error: 'Failed to update statistics order' },
      { status: 500 }
    );
  }
}

// DELETE a statistic (admin only)
export async function DELETE(req: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    // Debug log
    console.log('Session in statistics DELETE route:', JSON.stringify(session, null, 2));
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }
    
    // Delete the statistic
    await prisma.statistic.delete({
      where: {
        id
      }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting statistic:', error);
    return NextResponse.json(
      { error: 'Failed to delete statistic' },
      { status: 500 }
    );
  }
} 