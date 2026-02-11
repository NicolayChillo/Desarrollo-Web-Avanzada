'use client'

import { useEffect, useState, useRef } from 'react'
import { Icon } from '@iconify/react'

interface Notificacion {
  idReserva: number
  mensaje: string
  tipo: 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE'
  fecha: string
  habitacionCodigo: string
  clienteNombre?: string
}

interface NotificationBellProps {
  tipo: 'cliente' | 'admin'
  onNavigate?: (idReserva: number) => void
}

export default function NotificationBell({ tipo, onNavigate }: NotificationBellProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [noLeidas, setNoLeidas] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadNotificaciones()
    // Actualizar cada 30 segundos
    const interval = setInterval(loadNotificaciones, 30000)
    return () => clearInterval(interval)
  }, [tipo])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotificaciones = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const endpoint = tipo === 'admin' 
        ? 'http://localhost:8080/api/notificaciones/admin'
        : 'http://localhost:8080/api/notificaciones/cliente'

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNotificaciones(data.notificaciones)
        setNoLeidas(data.noLeidas)
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error)
    }
  }

  const getTipoColor = (tipoNotif: string) => {
    switch (tipoNotif) {
      case 'CONFIRMADA': return 'text-green-600 bg-green-100'
      case 'CANCELADA': return 'text-red-600 bg-red-100'
      case 'PENDIENTE': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha)
    const ahora = new Date()
    const diff = ahora.getTime() - date.getTime()
    const minutos = Math.floor(diff / 60000)
    
    if (minutos < 60) return `Hace ${minutos}m`
    const horas = Math.floor(minutos / 60)
    if (horas < 24) return `Hace ${horas}h`
    const dias = Math.floor(horas / 24)
    return `Hace ${dias}d`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition"
        aria-label="Notificaciones"
      >
        <Icon icon="ph:bell" width={24} height={24} />
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Notificaciones</h3>
            {noLeidas > 0 && (
              <p className="text-xs text-gray-500 mt-1">{noLeidas} sin leer</p>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notificaciones.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Icon icon="ph:bell-slash" className="mx-auto mb-2" width={48} height={48} />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notificaciones.map((notif, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onNavigate?.(notif.idReserva)
                    setIsOpen(false)
                  }}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getTipoColor(notif.tipo)}`}>
                      <Icon
                        icon={
                          notif.tipo === 'CONFIRMADA' ? 'ph:check-circle' :
                          notif.tipo === 'CANCELADA' ? 'ph:x-circle' :
                          'ph:clock'
                        }
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {notif.mensaje}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Habitación {notif.habitacionCodigo}
                        {notif.clienteNombre && ` - ${notif.clienteNombre}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatFecha(notif.fecha)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
