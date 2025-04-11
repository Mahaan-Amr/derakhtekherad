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

// Function to verify and decode a JWT token (Edge compatible)
export async function verifyJwtToken(token: string): Promise<JwtPayload> {
  try {
    // Create a secret key from the JWT_SECRET
    const secretKey = stringToUint8Array(JWT_SECRET);
    
    // Verify and decode the token
    const { payload } = await jose.jwtVerify(token, secretKey);
    
    // Validate the payload has the required fields
    if (!payload.id || !payload.email || !payload.role) {
      throw new Error('Invalid token payload');
    }
    
    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as 'ADMIN' | 'TEACHER' | 'STUDENT',
      iat: payload.iat,
      exp: payload.exp
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

// Function to generate a JWT token (Edge compatible)
export async function generateJwtToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
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