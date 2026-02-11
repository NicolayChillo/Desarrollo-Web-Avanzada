"use client"
import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { getMisReservas, cancelarReserva } from '@/services/api'
import { getAllHabitaciones } from '@/app/api/propertyhomes'
import { PropertyHomes } from '@/types/properyHomes'
import { Toast } from 'primereact/toast'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

interface Reserva {
  idReserva: number;
  fechaReserva: string;
  fechaInicio: string;
  fechaFin: string;
  numeroHuespedes: number;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
  total: number;
  observacion?: string;
  idUsuario: number;
  idHabitacion: number;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info')
  const [userData, setUserData] = useState<any>(null)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [habitaciones, setHabitaciones] = useState<PropertyHomes[]>([])
  const [loading, setLoading] = useState(false)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const idUsuario = localStorage.getItem('idUsuario')
    const correo = localStorage.getItem('userEmail')
    
    if (token && idUsuario) {
      setUserData({ 
        sub: correo || 'Usuario', 
        rol: userRole || 'CLIENTE',
        idUsuario: parseInt(idUsuario, 10)
      })
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'reservas') {
      cargarReservas()
    }
  }, [activeTab])

  const cargarReservas = async () => {
    setLoading(true)
    try {
      const [reservasData, habitacionesData] = await Promise.all([
        getMisReservas(),
        getAllHabitaciones()
      ])
      setReservas(reservasData)
      setHabitaciones(habitacionesData)
    } catch (error) {
      console.error('Error al cargar reservas:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar las reservas',
        life: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelarReserva = async (idReserva: number) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return
    }

    try {
      await cancelarReserva(idReserva)
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Reserva cancelada correctamente',
        life: 3000
      })
      cargarReservas() // Recargar lista
    } catch (error) {
      console.error('Error al cancelar reserva:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cancelar la reserva',
        life: 3000
      })
    }
  }

  const getHabitacionNombre = (idHabitacion: number) => {
    const habitacion = habitaciones.find(h => h.idHabitacion === idHabitacion)
    return habitacion?.name || 'Habitación'
  }

  const getHabitacionCodigo = (idHabitacion: number) => {
    const habitacion = habitaciones.find(h => h.idHabitacion === idHabitacion)
    return habitacion?.codigo || ''
  }

  const getEstadoBadge = (estado: string) => {
    const badges = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      CONFIRMADA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      CANCELADA: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
    return badges[estado as keyof typeof badges] || badges.PENDIENTE
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calcularNoches = (fechaInicio: string, fechaFin: string) => {
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const diffTime = Math.abs(fin.getTime() - inicio.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <section className="pt-44 pb-20">
      <Toast ref={toast} position="top-center" />
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <h1 className="text-4xl font-bold text-dark dark:text-white mb-8">Mi Perfil</h1>
        
        <div className="grid grid-cols-12 gap-8">
          {/* Menú lateral */}
          <div className="lg:col-span-3 col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              {/* Información del usuario */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="ph:user-circle-fill" width={60} height={60} className="text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-dark dark:text-white">{userData?.sub || 'Usuario'}</h3>
                <p className="text-sm text-dark/50 dark:text-white/50">{userData?.rol || 'Cliente'}</p>
              </div>

              {/* Opciones del menú */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex items-center gap-3 p-3 rounded-lg w-full transition-colors duration-200 ${
                    activeTab === 'info'
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-dark dark:text-white'
                  }`}
                >
                  <Icon icon="ph:user" width={20} height={20} />
                  <span className="font-medium text-sm">Información Personal</span>
                </button>

                <button
                  onClick={() => setActiveTab('reservas')}
                  className={`flex items-center gap-3 p-3 rounded-lg w-full transition-colors duration-200 ${
                    activeTab === 'reservas'
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-dark dark:text-white'
                  }`}
                >
                  <Icon icon="ph:calendar-check" width={20} height={20} />
                  <span className="font-medium text-sm">Mis Reservas</span>
                </button>

                <button
                  onClick={() => setActiveTab('configuracion')}
                  className={`flex items-center gap-3 p-3 rounded-lg w-full transition-colors duration-200 ${
                    activeTab === 'configuracion'
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-dark dark:text-white'
                  }`}
                >
                  <Icon icon="ph:gear" width={20} height={20} />
                  <span className="font-medium text-sm">Configuración</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-9 col-span-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              {activeTab === 'info' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Información Personal</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark/70 dark:text-white/70 mb-2">
                          Correo Electrónico
                        </label>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-dark dark:text-white">{userData?.sub || 'No disponible'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark/70 dark:text-white/70 mb-2">
                          Rol
                        </label>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-dark dark:text-white">{userData?.rol || 'Cliente'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-dark/60 dark:text-white/60 text-sm">
                        Sección en desarrollo. Pronto podrás editar tu información personal.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reservas' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Mis Reservas</h2>
                  
                  {loading ? (
                    <div className="text-center py-12">
                      <Icon icon="ph:spinner" width={48} height={48} className="text-primary animate-spin mx-auto mb-4" />
                      <p className="text-dark/60 dark:text-white/60">Cargando reservas...</p>
                    </div>
                  ) : reservas.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon icon="ph:calendar-check" width={64} height={64} className="text-dark/20 dark:text-white/20 mx-auto mb-4" />
                      <p className="text-dark/60 dark:text-white/60">
                        Aún no tienes reservas. Explora nuestras habitaciones y haz tu primera reserva.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reservas.map((reserva) => (
                        <div 
                          key={reserva.idReserva}
                          className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Información principal */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-xl font-semibold text-dark dark:text-white mb-1">
                                    {getHabitacionNombre(reserva.idHabitacion)}
                                  </h3>
                                  <p className="text-sm text-dark/60 dark:text-white/60">
                                    Código: {getHabitacionCodigo(reserva.idHabitacion)}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(reserva.estado)}`}>
                                  {reserva.estado}
                                </span>
                              </div>
                              
                              {/* Detalles de la reserva */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-dark/70 dark:text-white/70">
                                  <Icon icon="ph:calendar" width={18} height={18} />
                                  <span>
                                    <strong>Check-in:</strong> {formatFecha(reserva.fechaInicio)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-dark/70 dark:text-white/70">
                                  <Icon icon="ph:calendar" width={18} height={18} />
                                  <span>
                                    <strong>Check-out:</strong> {formatFecha(reserva.fechaFin)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-dark/70 dark:text-white/70">
                                  <Icon icon="ph:moon" width={18} height={18} />
                                  <span>
                                    <strong>Noches:</strong> {calcularNoches(reserva.fechaInicio, reserva.fechaFin)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-dark/70 dark:text-white/70">
                                  <Icon icon="ph:users" width={18} height={18} />
                                  <span>
                                    <strong>Huéspedes:</strong> {reserva.numeroHuespedes}
                                  </span>
                                </div>
                              </div>

                              {reserva.observacion && (
                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <p className="text-xs text-dark/60 dark:text-white/60 mb-1">
                                    <Icon icon="ph:note" className="inline mr-1" />
                                    Observación:
                                  </p>
                                  <p className="text-sm text-dark dark:text-white">{reserva.observacion}</p>
                                </div>
                              )}

                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-dark/60 dark:text-white/60">
                                    Reservado el: {formatFecha(reserva.fechaReserva)}
                                  </span>
                                  <span className="text-xl font-bold text-primary">
                                    ${reserva.total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Acciones */}
                            {reserva.estado === 'PENDIENTE' && (
                              <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-600 lg:pl-6">
                                <button
                                  onClick={() => handleCancelarReserva(reserva.idReserva)}
                                  className="w-full lg:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                  <Icon icon="ph:x-circle" width={20} height={20} />
                                  Cancelar Reserva
                                </button>
                                <p className="text-xs text-dark/50 dark:text-white/50 mt-2 text-center">
                                  En espera de confirmación
                                </p>
                              </div>
                            )}

                            {reserva.estado === 'CONFIRMADA' && (
                              <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-600 lg:pl-6">
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                  <Icon icon="ph:check-circle" width={24} height={24} />
                                  <span className="font-medium">Confirmada</span>
                                </div>
                                <p className="text-xs text-dark/50 dark:text-white/50 mt-2">
                                  ¡Nos vemos pronto!
                                </p>
                              </div>
                            )}

                            {reserva.estado === 'CANCELADA' && (
                              <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-600 lg:pl-6">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                  <Icon icon="ph:x-circle" width={24} height={24} />
                                  <span className="font-medium">Cancelada</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'configuracion' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Configuración</h2>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                      <h3 className="font-semibold text-lg text-dark dark:text-white mb-4">Preferencias de Cuenta</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-dark dark:text-white">Notificaciones por email</p>
                            <p className="text-sm text-dark/50 dark:text-white/50">Recibe actualizaciones sobre tus reservas</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-dark/60 dark:text-white/60 text-sm">
                        Más opciones de configuración estarán disponibles próximamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
