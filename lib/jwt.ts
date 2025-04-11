import * as jose from 'jose';

// Get the JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define the structure of the JWT token payload
export interface JwtPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  iat?: number;
  exp?: number;
}

// Convert string to Uint8Array for jose
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Function to verify a JWT token
export async function verifyToken(token: string): Promise<JwtPayload> {
  try {
    // Remove 'Bearer ' prefix if present
    const tokenValue = token.startsWith('Bearer ') ? token.substring(7) : token;
    
    console.log('JWT verification - Token length:', tokenValue.length);
    
    // Decode the token without verification to inspect payload
    try {
      const parts = tokenValue.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('JWT payload before verification:', {
          id: payload.id,
          email: payload.email,
          exp: payload.exp,
          iat: payload.iat
        });
        
        // Check expiration
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          const timeLeft = payload.exp - now;
          console.log(`Token expires in ${timeLeft} seconds (${timeLeft / 60} minutes)`);
          if (timeLeft <= 0) {
            console.log('TOKEN IS EXPIRED - should fail verification');
          }
        }
      }
    } catch (decodeError) {
      console.error('Failed to decode token for inspection:', decodeError);
    }
    
    // Create a secret key from the JWT_SECRET
    const secretKey = stringToUint8Array(JWT_SECRET);
    
    // Verify and decode the token
    console.log('Attempting JWT verification with jose');
    const { payload } = await jose.jwtVerify(tokenValue, secretKey);
    console.log('JWT verification successful');
    
    // Validate the payload has the required fields
    if (!payload.id || !payload.email || !payload.role) {
      console.log('Invalid token payload - missing required fields');
      throw new Error('Invalid token payload');
    }
    
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as 'ADMIN' | 'TEACHER' | 'STUDENT',
      iat: payload.iat,
      exp: payload.exp
    };
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    if (error.code) {
      console.error('JWT Error code:', error.code);
    }
    throw error; // Rethrow to let the calling function handle it
  }
}

// Function to generate a JWT token
export async function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
  // Create a secret key from the JWT_SECRET
  const secretKey = stringToUint8Array(JWT_SECRET);
  
  // Create a JWT that expires in 24 hours
  const jwt = await new jose.SignJWT({
    id: payload.id,
    email: payload.email,
    role: payload.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
    
  return jwt;
} 