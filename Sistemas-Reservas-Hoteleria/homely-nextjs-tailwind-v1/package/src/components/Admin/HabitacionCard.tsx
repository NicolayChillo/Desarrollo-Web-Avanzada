'use client'

import React from 'react'
import { Icon } from '@iconify/react'

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

interface HabitacionCardProps {
  habitacion: Habitacion
  onEdit: (habitacion: Habitacion) => void
  onDelete: (id: number) => void
}

export default function HabitacionCard({ habitacion, onEdit, onDelete }: HabitacionCardProps) {
  const getEstadoBadge = (estado: string) => {
    const badges = {
      DISPONIBLE: 'bg-green-100 text-green-800',
      OCUPADA: 'bg-red-100 text-red-800',
      MANTENIMIENTO: 'bg-yellow-100 text-yellow-800',
    }
    return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar la habitación ${habitacion.codigo}?`)) {
      onDelete(habitacion.idHabitacion)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Imagen */}
      <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
        {habitacion.imagen ? (
          <img src={habitacion.imagen} alt={habitacion.codigo} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Icon icon="ph:bed" width={64} className="text-white opacity-50" />
          </div>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(habitacion.estado)}`}>
          {habitacion.estado}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800">{habitacion.codigo}</h3>
          <span className="text-sm font-semibold text-blue-600">
            ${habitacion.precioBase || 0}/noche
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{habitacion.descripcion}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Icon icon="ph:users" width={16} />
            <span>{habitacion.capacidadMaxima} personas</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon icon="ph:bathtub" width={16} />
            <span>{habitacion.nBathroom} baños</span>
          </div>
        </div>

        {habitacion.tipoHabitacionNombre && (
          <div className="mb-4">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {habitacion.tipoHabitacionNombre}
            </span>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(habitacion)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:shadow-md transition-shadow"
          >
            <Icon icon="ph:pencil-simple" width={16} />
            <span>Editar</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg border border-gray-300 hover:shadow-md transition-shadow"
          >
            <Icon icon="ph:trash" width={16} />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
