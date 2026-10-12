import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    backendToken?: string;
    backendUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
      emailVerified: boolean;
    };
  }

  interface User extends DefaultUser {
    backendToken?: string;
    backendUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
      emailVerified: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendToken?: string;
    backendUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string;
      emailVerified: boolean;
    };
  }
}