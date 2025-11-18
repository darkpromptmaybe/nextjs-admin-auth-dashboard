'use client'

import { useSession } from 'next-auth/react'
import { SignInButton } from './SignInButton'
import { SignOutButton } from './SignOutButton'

interface AuthButtonProps {
  className?: string
}

export function AuthButton({ className }: AuthButtonProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className={className}>
        <div className="animate-pulse bg-gray-200 h-9 w-20 rounded"></div>
      </div>
    )
  }

  if (session) {
    return (
      <SignOutButton className={className}>
        Sign Out
      </SignOutButton>
    )
  }

  return (
    <SignInButton className={className}>
      Sign In
    </SignInButton>
  )
}