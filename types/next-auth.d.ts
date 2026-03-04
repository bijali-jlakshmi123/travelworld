import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isBlocked: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    isBlocked?: boolean;
  }
}
