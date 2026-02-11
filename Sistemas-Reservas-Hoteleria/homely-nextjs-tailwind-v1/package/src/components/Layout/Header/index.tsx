'use client'
import { navLinks } from '@/app/api/navlink'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import NavLink from './Navigation/NavLink'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import UserMenu from './UserMenu'
import NotificationBell from '@/components/NotificationBell'

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false)
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  const sideMenuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
      setNavbarOpen(false)
    }
  }

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    // Verificar si el usuario está logueado
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Escuchar cambios en el localStorage
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('storage', checkAuth)
    }
  }, [handleScroll])

  const isHomepage = pathname === '/'

  return (
    <header className={`fixed h-24 py-1 z-50 w-full bg-transparent transition-all duration-300 lg:px-0 px-4 ${sticky ? "top-3" : "top-0"}`}>
      <nav className={`container mx-auto max-w-8xl flex items-center justify-between py-4 duration-300 ${sticky ? "shadow-lg bg-white dark:bg-dark rounded-full top-5 px-4 " : "shadow-none top-0"}`}>
        <div className='flex justify-between items-center gap-2 w-full'>
          <div>
            <Link href='/'>
              <Image
                src={'/images/header/dark-logo.svg'}
                alt='logo'
                width={150}
                height={68}
                unoptimized={true}
                className={`${isHomepage ? sticky ? "block dark:hidden" : "hidden" : sticky ? "block dark:hidden" : "block dark:hidden"}`}
              />
              <Image
                src={'/images/header/logo.svg'}
                alt='logo'
                width={150}
                height={68}
                unoptimized={true}
                className={`${isHomepage ? sticky ? "hidden dark:block" : "block" : sticky ? "dark:block hidden" : "dark:block hidden"}`}
              />
            </Link>
          </div>
          <div className='flex items-center gap-2 sm:gap-6'>
            <button
              className='hover:cursor-pointer'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Icon
                icon={'solar:sun-bold'}
                width={32}
                height={32}
                className={`dark:hidden block ${isHomepage
                  ? sticky
                    ? 'text-dark'
                    : 'text-white'
                  : 'text-dark'
                  }`}
              />
              <Icon
                icon={'solar:moon-bold'}
                width={32}
                height={32}
                className='dark:block hidden text-white'
              />
            </button>
            <div className={`hidden md:block`}>
              <Link href='https://wa.me/593999288987?text=Hola,%20quiero%20hacer%20una%20reserva' className={`text-base text-inherit flex items-center gap-2 ${isLoggedIn ? 'border-r pr-6' : ''} ${isHomepage
                ? sticky
                  ? 'text-dark dark:text-white hover:text-primary border-dark dark:border-white'
                  : 'text-white hover:text-primary'
                : 'text-dark hover:text-primary'
                }`}
              >
                <Icon icon={'ph:phone-bold'} width={24} height={24} />
                +593 999 288 987 - Escríbenos
              </Link>
            </div>
            {isLoggedIn && (
              <>
                <div className={isHomepage ? (sticky ? 'text-dark' : 'text-white') : 'text-dark'}>
                  <NotificationBell 
                    tipo="cliente" 
                    onNavigate={(idReserva) => router.push('/reservas')}
                  />
                </div>
                <UserMenu isHomepage={isHomepage} sticky={sticky} />
                <div>
                  <button
                    onClick={() => setNavbarOpen(!navbarOpen)}
                    className={`flex items-center gap-3 p-2 sm:px-5 sm:py-3 rounded-full font-semibold hover:cursor-pointer border ${isHomepage
                      ? sticky
                        ? 'text-white bg-dark dark:bg-white dark:text-dark dark:hover:text-white dark:hover:bg-dark hover:text-dark hover:bg-white border-dark dark:border-white'
                        : 'text-dark bg-white dark:text-dark hover:bg-transparent hover:text-white border-white'
                      : 'bg-dark text-white hover:bg-transparent hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-transparent dark:hover:text-white duration-300'
                      }`}
                    aria-label='Toggle mobile menu'>
                    <span>
                      <Icon icon={'ph:list'} width={24} height={24} />
                    </span>
                    <span className='hidden sm:block'>Menu</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {
        navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
        )
      }

      <div
        ref={sideMenuRef}
        className={`fixed top-0 right-0 h-full w-full bg-gradient-to-b from-dark via-dark to-dark/95 dark:from-white dark:via-white dark:to-white/95 shadow-2xl transition-all duration-300 ease-in-out max-w-md ${navbarOpen ? 'translate-x-0' : 'translate-x-full'} z-50 overflow-auto no-scrollbar`}
      >
        <div className="flex flex-col h-full">
          {/* Header del menú */}
          <div className='p-6 border-b border-white/10 dark:border-dark/10'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-white dark:text-dark'>Menú</h2>
              <button
                onClick={() => setNavbarOpen(false)}
                aria-label='Close mobile menu'
                className='bg-white/10 dark:bg-dark/10 hover:bg-white/20 dark:hover:bg-dark/20 p-2 rounded-lg transition-colors duration-200'>
                <Icon icon="ph:x" width={24} height={24} className='text-white dark:text-dark' />
              </button>
            </div>
          </div>

          {/* Contenido del menú */}
          <nav className='flex-1 p-6'>
            <ul className='space-y-6'>
              {navLinks.map((item, index) => (
                <NavLink key={index} item={item} onClick={() => setNavbarOpen(false)} />
              ))}
            </ul>
          </nav>

          {/* Footer del menú */}
          <div className='p-6 border-t border-white/10 dark:border-dark/10 bg-white/5 dark:bg-dark/5'>
            <p className='text-sm font-semibold text-white/50 dark:text-dark/50 mb-3'>
              Contacto
            </p>
            <div className='space-y-2'>
              <Link href="#" className='flex items-center gap-2 text-sm text-white dark:text-dark hover:text-primary transition-colors duration-200'>
                <Icon icon="ph:envelope" width={18} height={18} />
                info@hotelscalibur.com
              </Link>
              <Link href="#" className='flex items-center gap-2 text-sm text-white dark:text-dark hover:text-primary transition-colors duration-200'>
                <Icon icon="ph:phone" width={18} height={18} />
                +593 985 147 2146
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header >
  )
}

export default Header
