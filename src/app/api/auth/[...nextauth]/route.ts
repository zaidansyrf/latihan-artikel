import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // Pastikan path ini sesuai dengan file prisma.ts lu

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  session: { 
    strategy: "jwt" as const,
  },
  callbacks: {
    // Fungsi ini gunanya untuk memasukkan ID user dari database ke dalam session
    session: async ({ session, token }: any) => {
      if (session?.user) {
        session.user.id = token.sub; 
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };