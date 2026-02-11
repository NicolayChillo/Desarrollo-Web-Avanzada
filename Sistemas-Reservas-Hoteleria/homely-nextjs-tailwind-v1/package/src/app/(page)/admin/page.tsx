"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { getDashboardResumen, type DashboardResumen, type OcupacionMensual, type TopHabitacion } from '@/services/api'

export default function AdminDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardResumen | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const rol = localStorage.getItem('userRole')
    if (rol !== 'ADMINISTRADOR') {
      router.push('/home')
      return
    }

    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      const data = await getDashboardResumen()
      setDashboardData(data)
    } catch (error) {
      console.error('Error al cargar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Icon icon="ph:spinner" className="animate-spin text-blue-600" width={48} height={48} />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Error al cargar los datos del dashboard</p>
      </div>
    )
  }

  const { estadisticasGenerales, ocupacionMensual, topHabitaciones } = dashboardData

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema de reservas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Ingresos */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon icon="ph:currency-dollar" className="text-green-600" width={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">
              ${(estadisticasGenerales.totalIngresos || 0).toFixed(2)}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Ingresos Totales
          </h3>
          <p className="text-xs text-gray-500 mt-1">Reservas confirmadas</p>
        </div>

        {/* Total Reservas */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon icon="ph:calendar-check" className="text-blue-600" width={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {estadisticasGenerales.totalReservas || 0}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Total Reservas
          </h3>
          <p className="text-xs text-gray-500 mt-1">Todas las reservas</p>
        </div>

        {/* Habitaciones Disponibles */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Icon icon="ph:bed" className="text-yellow-600" width={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {estadisticasGenerales.habitacionesDisponibles || 0}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Habitaciones Disponibles
          </h3>
          <p className="text-xs text-gray-500 mt-1">Libres ahora</p>
        </div>

        {/* Porcentaje Ocupación */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Icon icon="ph:chart-line" className="text-indigo-600" width={24} />
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {(estadisticasGenerales.porcentajeOcupacion || 0).toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Ocupación
          </h3>
          <p className="text-xs text-gray-500 mt-1">Promedio general</p>
        </div>
      </div>

      {/* Gráfico de Ocupación Mensual */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon icon="ph:chart-bar" className="text-blue-600" width={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ocupación Mensual</h2>
            <p className="text-sm text-gray-600">Últimos 12 meses</p>
          </div>
        </div>

        {/* Gráfico Simple con Barras */}
        <div className="overflow-x-auto">
          <div className="flex items-end gap-3 min-w-max h-64 px-4">
            {ocupacionMensual && ocupacionMensual.length > 0 ? (
              ocupacionMensual.map((data, index) => {
                const maxHeight = 100
                const height = ((data.porcentajeOcupacion || 0) / 100) * maxHeight
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 min-w-[60px]">
                    <div className="flex flex-col items-center justify-end h-full w-full">
                      <span className="text-xs font-semibold text-gray-700 mb-1">
                        {(data.porcentajeOcupacion || 0).toFixed(0)}%
                      </span>
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400 relative group"
                        style={{ height: `${height}%`, minHeight: height > 0 ? '10px' : '0' }}
                      >
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.label}<br/>
                          {data.habitacionesOcupadas || 0} / {data.totalHabitaciones || 0} hab.
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium text-center">
                      {(data.label || '').split(' ')[0].substring(0, 3)}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-gray-500">No hay datos de ocupación disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Habitaciones Reservadas */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon icon="ph:trophy" className="text-purple-600" width={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Top Habitaciones Reservadas</h2>
            <p className="text-sm text-gray-600">Las más populares</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Posición</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Habitación</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Reservas</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ingresos</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {topHabitaciones && topHabitaciones.length > 0 ? (
                topHabitaciones.map((hab, index) => (
                  <tr key={hab.idHabitacion} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Icon icon="ph:medal-fill" className="text-yellow-500" width={20} />}
                        {index === 1 && <Icon icon="ph:medal-fill" className="text-gray-400" width={20} />}
                        {index === 2 && <Icon icon="ph:medal-fill" className="text-orange-600" width={20} />}
                        <span className="font-semibold text-gray-700">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-800">{hab.codigoHabitacion || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {hab.tipoHabitacion || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-800">{hab.cantidadReservas || 0}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-green-600">${(hab.ingresosTotales || 0).toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-gray-600">${(hab.ingresoPromedio || 0).toFixed(2)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No hay datos de habitaciones disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => router.push('/admin/habitaciones')}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition">
              <Icon icon="ph:door" className="text-blue-600 group-hover:text-white transition" width={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Gestionar Habitaciones</h3>
              <p className="text-sm text-gray-600">Ver, crear y editar habitaciones</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/admin/reservas')}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition">
              <Icon icon="ph:calendar-check" className="text-green-600 group-hover:text-white transition" width={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Gestionar Reservas</h3>
              <p className="text-sm text-gray-600">Confirmar y cancelar reservas</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/admin/usuarios')}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition">
              <Icon icon="ph:users" className="text-purple-600 group-hover:text-white transition" width={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Gestionar Usuarios</h3>
              <p className="text-sm text-gray-600">Administrar roles y permisos</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

