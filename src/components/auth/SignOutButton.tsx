'use client'

import { signOut } from 'next-auth/react'

interface SignOutButtonProps {
  children: React.ReactNode
  className?: string
  callbackUrl?: string
}

export function SignOutButton({ 
  children, 
  className = 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium',
  callbackUrl = '/login'
}: SignOutButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl })
  }

  return (
    <button
      onClick={handleSignOut}
      className={className}
    >
      {children}
    </button>
  )
}