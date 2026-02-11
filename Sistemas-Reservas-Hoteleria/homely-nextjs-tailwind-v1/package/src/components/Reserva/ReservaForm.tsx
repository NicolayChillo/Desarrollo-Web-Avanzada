"use client"
import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { createReserva } from '@/services/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface ReservaFormProps {
  onBack: () => void;
  habitacion: {
    idHabitacion: number;
    nombre: string;
    codigo: string;
    capacidad: number;
    precio: string;
  };
}

export default function ReservaForm({ onBack, habitacion }: ReservaFormProps) {
  const [fechas, setFechas] = useState<Date[] | null>(null);
  const [numeroHuespedes, setNumeroHuespedes] = useState<number>(1);
  const [observacion, setObservacion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const calculateNoches = () => {
    if (fechas && fechas[0] && fechas[1]) {
      const diffTime = Math.abs(fechas[1].getTime() - fechas[0].getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const noches = calculateNoches();
    const precioNumerico = parseFloat(habitacion.precio.replace('$', ''));
    return noches * precioNumerico;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechas || fechas.length !== 2 || !fechas[0] || !fechas[1]) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debes seleccionar fecha de inicio y fin',
        life: 3000
      });
      return;
    }

    if (numeroHuespedes < 1 || numeroHuespedes > habitacion.capacidad) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: `El número de huéspedes debe estar entre 1 y ${habitacion.capacidad}`,
        life: 3000
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debes iniciar sesión para reservar',
        life: 3000
      });
      return;
    }

    const idUsuarioStr = localStorage.getItem('idUsuario');
    if (!idUsuarioStr) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Token inválido. Por favor, inicia sesión nuevamente',
        life: 3000
      });
      return;
    }

    const idUsuario = parseInt(idUsuarioStr, 10);
    if (isNaN(idUsuario)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de usuario inválido',
        life: 3000
      });
      return;
    }

    setLoading(true);

    try {
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      await createReserva({
        idUsuario: idUsuario,
        idHabitacion: habitacion.idHabitacion,
        fechaInicio: formatDate(fechas[0]),
        fechaFin: formatDate(fechas[1]),
        numeroHuespedes,
        observacion: observacion || undefined,
      });

      toast.current?.show({
        severity: 'success',
        summary: '¡Reserva Enviada!',
        detail: 'Tu reserva ha sido enviada exitosamente. Está pendiente de confirmación por el administrador.',
        life: 6000
      });

      setFechas(null);
      setNumeroHuespedes(1);
      setObservacion('');

      setTimeout(() => {
        onBack();
      }, 3000);

    } catch (error: any) {
      let errorMessage = 'Error al crear la reserva';
      
      if (error.message.includes('no disponible en esas fechas')) {
        errorMessage = 'La habitación no está disponible en las fechas seleccionadas';
      } else if (error.message.includes('capacidad')) {
        errorMessage = 'El número de huéspedes supera la capacidad de la habitación';
      }

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const noches = calculateNoches();
  const total = calculateTotal();

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <div className="space-y-8">
        {/* Header con botón de volver */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-dark dark:text-white">Completa tu Reserva</h2>
            <p className="text-dark/60 dark:text-white/60 mt-2">
              {habitacion.nombre} - {habitacion.codigo}
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-dark dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Icon icon="ph:arrow-left" width={20} height={20} />
            <span className="font-medium">Volver</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna izquierda - Formulario */}
          <div className="lg:col-span-7 space-y-6">
            {/* Calendario */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
                <Icon icon="ph:calendar-check" width={24} height={24} className="text-primary" />
                Selecciona tus fechas
              </h3>
              <Calendar
                value={fechas}
                onChange={(e) => setFechas(e.value as Date[])}
                selectionMode="range"
                dateFormat="dd/mm/yy"
                placeholder="Fecha inicio - Fecha fin"
                minDate={minDate}
                inline
                className="w-full"
                readOnlyInput
              />
              {fechas && fechas[0] && fechas[1] && (
                <div className="mt-4 p-4 bg-primary/10 rounded-xl">
                  <p className="text-sm text-dark dark:text-white flex items-center gap-2">
                    <Icon icon="ph:moon-stars" width={18} height={18} className="text-primary" />
                    <strong>{noches}</strong> noche{noches !== 1 ? 's' : ''} seleccionada{noches !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Número de huéspedes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
                <Icon icon="ph:users" width={24} height={24} className="text-primary" />
                Número de huéspedes
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setNumeroHuespedes(Math.max(1, numeroHuespedes - 1))}
                    className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Icon icon="ph:minus-bold" width={20} height={20} className="text-primary" />
                  </button>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-dark dark:text-white">{numeroHuespedes}</p>
                    <p className="text-xs text-dark/50 dark:text-white/50">
                      de {habitacion.capacidad} máx
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNumeroHuespedes(Math.min(habitacion.capacidad, numeroHuespedes + 1))}
                    className="w-12 h-12 bg-primary/10 hover:bg-primary/20 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Icon icon="ph:plus-bold" width={20} height={20} className="text-primary" />
                  </button>
                </div>
                <div className="text-right">
                  <Icon icon="ph:users-three" width={48} height={48} className="text-primary/20" />
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-dark dark:text-white mb-4 flex items-center gap-2">
                <Icon icon="ph:note-pencil" width={24} height={24} className="text-primary" />
                Observaciones (opcional)
              </h3>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="¿Alguna solicitud especial? (hora de llegada, alergias, preferencias...)"
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-dark dark:text-white resize-none focus:ring-2 focus:ring-primary outline-none border border-gray-200 dark:border-gray-600"
                rows={4}
              />
            </div>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 shadow-2xl text-white sticky top-24">
              <h3 className="text-2xl font-bold mb-6">Resumen de Reserva</h3>
              
              <div className="space-y-4">
                {/* Habitación */}
                <div className="pb-4 border-b border-white/20">
                  <p className="text-white/70 text-sm mb-1">Habitación</p>
                  <p className="text-lg font-semibold">{habitacion.nombre}</p>
                  <p className="text-sm text-white/80">{habitacion.codigo}</p>
                </div>

                {/* Fechas */}
                {fechas && fechas[0] && fechas[1] && (
                  <div className="pb-4 border-b border-white/20">
                    <p className="text-white/70 text-sm mb-2">Estadía</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon icon="ph:calendar" width={16} height={16} />
                      <span>{fechas[0].toLocaleDateString('es-ES')}</span>
                      <Icon icon="ph:arrow-right" width={16} height={16} />
                      <span>{fechas[1].toLocaleDateString('es-ES')}</span>
                    </div>
                    <p className="text-white/80 text-sm mt-1">{noches} noche{noches !== 1 ? 's' : ''}</p>
                  </div>
                )}

                {/* Huéspedes */}
                <div className="pb-4 border-b border-white/20">
                  <p className="text-white/70 text-sm mb-1">Huéspedes</p>
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:users" width={18} height={18} />
                    <span className="text-lg font-semibold">{numeroHuespedes} persona{numeroHuespedes !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Precio */}
                <div className="pb-4 border-b border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Precio por noche</span>
                    <span className="font-semibold">{habitacion.precio}</span>
                  </div>
                  {noches > 0 && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white/70">{noches} noche{noches !== 1 ? 's' : ''}</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-3xl font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Botón de confirmar */}
              <button
                type="submit"
                disabled={loading || !fechas || fechas.length !== 2}
                className="w-full mt-6 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Icon icon="ph:circle-notch" width={24} height={24} className="animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Icon icon="ph:check-circle" width={24} height={24} />
                    Confirmar Reserva
                  </>
                )}
              </button>

              {/* Aviso */}
              <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex gap-2">
                  <Icon icon="ph:info" width={20} height={20} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-white/90">
                    Tu reserva quedará <strong>PENDIENTE</strong> hasta que el hotel lo confime. Recibirás una notificación cuando sea aprobada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
