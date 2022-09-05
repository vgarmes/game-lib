import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../server/prisma';
import { verifyPassword } from '../../../utils/auth';

export const nextAuthOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            name: credentials?.username,
          },
        });

        if (!user) {
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return { id: user.id, name: user.name, role: user.role };
      },
    }),
  ],
};

export default NextAuth(nextAuthOptions);
