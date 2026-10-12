import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

console.log(' NextAuth config:');
console.log('  CLIENT_ID:', process.env.GOOGLE_CLIENT_ID?.slice(0, 25) || 'MISSING');
console.log('  CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'MISSING');
console.log('  AUTH_SECRET:', process.env.AUTH_SECRET ? 'set' : 'MISSING');

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return false;
      if (!user.email) return false;

      try {
        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account.providerAccountId,
          }),
        });

        if (!res.ok) {
          console.error('Backend google auth failed:', await res.text());
          return false;
        }

        const data = await res.json();
        user.backendToken = data.token;
        user.backendUser = data.user;
        return true;
      } catch (err) {
        console.error('Google sign-in fetch error:', err);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.backendUser = user.backendUser;
      }
      return token;
    },
    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.backendUser = token.backendUser;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.AUTH_SECRET,
});