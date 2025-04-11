import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/db';

// This is only for development testing - remove in production
export async function GET(request: NextRequest) {
  // Check if we're in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    // Find the admin user
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@derakhtekherad.com' }
    });

    if (!admin) {
      // Admin doesn't exist, create it
      const hashedPassword = await hash('admin123', 10);
      
      const newAdmin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@derakhtekherad.com',
          password: hashedPassword,
          role: 'ADMIN',
          admin: {
            create: {}
          }
        },
        include: {
          admin: true
        }
      });

      return NextResponse.json({
        message: 'Admin user created',
        email: newAdmin.email,
        password: 'admin123'
      });
    }
    
    // Reset the admin password
    const hashedPassword = await hash('admin123', 10);
    
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashedPassword }
    });
    
    // Make sure admin has an admin profile
    const adminProfile = await prisma.admin.findFirst({
      where: { userId: admin.id }
    });
    
    if (!adminProfile) {
      await prisma.admin.create({
        data: { userId: admin.id }
      });
    }
    
    return NextResponse.json({
      message: 'Admin password reset to default',
      email: admin.email,
      password: 'admin123'
    });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    return NextResponse.json(
      { error: 'Failed to reset admin password' },
      { status: 500 }
    );
  }
} 