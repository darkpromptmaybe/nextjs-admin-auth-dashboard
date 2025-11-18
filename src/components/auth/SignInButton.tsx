'use client'

import { signIn } from 'next-auth/react'

interface SignInButtonProps {
  provider?: string
  children: React.ReactNode
  className?: string
}

export function SignInButton({ 
  provider = 'credentials', 
  children, 
  className = 'bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium' 
}: SignInButtonProps) {
  const handleSignIn = () => {
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <button
      onClick={handleSignIn}
      className={className}
    >
      {children}
    </button>
  )
}