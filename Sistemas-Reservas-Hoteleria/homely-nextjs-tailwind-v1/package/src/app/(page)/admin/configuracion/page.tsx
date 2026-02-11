'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Icon } from '@iconify/react'
import { obtenerPerfil, actualizarPerfil } from '@/services/api'
import { Toast } from 'primereact/toast'

interface UsuarioPerfil {
  idUsuario: number
  nombre: string
  correo: string
  fechaRegistro: string
  estado: string
  rol: {
    idRol: number
    tipoRol: string
    descripcion: string
  }
}

export default function ConfiguracionPage() {
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: ''
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const toast = useRef<Toast>(null)

  useEffect(() => {
    loadPerfil()
  }, [])

  const loadPerfil = async () => {
    try {
      setLoading(true)
      const data = await obtenerPerfil()
      setPerfil(data)
      setFormData({
        nombre: data.nombre,
        correo: data.correo
      })
    } catch (error) {
      console.error('Error al cargar perfil:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cargar el perfil',
        life: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      await actualizarPerfil({
        nombre: formData.nombre,
        correo: formData.correo
      })
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Perfil actualizado correctamente',
        life: 3000
      })
      setEditMode(false)
      loadPerfil()
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.message || 'No se pudo actualizar el perfil',
        life: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Las contraseñas no coinciden',
        life: 3000
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La contraseña debe tener al menos 6 caracteres',
        life: 3000
      })
      return
    }

    try {
      setSaving(true)
      await actualizarPerfil({
        password: passwordData.newPassword
      })
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Contraseña actualizada correctamente',
        life: 3000
      })
      setShowPasswordModal(false)
      setPasswordData({ newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.message || 'No se pudo cambiar la contraseña',
        life: 3000
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    if (perfil) {
      setFormData({
        nombre: perfil.nombre,
        correo: perfil.correo
      })
    }
    setEditMode(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="ph:spinner" className="animate-spin text-gray-600" width={48} />
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Icon icon="ph:warning" width={48} className="mx-auto text-red-600 mb-3" />
          <p className="text-red-800">No se pudo cargar la información del perfil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toast ref={toast} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuración de Perfil</h1>
        <p className="text-gray-600">Administra tu información personal y seguridad</p>
      </div>

      {/* Card de Información Personal */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 mb-6">
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-3">
                <Icon icon="ph:user" width={24} className="text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Información Personal</h2>
                <p className="text-sm text-gray-600">Actualiza tus datos personales</p>
              </div>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2 shadow-md"
              >
                <Icon icon="ph:pencil" width={18} />
                Editar
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            {editMode ? (
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent shadow-sm"
                placeholder="Ingresa tu nombre"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium">{perfil.nombre}</p>
              </div>
            )}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            {editMode ? (
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent shadow-sm"
                placeholder="Ingresa tu correo"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-medium">{perfil.correo}</p>
              </div>
            )}
          </div>

          {/* Rol (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol en el sistema
            </label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                perfil.rol.tipoRol === 'ADMINISTRADOR' 
                  ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                  : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                {perfil.rol.tipoRol}
              </span>
            </div>
          </div>

          {/* Fecha de registro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Miembro desde
            </label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2">
              <Icon icon="ph:calendar" width={18} className="text-gray-600" />
              <p className="text-gray-800">{new Date(perfil.fechaRegistro).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>

          {/* Botones de acción (solo en modo edición) */}
          {editMode && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium shadow-md flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Icon icon="ph:spinner" className="animate-spin" width={20} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Icon icon="ph:check" width={20} />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card de Seguridad */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-full p-3">
              <Icon icon="ph:lock" width={24} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Seguridad</h2>
              <p className="text-sm text-gray-600">Administra tu contraseña</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full px-4 py-3 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Icon icon="ph:key" width={20} className="text-gray-600" />
              <span className="font-medium">Cambiar contraseña</span>
            </div>
            <Icon icon="ph:caret-right" width={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Modal de cambiar contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-100 rounded-full p-3">
                <Icon icon="ph:lock" width={24} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Cambiar contraseña</h3>
                <p className="text-sm text-gray-600">Ingresa tu nueva contraseña</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <Icon icon="ph:info" width={16} className="inline mr-1" />
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordData({ newPassword: '', confirmPassword: '' })
                }}
                disabled={saving}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium shadow-md"
              >
                {saving ? 'Guardando...' : 'Cambiar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
