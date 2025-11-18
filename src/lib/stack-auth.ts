import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    baseUrl: process.env.NEXT_PUBLIC_STACK_BASE_URL || "https://api.stack-auth.com",
  },
});

export const stackConfig = {
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
  jwksUrl: process.env.STACK_JWKS_URL!,
};