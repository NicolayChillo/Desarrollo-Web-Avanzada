import { PropertyHomes } from '@/types/properyHomes'
import { getHabitacionesPorTipo } from '@/services/api'
import { getHabitaciones } from '@/services/api'

export const getPropertyHomes = async (tipoHabitacion): Promise<PropertyHomes[]> => {
  console.log(`Obteniendo habitaciones de tipo ${tipoHabitacion} desde la API...`);
  try {
    console.log(`Llamando a getHabitacionesPorTipo con "${tipoHabitacion}"`);
    const habitaciones = await getHabitacionesPorTipo(tipoHabitacion);
    
    return habitaciones.map((habitacion: any) => ({
      idHabitacion: habitacion.idHabitacion,
      name: habitacion.tipoHabitacionNombre,
      slug: `habitacion-${habitacion.idHabitacion}`,
      codigo: habitacion.codigo || 'N/A',
      descripcion: habitacion.descripcion || 'Sin descripción disponible',
      precio: habitacion.precioBase ? `$${habitacion.precioBase}` : '$0',
      capacidad: habitacion.capacidadMaxima,
      baths: habitacion.nBathroom || 0,
      tipoHabitacion: habitacion.tipoHabitacion || 'SIMPLE',
      images: habitacion.imagen ? [{ src: habitacion.imagen }] : [{ src: '/images/placeholder.jpg' }]
    }));
  } catch (error) {
    console.error('Error al obtener habitaciones:', error);
    return [];
  }
};

export const getAllHabitaciones = async (): Promise<PropertyHomes[]> => {
  try {
    const habitaciones = await getHabitaciones(); // Usa getHabitaciones() del api.ts
    
    return habitaciones.map((habitacion: any) => ({
      idHabitacion: habitacion.idHabitacion,
      name: habitacion.tipoHabitacionNombre || 'Sin tipo',
      slug: `habitacion-${habitacion.idHabitacion}`,
      codigo: habitacion.codigo || 'N/A',
      descripcion: habitacion.descripcion || 'Sin descripción disponible',
      precio: habitacion.precioBase ? `$${habitacion.precioBase}` : '$0',
      capacidad: habitacion.capacidadMaxima || 1,
      baths: habitacion.nBathroom || 0,
      tipoHabitacion: habitacion.tipoHabitacion || 'SIMPLE',
      images: habitacion.imagen ? [{ src: habitacion.imagen }] : [{ src: '/images/placeholder.jpg' }]
    }));
  } catch (error) {
    console.error('Error al obtener todas las habitaciones:', error);
    return [];
  }
};
