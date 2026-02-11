'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Icon } from '@iconify/react'
import { Toast } from 'primereact/toast'
import { getAllReservas, confirmarReserva, cancelarReserva } from '@/services/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://desarrollo-web-avanzada.onrender.com'

interface Reserva {
  idReserva: number
  fechaReserva: string
  fechaInicio: string
  fechaFin: string
  numeroHuespedes: number
  estado: string
  total: number
  observacion?: string
  habitacion?: {
    codigo: string
    tipoHabitacion?: {
      nombreTipo: string
    }
  }
  usuario?: {
    nombre: string
    correo: string
  }
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const toast = useRef<Toast>(null)

  useEffect(() => {
    loadReservas()
  }, [])

  const loadReservas = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllReservas()
      console.log('🔍 [RESERVAS] ===== INICIO DEBUG =====')
      console.log('🔍 [RESERVAS] Total reservas:', data.length)
      console.log('🔍 [RESERVAS] Datos completos:', JSON.stringify(data, null, 2))
      if (data.length > 0) {
        console.log('🔍 [RESERVAS] Primera reserva completa:', data[0])
        console.log('🔍 [RESERVAS] Habitación de primera reserva:', data[0].habitacion)
        console.log('🔍 [RESERVAS] Usuario de primera reserva:', data[0].usuario)
      }
      console.log('🔍 [RESERVAS] ===== FIN DEBUG =====')
      setReservas(data)
    } catch (err: any) {
      console.error('❌ [RESERVAS] Error:', err)
      setError('Error al cargar reservas. Verifica el backend.')
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmar = async (id: number) => {
    try {
      await confirmarReserva(id)
      setReservas(reservas.map(r => r.idReserva === id ? { ...r, estado: 'CONFIRMADA' } : r))
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Reserva confirmada correctamente' })
    } catch (err: any) {
      console.error(err)
      setError('Error al confirmar la reserva')
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
    }
  }

  const handleCancelar = async (id: number) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return

    try {
      await cancelarReserva(id)
      setReservas(reservas.map(r => r.idReserva === id ? { ...r, estado: 'CANCELADA' } : r))
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Reserva cancelada correctamente' })
    } catch (err: any) {
      console.error(err)
      setError('Error al cancelar la reserva')
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
    }
  }

  const getEstadoBadge = (estado: string) => {
    const badges = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      CONFIRMADA: 'bg-green-100 text-green-800',
      CANCELADA: 'bg-red-100 text-red-800',
    }
    return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const filteredReservas = reservas.filter(r => !filterEstado || r.estado === filterEstado)

  return (
    <>
      <Toast ref={toast} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reservas</h1>
            <p className="text-gray-600 mt-1">Gestiona las reservas: confirmar o cancelar</p>
          </div>
        </div>

        {/* Filtro */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Estado</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icon icon="ph:spinner" className="animate-spin text-blue-600" width={32} />
          </div>
        ) : filteredReservas.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center">
            <p className="text-gray-600">No hay reservas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservas.map(r => (
              <div key={r.idReserva} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-500">#{r.idReserva}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(r.estado)}`}>
                        {r.estado}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Habitación</p>
                        <p className="font-semibold text-gray-800">
                          {r.habitacion?.codigo || '—'} - {r.habitacion?.tipoHabitacion?.nombreTipo || 'Sin tipo'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Cliente</p>
                        <p className="font-semibold text-gray-800">{r.usuario?.nombre || r.usuario?.correo || '—'}</p>
                        <p className="text-xs text-gray-500">{r.usuario?.correo}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Fechas</p>
                        <p className="font-semibold text-gray-800">{r.fechaInicio} → {r.fechaFin}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Huéspedes</p>
                        <p className="font-semibold text-gray-800">{r.numeroHuespedes} personas</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-semibold text-blue-600 text-lg">${r.total.toFixed(2)}</p>
                      </div>

                      {r.observacion && (
                        <div>
                          <p className="text-sm text-gray-500">Observaciones</p>
                          <p className="text-sm text-gray-700">{r.observacion}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {r.estado === 'PENDIENTE' && (
                    <div className="flex flex-col gap-2 md:w-48">
                      <button
                        onClick={() => handleConfirmar(r.idReserva)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Icon icon="ph:check-circle" width={20} />
                        <span>Confirmar</span>
                      </button>
                      <button
                        onClick={() => handleCancelar(r.idReserva)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <Icon icon="ph:x-circle" width={20} />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
