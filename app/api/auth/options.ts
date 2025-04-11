import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import type { User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { NextAuthOptions } from 'next-auth';
import type { DefaultSession } from 'next-auth';

// Extend the User type to include role
interface CustomUser extends User {
  role: string;
}

// Extend the JWT type
interface CustomJWT extends JWT {
  role?: string;
}

// Add type definitions via module augmentation
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}

// Initialize with log option to fix enableTracing issue
const prisma = new PrismaClient({
  log: ['query'],
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        } as CustomUser;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as CustomUser).role;
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}; 