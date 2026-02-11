'use client'

import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import NotificationBell from '@/components/NotificationBell'

interface AdminHeaderProps {
  onMenuToggle: () => void
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    setUserEmail(localStorage.getItem('userEmail') || 'Admin')
    setUserRole(localStorage.getItem('userRole') || 'ADMINISTRADOR')
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
          >
            <Icon icon="ph:list" width={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Hotel Admin</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
            <Icon icon="ph:user-circle" width={24} className="text-blue-600" />
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{userEmail}</p>
              <p className="text-xs text-gray-600">{userRole}</p>
            </div>
          </div>

          <NotificationBell 
            tipo="admin" 
            onNavigate={(idReserva) => router.push('/admin/reservas')}
          />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <Icon icon="ph:sign-out" width={20} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  )
}
