import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id: number;
    username: string;
    email: string;
    role: Role;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}
