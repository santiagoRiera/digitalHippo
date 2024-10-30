'use client'

import { User } from '@/payload-types'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

interface MobileUserNavProps {
  user: User
}

const UserAccountMobileNav= ({ user }: MobileUserNavProps) => {
  const { signOut } = useAuth()

  return (
    <div className='flex flex-col space-y-4 w-full'>
      <div className='flex flex-col space-y-3 px-2'>
        <p className='text-sm text-muted-foreground'>
          Signed in as
        </p>
        <p className='font-medium text-sm truncate'>
          {user.email}
        </p>
      </div>

      <div className='flex flex-col space-y-2'>
        <Link
          href='/sell'
          className='block px-2 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition'>
          Seller Dashboard
        </Link>
        
        <button
          onClick={signOut}
          className='block w-full text-left px-2 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition'>
          Log out
        </button>
      </div>
    </div>
  )
}

export default UserAccountMobileNav