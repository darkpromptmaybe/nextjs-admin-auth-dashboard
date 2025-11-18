'use client'

import { StackProvider, StackTheme } from "@stackframe/stack";

interface StackAuthWrapperProps {
  children: React.ReactNode;
}

export function StackAuthWrapper({ children }: StackAuthWrapperProps) {
  // Safely get environment variables with fallbacks
  const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
  const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

  // If Stack Auth is not configured, just render children without the provider
  if (!projectId || !publishableClientKey) {
    return <>{children}</>;
  }

  return (
    <StackProvider
      app={{
        projectId,
        publishableClientKey,
      }}
      theme={StackTheme.default}
    >
      {children}
    </StackProvider>
  );
}