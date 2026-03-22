import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { SiweMessage } from "siwe"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // ── Google OAuth ─────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Email / Password ─────────────────────────────────────
    CredentialsProvider({
      id: "email-password",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })

        if (!user?.password) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          // @ts-ignore
          walletAddress: user.walletAddress ?? null,
        }
      },
    }),

    // ── Wallet / SIWE ────────────────────────────────────────
    CredentialsProvider({
      id: "siwe",
      name: "Wallet",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials?.signature) return null

        const siwe = new SiweMessage(JSON.parse(credentials.message))
        const result = await siwe.verify({ signature: credentials.signature })

        if (!result.success) return null

        const address = siwe.address.toLowerCase()

        // Upsert user by wallet address
        const user = await prisma.user.upsert({
          where: { walletAddress: address },
          update: {},
          create: {
            walletAddress: address,
            name: `${address.slice(0, 6)}...${address.slice(-4)}`,
          },
        })

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          walletAddress: address,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        // @ts-ignore — custom field
        token.walletAddress = user.walletAddress ?? null
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore — custom field
        session.user.id = token.id as string
        // @ts-ignore — custom field
        session.user.walletAddress = token.walletAddress as string | null
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
}
