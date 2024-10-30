import { buttonVariants } from '@/components/ui/button'
import VerifyEmail from '@/components/VerifyEmail'
import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const VerifyEmailPage = ({ searchParams }: PageProps) => {
  const token = searchParams.token
  const toEmail = searchParams.to

  return (
    <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        {token && typeof token === 'string' ? (
          <div className='grid gap-6'>
            <VerifyEmail token={token} />
          </div>
        ) : (
          <div className='flex h-full flex-col items-center justify-center space-y-2'>
            <div className='relative mb-4 h-60 w-60 text-muted-foreground'>
              <Image
                src='/hippo-email-sent.png'
                fill
                alt='hippo email sent image'
              />
            </div>

            <h3 className='font-semibold text-2xl text-center'>
              Check your email to verify
              <br />
            (not really, actually)
            </h3>

            <p className='text-muted-foreground text-center mb-3'>
            It was supposed to send you a verification email (like in any real app), but to make it
              simpler, I skipped this step. 
              <br />
              <span className='font-bold'>
              You are already registered and 'verified'.
              </span>
            </p>
            
            <Link
              className={buttonVariants({ className: 'mt-7' })}
              href='/sign-in'>
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailPage
