'use client'

import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { getHabitaciones } from '@/services/api'
import HabitacionCard from '@/components/Admin/HabitacionCard'
import HabitacionForm from '@/components/Admin/HabitacionForm'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://desarrollo-web-avanzada.onrender.com'

interface TipoHabitacion {
  idTipoHabitacion: number
  nombreTipo: string
  capacidadMaxima: number
  precioPorNoche: number
}

interface Habitacion {
  idHabitacion: number
  codigo: string
  descripcion: string
  nBathroom: number
  capacidadMaxima: number
  precioBase: number
  estado: string
  imagen?: string
  tipoHabitacionNombre?: string
}

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingHabitacion, setEditingHabitacion] = useState<Habitacion | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const toast = useRef<Toast>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      console.debug('[ADMIN] Token presence check', { tokenPresent: !!token, tokenLength: token ? token.length : 0 })

      if (!token) {
        const msg = 'No hay token de autenticación. Por favor inicie sesión antes de crear/editar habitaciones.'
        console.error('[ADMIN] ' + msg)
        toast.current?.show({ severity: 'error', summary: 'Error', detail: msg })
        throw new Error(msg)
      }
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      }

      const [habitacionesRes, tiposRes] = await Promise.all([
        fetch(`${API_BASE_URL}/habitaciones`, { headers }),
        fetch(`${API_BASE_URL}/tipos-habitacion`, { headers }),
      ])

      if (!habitacionesRes.ok || !tiposRes.ok) {
        throw new Error('Error al cargar los datos')
      }

      const habitacionesData = await habitacionesRes.json()
      const tiposData = await tiposRes.json()

      setHabitaciones(habitacionesData)
      setTiposHabitacion(tiposData)
    } catch (err: any) {
      setError('Error al cargar los datos. Verifica que el backend esté ejecutándose.')
      console.error(err)
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingHabitacion(null)
    setShowForm(true)
  }

  const handleEdit = (habitacion: Habitacion) => {
    setEditingHabitacion(habitacion)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/habitaciones/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (!response.ok) throw new Error('Error al eliminar')

      setHabitaciones(habitaciones.filter(h => h.idHabitacion !== id))
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Habitación eliminada correctamente' })
    } catch (err: any) {
      setError('Error al eliminar la habitación')
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
      console.error(err)
    }
  }

  const handleSubmitForm = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('token')
      const url = editingHabitacion
        ? `${API_BASE_URL}/habitaciones/${editingHabitacion.idHabitacion}`
        : `${API_BASE_URL}/habitaciones`

      const response = await fetch(url, {
        method: editingHabitacion ? 'PUT' : 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      })

      console.debug('[ADMIN] Petición a habitaciones', { url, method: editingHabitacion ? 'PUT' : 'POST', tokenPresent: !!token, status: response.status })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '<no-body>')
        console.error('[ADMIN] Error al guardar habitación', { status: response.status, body: errorText })
        // Lanzar con más contexto para mostrar en UI
        throw new Error(`Error al guardar: ${response.status} ${errorText}`)
      }

      const data = await response.json()

      if (editingHabitacion) {
        setHabitaciones(habitaciones.map(h => h.idHabitacion === editingHabitacion.idHabitacion ? data : h))
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Habitación actualizada correctamente' })
      } else {
        setHabitaciones([...habitaciones, data])
        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Habitación creada correctamente' })
      }

      setShowForm(false)
      setEditingHabitacion(null)
    } catch (err: any) {
      console.error('Error al guardar:', err)
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message })
      throw new Error('Error al guardar la habitación')
    }
  }

  const filteredHabitaciones = habitaciones.filter(h => {
    const matchSearch = h.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       h.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchEstado = !filterEstado || h.estado === filterEstado
    return matchSearch && matchEstado
  })

  return (
    <>
      <Toast ref={toast} />
      <div className="p-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Habitaciones</h1>
            <p className="text-gray-600 mt-1">Gestiona las habitaciones del hotel</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold w-full md:w-auto justify-center"
          >
            <Icon icon="ph:plus" width={20} />
            Nueva Habitación
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="OCUPADA">Ocupada</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Grid de habitaciones */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icon icon="ph:spinner" className="animate-spin text-blue-600" width={32} />
          </div>
        ) : filteredHabitaciones.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">
              {habitaciones.length === 0 ? 'No hay habitaciones registradas' : 'No se encontraron resultados'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHabitaciones.map(habitacion => (
              <HabitacionCard
                key={habitacion.idHabitacion}
                habitacion={habitacion}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modal de formulario */}
        {showForm && (
          <HabitacionForm
            habitacion={editingHabitacion}
            tiposHabitacion={tiposHabitacion}
            onSubmit={handleSubmitForm}
            onCancel={() => {
              setShowForm(false)
              setEditingHabitacion(null)
            }}
          />
        )}
      </div>
    </>
  )
}
