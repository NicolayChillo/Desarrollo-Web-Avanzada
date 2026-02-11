import { NavLinks } from '@/types/navlink'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'

interface NavLinkProps {
  item: NavLinks;
  onClick: () => void;
}

const roomIcons: { [key: string]: string } = {
  'Simple': 'ph:bed',
  'Doble': 'ph:bed',
  'Estudio': 'ph:house-line',
  'Suite': 'ph:crown'
}

const NavLink: React.FC<NavLinkProps> = ({ item, onClick }) => {
  const path = usePathname()
  const isActive = item.href === path

  if (item.submenu) {
    return (
      <li className='w-full'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-white dark:text-dark mb-3 flex items-center gap-2'>
            <Icon icon="ph:house" width={20} height={20} />
            {item.label}
          </h3>
          <div className='grid grid-cols-2 gap-3'>
            {item.submenu.map((subitem, index) => (
              <Link
                key={index}
                href={subitem.href}
                onClick={onClick}
                className='group bg-white/5 dark:bg-dark/5 hover:bg-white/10 dark:hover:bg-dark/10 border border-white/10 dark:border-dark/10 hover:border-primary rounded-xl p-4 transition-all duration-300 hover:scale-105'
              >
                <div className='flex flex-col items-center gap-2 text-center'>
                  <div className='w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300'>
                    <Icon 
                      icon={roomIcons[subitem.label] || 'ph:bed'} 
                      width={24} 
                      height={24} 
                      className='text-primary'
                    />
                  </div>
                  <span className='text-sm font-medium text-white/80 dark:text-dark/80 group-hover:text-white dark:group-hover:text-dark transition-colors duration-200'>
                    {subitem.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className='w-full'>
      <Link
        href={item.href}
        onClick={onClick}
        className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-primary text-white' 
            : 'text-white/70 dark:text-dark/70 hover:bg-white/10 dark:hover:bg-dark/10 hover:text-white dark:hover:text-dark'
        }`}
      >
        <Icon 
          icon="ph:house-simple" 
          width={20} 
          height={20} 
          className={isActive ? 'text-white' : 'text-white/50 dark:text-dark/50 group-hover:text-primary'}
        />
        <span className='text-lg font-medium'>{item.label}</span>
      </Link>
    </li>
  )
}

export default NavLink
