import { PropertyHomes } from '@/types/properyHomes'
import { getHabitacionesPorTipo } from '@/services/api'

export const getPropertyHomes = async (): Promise<PropertyHomes[]> => {
  try {
    const habitaciones = await getHabitacionesPorTipo('SIMPLE');
    
    return habitaciones.map((habitacion: any) => ({
      name: habitacion.tipoHabitacionNombre || 'Simple',
      slug: `habitacion-${habitacion.idHabitacion}`,
      codigo: habitacion.codigo || 'N/A',
      precio: habitacion.precioBase ? `$${habitacion.precioBase}` : '$0',
      capacidad: habitacion.capacidadMaxima || 1,
      baths: habitacion.nBathroom || 0,
      images: habitacion.imagen ? [{ src: habitacion.imagen }] : [{ src: '/images/placeholder.jpg' }]
    }));
  } catch (error) {
    console.error('Error al obtener habitaciones:', error);
    return [];
  }
};

// Datos de respaldo en caso de que la API no esté disponible
export const propertyHomes: PropertyHomes[] = [];
