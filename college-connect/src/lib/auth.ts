import { NextAuthOptions, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      university?: string;
      course?: string;
      branch?: string;
      semester?: string;
      subjects?: string[];
      role?: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    university?: string;
    course?: string;
    branch?: string;
    semester?: string;
    subjects?: string[];
    role?: string;
  }
}
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Hardcoded Admin Login Check
        if (
          credentials.email === "lkp95427@gmail.com" &&
          credentials.password === "Lakshay@135"
        ) {
          return {
            id: "000000000000000000000000",
            email: "lkp95427@gmail.com",
            name: "Super Admin",
            role: "admin",
          };
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        // if (!user.isVerified) {
        //   throw new Error("Please verify your email to activate your account.");
        // }

        const isMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          university: user.university,
          course: user.course,
          branch: user.branch,
          semester: user.semester,
          subjects: user.subjects,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.university = user.university;
        token.course = user.course;
        token.branch = user.branch;
        token.semester = user.semester;
        token.subjects = user.subjects;
        token.role = user.role;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.university = token.university as string;
        session.user.course = token.course as string;
        session.user.branch = token.branch as string;
        session.user.semester = token.semester as string;
        session.user.subjects = token.subjects as string[];
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_change_in_production",
  pages: {
    signIn: "/login",
  },
};
