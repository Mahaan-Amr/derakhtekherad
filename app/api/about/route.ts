import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';

// GET about page data
export async function GET(request: NextRequest) {
  try {
    // Use Prisma ORM to fetch about page data
    const aboutPage = await prisma.aboutPage.findFirst({
      orderBy: { createdAt: 'desc' }
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
    // Temporarily bypass authentication for development
    // const session = await getServerSession(authOptions);
    // if (!session?.user || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized - Admin access required' },
    //     { status: 401 }
    //   );
    // }

    const data = await request.json();
    
    // Get any admin to work with (for development)
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json(
        { error: 'No admin found in the system' },
        { status: 403 }
      );
    }

    // Check if about page data already exists using Prisma ORM
    const existingAboutPage = await prisma.aboutPage.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    let aboutPage;
    if (existingAboutPage) {
      // Update existing about page
      aboutPage = await prisma.aboutPage.update({
        where: { id: existingAboutPage.id },
        data: {
          titleDe: data.titleDe,
          titleFa: data.titleFa,
          storyTitleDe: data.storyTitleDe,
          storyTitleFa: data.storyTitleFa,
          storyContentDe: data.storyContentDe,
          storyContentFa: data.storyContentFa,
          storyImage: data.storyImage || null,
          missionTitleDe: data.missionTitleDe,
          missionTitleFa: data.missionTitleFa,
          missionContentDe: data.missionContentDe,
          missionContentFa: data.missionContentFa,
          valuesTitleDe: data.valuesTitleDe,
          valuesTitleFa: data.valuesTitleFa,
          value1TitleDe: data.value1TitleDe,
          value1TitleFa: data.value1TitleFa,
          value1ContentDe: data.value1ContentDe,
          value1ContentFa: data.value1ContentFa,
          value2TitleDe: data.value2TitleDe,
          value2TitleFa: data.value2TitleFa,
          value2ContentDe: data.value2ContentDe,
          value2ContentFa: data.value2ContentFa,
          value3TitleDe: data.value3TitleDe,
          value3TitleFa: data.value3TitleFa,
          value3ContentDe: data.value3ContentDe,
          value3ContentFa: data.value3ContentFa,
          adminId: admin.id,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new about page
      aboutPage = await prisma.aboutPage.create({
        data: {
          titleDe: data.titleDe,
          titleFa: data.titleFa,
          storyTitleDe: data.storyTitleDe,
          storyTitleFa: data.storyTitleFa,
          storyContentDe: data.storyContentDe,
          storyContentFa: data.storyContentFa,
          storyImage: data.storyImage || null,
          missionTitleDe: data.missionTitleDe,
          missionTitleFa: data.missionTitleFa,
          missionContentDe: data.missionContentDe,
          missionContentFa: data.missionContentFa,
          valuesTitleDe: data.valuesTitleDe,
          valuesTitleFa: data.valuesTitleFa,
          value1TitleDe: data.value1TitleDe,
          value1TitleFa: data.value1TitleFa,
          value1ContentDe: data.value1ContentDe,
          value1ContentFa: data.value1ContentFa,
          value2TitleDe: data.value2TitleDe,
          value2TitleFa: data.value2TitleFa,
          value2ContentDe: data.value2ContentDe,
          value2ContentFa: data.value2ContentFa,
          value3TitleDe: data.value3TitleDe,
          value3TitleFa: data.value3TitleFa,
          value3ContentDe: data.value3ContentDe,
          value3ContentFa: data.value3ContentFa,
          adminId: admin.id,
        },
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
    // Temporarily bypass authentication for development
    // const session = await getServerSession(authOptions);
    // if (!session?.user || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized - Admin access required' },
    //     { status: 401 }
    //   );
    // }

    // Delete all about page data using Prisma ORM
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