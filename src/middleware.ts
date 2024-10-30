import { NextRequest, NextResponse } from 'next/server'
import { getServerSideUser } from './lib/payload-utils'

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req
  const { user } = await getServerSideUser(cookies)

  //Si el user esta logueado, no pueden acceder el sign-in y sign-up
  if (
    user &&
    ['/sign-in', '/sign-up'].includes(nextUrl.pathname)
  ) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/`
    )
  }

  return NextResponse.next()
}
