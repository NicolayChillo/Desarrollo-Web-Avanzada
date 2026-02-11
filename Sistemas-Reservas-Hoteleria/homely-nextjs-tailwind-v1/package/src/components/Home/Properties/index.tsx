import { Icon } from '@iconify/react'
import PropertyCard from './Card/Card'
import { getAllHabitaciones } from '@/app/api/propertyhomes'

const Properties = async () => {
  const propertyHomes = await getAllHabitaciones();
  
  return (
    <section>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        <div className='mb-16 flex flex-col gap-3 '>
          <div className='flex gap-2.5 items-center justify-center'>
            <span>
              <Icon
                icon={'ph:house-simple-fill'}
                width={20}
                height={20}
                className='text-primary'
              />
            </span>
       
          </div>
          <h2 className='text-40 lg:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-11 mb-2'>
            Descubre todas nuestras habitaciones.
          </h2>
          <p className='text-xm font-normal text-black/50 dark:text-white/50 text-center'>
           Podras enconcontrar habitaciones de acuerdo a tus necesidades          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {propertyHomes.slice(0, 6).map((item, index) => (
            <div key={index} className=''>
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Properties
