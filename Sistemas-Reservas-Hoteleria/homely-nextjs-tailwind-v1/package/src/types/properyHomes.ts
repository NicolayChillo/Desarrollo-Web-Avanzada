export type PropertyHomes = {
  idHabitacion: number
  name: string
  slug: string
  codigo: string
  descripcion: string
  precio: string
  capacidad: number
  baths: number
  tipoHabitacion: string
  images: PropertyImage[]
}

interface PropertyImage {
  src: string;
}
