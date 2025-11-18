'use client';

import { useSession, signIn } from 'next-auth/react';

interface AuthButtonProps {
  className?: string;
}

export function AuthButton({ className = '' }: AuthButtonProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <button disabled className={`${className} opacity-50 cursor-not-allowed`}>
        Loading...
      </button>
    );
  }

  if (session) {
    return null; // Don't show sign in button if already authenticated
  }

  return (
    <button
      onClick={() => signIn()}
      className={className}
    >
      Sign In
    </button>
  );
}