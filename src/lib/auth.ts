import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

// Helper function to check if OAuth credentials are properly configured
const isConfigured = (clientId?: string, clientSecret?: string) => {
  return clientId && clientSecret && 
         clientId !== 'your-google-client-id' && 
         clientId !== 'your-github-client-id' &&
         clientSecret !== 'your-google-client-secret' &&
         clientSecret !== 'your-github-client-secret'
}

const providers: any[] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { 
        label: 'Email', 
        type: 'email', 
        placeholder: 'admin@example.com' 
      },
      password: { 
        label: 'Password', 
        type: 'password' 
      },
    },
    async authorize(credentials) {
      // For demo purposes - replace with your own authentication logic
      if (credentials?.email === 'admin@example.com' && credentials?.password === 'admin123') {
        return {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        }
      }
      return null
    },
  }),
]

// Only add Google provider if properly configured
if (isConfigured(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  )
}

// Only add GitHub provider if properly configured
if (isConfigured(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET)) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    })
  )
}

export const authOptions: AuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // Check if user exists in database
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          
          // Create user if doesn't exist
          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
              }
            })
          } else {
            // Update user info
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                name: user.name,
                image: user.image,
              }
            })
          }
          
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)