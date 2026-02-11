'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Icon } from '@iconify/react'
import { getTodosUsuarios, cambiarRolUsuario, eliminarUsuario } from '@/services/api'
import { Toast } from 'primereact/toast'

interface Usuario {
  idUsuario: number
  nombre: string
  correo: string
  fechaRegistro: string
  estado: string
  rol: {
    idRol: number
    tipoRol: 'ADMINISTRADOR' | 'CLIENTE'
    descripcion: string
  }
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRol, setFilterRol] = useState<'TODOS' | 'ADMINISTRADOR' | 'CLIENTE'>('TODOS')
  const [showModal, setShowModal] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<{ id: number; nombre: string; nuevoRol: 'ADMINISTRADOR' | 'CLIENTE' } | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [usuarioToDelete, setUsuarioToDelete] = useState<{ id: number; nombre: string } | null>(null)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const data = await getTodosUsuarios()
      setUsuarios(data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los usuarios',
        life: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCambiarRol = async (idUsuario: number, nombre: string, nuevoRol: 'ADMINISTRADOR' | 'CLIENTE') => {
    setSelectedUsuario({ id: idUsuario, nombre, nuevoRol })
    setShowModal(true)
  }

  const confirmCambiarRol = async () => {
    if (!selectedUsuario) return

    try {
      await cambiarRolUsuario(selectedUsuario.id, selectedUsuario.nuevoRol)
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Rol actualizado correctamente',
        life: 3000
      })
      loadUsuarios()
    } catch (error) {
      console.error('Error al cambiar rol:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cambiar el rol del usuario',
        life: 3000
      })
    } finally {
      setShowModal(false)
      setSelectedUsuario(null)
    }
  }

  const cancelCambiarRol = () => {
    setShowModal(false)
    setSelectedUsuario(null)
  }

  const handleEliminarUsuario = (idUsuario: number, nombre: string) => {
    setUsuarioToDelete({ id: idUsuario, nombre })
    setShowDeleteModal(true)
  }

  const confirmEliminarUsuario = async () => {
    if (!usuarioToDelete) return

    try {
      await eliminarUsuario(usuarioToDelete.id)
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario eliminado correctamente',
        life: 3000
      })
      loadUsuarios()
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el usuario',
        life: 3000
      })
    } finally {
      setShowDeleteModal(false)
      setUsuarioToDelete(null)
    }
  }

  const cancelEliminarUsuario = () => {
    setShowDeleteModal(false)
    setUsuarioToDelete(null)
  }

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRol = filterRol === 'TODOS' || usuario.rol.tipoRol === filterRol
    return matchesSearch && matchesRol
  })

  const getRolBadgeColor = (tipoRol: string) => {
    switch (tipoRol) {
      case 'ADMINISTRADOR':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'CLIENTE':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="ph:spinner" className="animate-spin text-blue-600" width={48} />
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toast ref={toast} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra los roles de los usuarios del sistema</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon
                icon="ph:magnifying-glass"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                width={20}
              />
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRol('TODOS')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterRol === 'TODOS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterRol('ADMINISTRADOR')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterRol === 'ADMINISTRADOR'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Administradores
            </button>
            <button
              onClick={() => setFilterRol('CLIENTE')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterRol === 'CLIENTE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Clientes
            </button>
          </div>
        </div>
      </div>

      {filteredUsuarios.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Icon icon="ph:users" className="mx-auto mb-4 text-gray-400" width={64} />
          <p className="text-gray-600 text-lg">No se encontraron usuarios</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsuarios.map((usuario) => (
            <div
              key={usuario.idUsuario}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              <div className="bg-gray-50 h-20 border-b border-gray-100"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  <div className="bg-white rounded-full p-2 shadow-md mb-3">
                    <div className="bg-gray-100 rounded-full p-4 border-2 border-gray-200">
                      <Icon icon="ph:user" className="text-gray-600" width={40} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{usuario.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-3">{usuario.correo}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRolBadgeColor(
                      usuario.rol.tipoRol
                    )}`}
                  >
                    {usuario.rol.tipoRol}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon icon="ph:calendar" width={18} />
                    <span>Registro: {new Date(usuario.fechaRegistro).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon icon="ph:circle" width={18} className="text-green-500" />
                    <span>Estado: {usuario.estado}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cambiar rol:
                  </label>
                  <select
                    value={usuario.rol.tipoRol}
                    onChange={(e) => {
                      const nuevoRol = e.target.value as 'ADMINISTRADOR' | 'CLIENTE'
                      // Solo mostrar modal si el rol cambió
                      if (nuevoRol !== usuario.rol.tipoRol) {
                        handleCambiarRol(usuario.idUsuario, usuario.nombre, nuevoRol)
                        // Resetear el select al valor original
                        e.target.value = usuario.rol.tipoRol
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent shadow-sm"
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleEliminarUsuario(usuario.idUsuario, usuario.nombre)}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition flex items-center justify-center gap-2 font-medium shadow-sm"
                  >
                    <Icon icon="ph:trash" width={20} />
                    Eliminar usuario
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Icon icon="ph:info" width={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Total de usuarios</h3>
            <div className="flex gap-6 text-sm text-blue-800">
              <div>
                <span className="font-semibold">Total:</span> {usuarios.length}
              </div>
              <div>
                <span className="font-semibold">Administradores:</span>{' '}
                {usuarios.filter((u) => u.rol.tipoRol === 'ADMINISTRADOR').length}
              </div>
              <div>
                <span className="font-semibold">Clientes:</span>{' '}
                {usuarios.filter((u) => u.rol.tipoRol === 'CLIENTE').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-yellow-100 rounded-full p-3">
                <Icon icon="ph:warning" width={24} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Confirmar cambio de rol
                </h3>
                <p className="text-gray-600 text-sm">
                  ¿Estás seguro de que deseas cambiar el rol de{' '}
                  <span className="font-semibold">{selectedUsuario?.nombre}</span> a{' '}
                  <span className="font-semibold">{selectedUsuario?.nuevoRol}</span>?
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Esta acción modificará los permisos del usuario en el sistema.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelCambiarRol}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmCambiarRol}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium shadow-md"
              >
                Confirmar cambio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-red-100 rounded-full p-3">
                <Icon icon="ph:trash" width={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Confirmar eliminación
                </h3>
                <p className="text-gray-600 text-sm">
                  ¿Estás seguro de que deseas eliminar a{' '}
                  <span className="font-semibold">{usuarioToDelete?.nombre}</span>?
                </p>
                <p className="text-red-600 text-xs mt-2 font-medium">
                  ⚠️ Esta acción no se puede deshacer. Todos los datos del usuario serán eliminados permanentemente.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelEliminarUsuario}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEliminarUsuario}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-md"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
