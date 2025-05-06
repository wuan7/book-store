/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { signInSchema } from "./lib/zod";
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    error: "/auth/error",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password } = await signInSchema.parseAsync(credentials);
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser || !existingUser.password) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isValidPassword) {
          return null;
        }

        return existingUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
    
        if (existingUser && !existingUser.password) {
          // Nếu người dùng đã tồn tại nhưng chưa có mật khẩu, cho phép đăng nhập
          return true;
        }
    
        if (existingUser && existingUser.password) {
          // Nếu người dùng đã có mật khẩu, thông báo lỗi
          throw new Error("use_password_instead");
        }
    
        // Nếu người dùng chưa tồn tại trong cơ sở dữ liệu, tạo tài khoản mới
        if (!existingUser) {
          try {
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                imageUrl: user.image,
                password: null, // Không cần mật khẩu nếu đăng nhập qua Google/Facebook
                emailVerified: new Date(),
              },
            });
    
            await prisma.account.create({
              data: {
                userId: newUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: "oauth",
              },
            });
    
            return true;
          } catch (error) {
            console.error(`Error creating user with ${account.provider}:`, error);
            throw new Error("Error creating user");
          }
        }
      }
    
      return true; // Các provider khác (hoặc credentials), cho phép đăng nhập bình thường
    }
    ,

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.imageUrl;
        token.role = user.role;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name
        token.image = session.imageUrl
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.imageUrl = token.image  || '';
        session.user.role = token.role
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
});
