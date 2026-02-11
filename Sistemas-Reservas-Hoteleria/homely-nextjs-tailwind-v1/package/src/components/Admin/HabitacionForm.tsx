'use client'

import React, { useState } from 'react'
import { Icon } from '@iconify/react'

interface TipoHabitacion {
  idTipoHabitacion: number
  nombreTipo: string
  capacidadMaxima?: number
  precioPorNoche?: number
}

interface Habitacion {
  idHabitacion?: number
  codigo: string
  descripcion: string
  numeroBanos: number
  estado: string
  tipoHabitacion?: TipoHabitacion
  imagen?: string
}

interface HabitacionFormProps {
  habitacion?: Habitacion | null
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
}

const tiposHabitacionEstaticos = [
  { id: 1, nombre: 'Simple' },
  { id: 2, nombre: 'Doble' },
  { id: 7, nombre: 'Suite' },
  { id: 8, nombre: 'Estudio' },
]

export default function HabitacionForm({ habitacion, onSubmit, onCancel }: HabitacionFormProps) {
  const [formData, setFormData] = useState({
    codigo: habitacion?.codigo || '',
    descripcion: habitacion?.descripcion || '',
    numeroBanos: habitacion?.numeroBanos || 1,
    estado: habitacion?.estado || 'DISPONIBLE',
    idTipoHabitacion: habitacion?.tipoHabitacion?.idTipoHabitacion || '',
    imagen: null as File | null,
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(habitacion?.imagen || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numeroBanos' || name === 'idTipoHabitacion' ? (value ? parseInt(value) : '') : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const form = new FormData()
      form.append('codigo', formData.codigo)
      form.append('descripcion', formData.descripcion)
      form.append('nBathroom', formData.numeroBanos.toString())
      form.append('estado', formData.estado)
      form.append('idTipoHabitacion', formData.idTipoHabitacion.toString())

      if (formData.imagen) {
        form.append('imagen', formData.imagen)
      }

      await onSubmit(form)
    } catch (err: any) {
      setError(err.message || 'Error al procesar el formulario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {habitacion ? 'Editar Habitación' : 'Nueva Habitación'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <Icon icon="ph:x" width={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Código <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: HAB-001"
              />
            </div>

            {/* Tipo de Habitación */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Habitación <span className="text-red-500">*</span>
              </label>
              <select
                name="idTipoHabitacion"
                value={formData.idTipoHabitacion}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar tipo...</option>
                {tiposHabitacionEstaticos.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe los detalles de la habitación..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número de Baños */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Baños <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="numeroBanos"
                value={formData.numeroBanos}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DISPONIBLE">Disponible</option>
                <option value="OCUPADA">Ocupada</option>
                <option value="MANTENIMIENTO">Mantenimiento</option>
              </select>
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imagen {!habitacion && <span className="text-red-500">*</span>}
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  name="imagen"
                  onChange={handleImageChange}
                  accept="image/*"
                  required={!habitacion}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {!habitacion && <p className="text-xs text-gray-500 mt-1">Requerido para nuevas habitaciones</p>}
              </div>
              {previewUrl && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Guardando...' : habitacion ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
