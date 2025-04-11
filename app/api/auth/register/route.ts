import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateJwtToken } from '@/app/lib/auth';

// Mark route as dynamic to fix static generation error
export const dynamic = 'force-dynamic';

// Initialize with log option to fix enableTracing issue
const prisma = new PrismaClient({
  log: ['query'],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'STUDENT' } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Create profile based on role
    if (role === 'ADMIN') {
      await prisma.admin.create({
        data: {
          userId: user.id,
        },
      });
    } else if (role === 'TEACHER') {
      await prisma.teacher.create({
        data: {
          userId: user.id,
          bio: '',
        },
      });
    } else {
      await prisma.student.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Generate JWT token
    const token = await generateJwtToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 