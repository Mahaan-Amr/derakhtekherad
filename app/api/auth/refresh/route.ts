import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';

// Mark as dynamic route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Parse request body
    const data = await request.json();
    
    console.log('Token refresh request received for user:', data.email);
    
    // Validate required fields
    if (!data.userId || !data.email || !data.role) {
      console.error('Missing required fields for token refresh');
      return NextResponse.json(
        { error: 'Missing required user information' },
        { status: 400 }
      );
    }
    
    // Generate a new token
    const newToken = await generateToken({
      id: data.userId,
      email: data.email,
      role: data.role
    });
    
    console.log('New token generated successfully, length:', newToken.length);
    
    // Return the new token
    return NextResponse.json({ 
      token: newToken,
      success: true 
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
} 