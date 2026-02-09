export type PropertyHomes = {
  name: string
  slug: string
  codigo: string
  precio: string
  capacidad: number
  baths: number
  images: PropertyImage[]
}

interface PropertyImage {
  src: string;
}
