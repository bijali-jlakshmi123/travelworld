import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    isBlocked: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      isBlocked: boolean;
    } & DefaultSession["user"];
  }
}

// To fix Prisma Adapter type mismatches when we have custom User fields
declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: string;
    isBlocked: boolean;
  }
}
