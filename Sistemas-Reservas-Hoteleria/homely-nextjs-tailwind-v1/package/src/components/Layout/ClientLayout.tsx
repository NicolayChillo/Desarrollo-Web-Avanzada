'use client'

import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    )
  }

  return (
    <SessionProvider>
      <div className="bg-white dark:bg-black">
        <Header />
        {children}
        <Footer />
      </div>
    </SessionProvider>
  )
}
