'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

interface Reserva {
  idReserva: number
  fechaReserva: string
  fechaCheckIn: string
  fechaCheckOut: string
  numHuespedes: number
  estado: string
  precioTotal: number
  habitacion: {
    codigoHabitacion: string
    tipoHabitacion: {
      nombre: string
      precioNoche: number
    }
  }
}

export default function MisReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    loadReservas()
  }, [])

  const loadReservas = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch('http://localhost:9090/reservas/mias', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setReservas(data)
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las reservas'
        })
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar las reservas'
      })
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA': return 'bg-green-100 text-green-800'
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELADA': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA': return 'ph:check-circle'
      case 'PENDIENTE': return 'ph:clock'
      case 'CANCELADA': return 'ph:x-circle'
      default: return 'ph:circle'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="ph:spinner" className="animate-spin text-4xl text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toast ref={toast} />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="mt-2 text-gray-600">Gestiona y visualiza todas tus reservas</p>
        </div>

        {reservas.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Icon icon="ph:calendar-x" className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes reservas</h3>
            <p className="text-gray-500 mb-6">Aún no has realizado ninguna reserva</p>
            <a
              href="/habitaciones"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              <Icon icon="ph:magnifying-glass" width={20} />
              Buscar Habitaciones
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reservas.map((reserva) => (
              <div key={reserva.idReserva} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {reserva.habitacion.tipoHabitacion.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Habitación {reserva.habitacion.codigoHabitacion}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getEstadoColor(reserva.estado)}`}>
                      <Icon icon={getEstadoIcon(reserva.estado)} width={14} />
                      {reserva.estado}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon icon="ph:calendar" width={18} className="text-primary" />
                      <span>Check-in: {formatDate(reserva.fechaCheckIn)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon icon="ph:calendar-check" width={18} className="text-primary" />
                      <span>Check-out: {formatDate(reserva.fechaCheckOut)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon icon="ph:users" width={18} className="text-primary" />
                      <span>{reserva.numHuespedes} huésped(es)</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ${reserva.precioTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Reservado: {formatDate(reserva.fechaReserva)}
                  </span>
                  <button className="text-primary hover:text-primary/80 transition text-sm font-medium">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
