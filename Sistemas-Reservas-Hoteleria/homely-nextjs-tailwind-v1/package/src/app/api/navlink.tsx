import { NavLinks } from '@/types/navlink'

export const navLinks: NavLinks[] = [
  { label: 'Inicio', href: '/home' },
  { 
    label: 'Habitaciones', 
    href: '/detalles',
    submenu: [
      { label: 'Simple', href: '/simple' },
      { label: 'Doble', href: '/doble' },
      { label: 'Estudio', href: '/estudio' },
      { label: 'Suite', href: '/Suite' },
    ]
  },
]
