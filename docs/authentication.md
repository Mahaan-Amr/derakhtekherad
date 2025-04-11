# Authentication System

This document describes the authentication system implemented in the Derakhte Kherad application.

## Overview

The application implements a dual authentication system:

1. **NextAuth.js**: Server-side authentication using session management
2. **Custom JWT**: Client-side authentication using JWT tokens stored in localStorage

Users can have one of three roles:

- **Admin**: Full access to manage courses, teachers, students, and blog content
- **Teacher**: Access to manage their own courses, assignments, and quizzes
- **Student**: Access to enroll in courses, submit assignments, and take quizzes

## Implementation Details

### NextAuth.js Authentication

NextAuth.js is used for server-side authentication with session management. It provides a secure and standardized way to handle authentication in Next.js applications.

**File**: `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Define custom user and JWT types to include user roles
declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  }

  interface Session {
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Name to display on the sign-in form
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validate user credentials
        // Return user data if valid
        // Return null if invalid
      }
    })
  ],
  session: {
    // Use JWT strategy
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // Add user role to JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // Add user role to session
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as 'ADMIN' | 'TEACHER' | 'STUDENT';
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Custom JWT Authentication

The application also uses a custom JWT-based authentication system with context-based state management for client-side authentication.

**File**: `app/context/AuthContext.tsx`

```tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'ADMIN' | 'TEACHER' | 'STUDENT') => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Authentication methods for login, register, logout, etc.
  // ...

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        success,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        clearError,
        clearSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Dual Authentication in API Routes

All API routes have been updated to support both authentication methods:

```typescript
// Example API route with dual authentication
export async function POST(request: NextRequest) {
  try {
    // First try with custom token auth
    const authHeader = request.headers.get('Authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        // For demonstration, we assume any token is valid
        // In production, you would verify the token
        userId = 'demo-user-id';
      } catch (err) {
        console.error('Token verification error:', err);
      }
    }
    
    // If custom auth failed, try NextAuth
    if (!userId) {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      userId = session.user.id;
    }
    
    // Process the authenticated request
    // ...
  } catch (error) {
    // Handle errors
  }
}
```

## Client-Side Authentication in Components

Components that make API requests include the authentication token from localStorage:

```typescript
// Example component making an authenticated API request
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Get auth token from localStorage
    const authToken = localStorage.getItem('token');
    
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken || ''}`,
      },
      body: JSON.stringify(data),
    });
    
    // Process response
  } catch (error) {
    // Handle error
  }
};
```

## Middleware for Protected Routes

Route protection is implemented using Next.js middleware that checks for valid authentication tokens and enforces role-based access control. The middleware supports both authentication methods.

## Benefits of Dual Authentication

1. **Flexibility**: Supports both server-side and client-side authentication
2. **Compatibility**: Works with different frontend frameworks and environments
3. **Fallback Mechanism**: If one authentication method fails, the other can be used
4. **Progressive Enhancement**: Can gradually transition from one system to another

## Security Considerations

1. **Token Storage**: Client-side tokens are stored in localStorage, which may be vulnerable to XSS attacks
2. **Session Management**: Server-side sessions provide better security but require server state
3. **Token Expiration**: Both systems implement token expiration for security
4. **HTTPS Only**: All authentication traffic should be over HTTPS
5. **CSRF Protection**: Built-in CSRF protection in NextAuth.js

## Authentication Flow

1. **User Registration**:
   - User submits registration form with name, email, password, and role
   - Server validates the input and checks for existing users
   - Password is hashed using bcrypt
   - User record is created with the appropriate role-specific profile
   - JWT token is generated and returned to the client
   - Client stores the token in localStorage and cookies

2. **User Login**:
   - User submits email and password
   - Server validates credentials
   - JWT token is generated and returned to the client
   - Client stores the token in localStorage and cookies

3. **Password Reset**:
   - User requests password reset by providing email
   - Server generates a reset token and stores it in the database
   - User receives reset link with token (in development, token is returned in response)
   - User clicks link and enters new password
   - Server verifies token and updates password
   - User is redirected to login page

4. **Authentication State**:
   - On application load, the AuthProvider checks for a stored token
   - If a valid token exists, user information is retrieved and stored in context
   - UI updates to show authenticated state

5. **Route Protection**:
   - Middleware intercepts requests to protected routes
   - Token is verified and role is checked against requested route
   - User is redirected if unauthorized

6. **Logout**:
   - User clicks logout
   - Token is removed from localStorage and cookies
   - UI updates to show unauthenticated state

## Usage

### Using the Auth Context

```tsx
'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <button onClick={() => login('user@example.com', 'password')}>
      Login
    </button>
  );
}
```

### Protected Client Components

For components that should only be rendered for authenticated users:

```tsx
'use client';

import { useAuth } from '@/app/context/AuthContext';
import { redirect } from 'next/navigation';

export default function ProtectedComponent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return redirect('/login');
  }

  // Component content for authenticated users
}
```

### Using Password Reset Functionality

```tsx
'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function ForgotPasswordExample() {
  const { forgotPassword, isLoading, error, success } = useAuth();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Reset Password'}
      </button>
    </form>
  );
}
``` 