'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import { usePathname, useRouter } from 'next/navigation'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { icon: 'ph:house', label: 'Dashboard', path: '/admin' },
    { icon: 'ph:door', label: 'Habitaciones', path: '/admin/habitaciones' },
    { icon: 'ph:calendar-check', label: 'Reservas', path: '/admin/reservas' },
    { icon: 'ph:users', label: 'Usuarios', path: '/admin/usuarios' },
    { icon: 'ph:gear', label: 'Configuración', path: '/admin/configuracion' },
  ]

  const handleNavigate = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 md:justify-center">
          <h2 className="text-xl font-bold text-blue-600">Sistema Reservas</h2>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            <Icon icon="ph:x" width={20} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <button
                key={item.path}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                <Icon icon={item.icon} width={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-900">¿Necesitas ayuda?</p>
          <p className="text-xs text-blue-700 mt-1">Contacta al equipo de soporte</p>
        </div>
      </aside>
    </>
  )
}
