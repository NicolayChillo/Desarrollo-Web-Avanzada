import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mis Reservas - Hotel Scalibur',
  description: 'Historial de reservas en Hotel Scalibur'
}

export default function MyReservationsPage() {
  return (
    <section className="pt-44 pb-20">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <h1 className="text-4xl font-bold text-dark dark:text-white mb-8">Mis Reservas</h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <p className="text-dark dark:text-white">Lista de reservas en desarrollo...</p>
        </div>
      </div>
    </section>
  )
}
