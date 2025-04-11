import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/options';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/db';

// Define types for our auth objects
interface AdminProfile {
  exists: boolean;
  id?: string;
}

interface SessionAuth {
  authenticated: boolean;
  id: string;
  email: string | null | undefined;
  role: string;
  adminProfile?: AdminProfile;
}

interface TokenAuth {
  authenticated: boolean;
  id: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  adminProfile?: AdminProfile;
}

interface TokenAuthError {
  authenticated: boolean;
  error: string;
}

export async function GET(request: NextRequest) {
  try {
    // Check session auth
    const session = await getServerSession(authOptions);
    let sessionAuth: SessionAuth | null = null;
    
    console.log('Checking auth status - session data:', session);
    
    if (session?.user) {
      sessionAuth = {
        authenticated: true,
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      };
      
      console.log('User authenticated via session:', session.user.email, 'role:', session.user.role);
      
      // Check if admin profile exists
      if (session.user.role === 'ADMIN') {
        const adminProfile = await prisma.admin.findFirst({
          where: { userId: session.user.id },
        });
        
        console.log('Admin profile check for session user:', adminProfile ? 'found' : 'not found');
        
        sessionAuth.adminProfile = adminProfile ? {
          exists: true,
          id: adminProfile.id,
        } : { exists: false };
      }
    } else {
      console.log('No session found');
    }
    
    // Check token auth
    let tokenAuth: TokenAuth | TokenAuthError | null = null;
    const authHeader = request.headers.get('authorization');
    const tokenCookie = request.cookies.get('token');
    
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('Found token in Authorization header');
    } else if (tokenCookie) {
      token = tokenCookie.value;
      console.log('Found token in cookies');
    } else {
      console.log('No token found in request');
    }
    
    if (token) {
      try {
        const payload = await verifyToken(token);
        tokenAuth = {
          authenticated: true,
          id: payload.id,
          email: payload.email,
          role: payload.role,
        };
        
        console.log('User authenticated via token:', payload.email, 'role:', payload.role);
        
        // Check if admin profile exists
        if (payload.role === 'ADMIN') {
          const adminProfile = await prisma.admin.findFirst({
            where: { userId: payload.id },
          });
          
          console.log('Admin profile check for token user:', adminProfile ? 'found' : 'not found');
          
          tokenAuth.adminProfile = adminProfile ? {
            exists: true,
            id: adminProfile.id,
          } : { exists: false };
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        tokenAuth = {
          authenticated: false,
          error: 'Invalid token',
        };
      }
    }
    
    // List all admin profiles in the system
    const adminProfiles = await prisma.admin.findMany({
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          }
        }
      }
    });
    
    console.log(`Found ${adminProfiles.length} admin profiles in the system`);
    
    // Check the current authentication state
    const authStatus = {
      sessionAuth,
      tokenAuth,
      cookies: request.cookies.getAll().map(c => c.name),
      adminProfiles,
    };
    
    console.log('Auth status check complete');
    
    return NextResponse.json(authStatus);
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      { error: 'Failed to check auth status' },
      { status: 500 }
    );
  }
} 