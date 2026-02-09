'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getHabitaciones } from '@/services/api';

interface RoomCount {
  simple: number;
  doble: number;
  estudio: number;
  suite: number;
}

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [roomCounts, setRoomCounts] = useState<RoomCount>({
    simple: 0,
    doble: 0,
    estudio: 0,
    suite: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    const fetchRoomData = async () => {
      try {
        const habitaciones = await getHabitaciones();
        
        // Contar solo habitaciones DISPONIBLES por tipo
        const counts: RoomCount = {
          simple: 0,
          doble: 0,
          estudio: 0,
          suite: 0,
        };

        if (!Array.isArray(habitaciones)) {
          return;
        }

        habitaciones.forEach((habitacion: any) => {
          if (habitacion.estado?.toUpperCase() === 'DISPONIBLE') {
            const tipo = (habitacion.tipoHabitacionNombre || '').toLowerCase();
            
            if (tipo.includes('simple')) {
              counts.simple++;
            } else if (tipo.includes('doble')) {
              counts.doble++;
            } else if (tipo.includes('estudio')) {
              counts.estudio++;
            } else if (tipo.includes('suite')) {
              counts.suite++;
            }
          }
        });

        setRoomCounts(counts);
      } catch (error) {
        console.error('Error al cargar habitaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  return (
    <section className='!py-0'>
      <div className='bg-gradient-to-b from-skyblue via-lightskyblue dark:via-[#4298b0] to-white/10 dark:to-black/10 overflow-hidden relative'>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-60 md:pb-68'>
          <div className='relative text-white dark:text-dark text-center md:text-start z-10'>
            <p className='text-inherit text-xm font-medium'>Cumbaya, Pichincha</p>
            <h1 className='text-inherit text-6xl sm:text-9xl font-semibold -tracking-wider md:max-w-45p mt-4 mb-6'>
              Hotel Scalibur
            </h1>
            <div className='flex flex-col xs:flex-row justify-center md:justify-start gap-4'>
              <Link href="/contactus" className='px-8 py-4 border border-white dark:border-dark bg-white dark:bg-dark text-dark dark:text-white duration-300 dark:hover:text-dark hover:bg-transparent hover:text-white text-base font-semibold rounded-full hover:cursor-pointer'>
                Contactanos
              </Link>
            </div>
          </div>
          <div className='hidden md:block absolute -top-2 -right-68'>
            <Image
              src={'/images/hero/heroBanner.png'}
              alt='heroImg'
              width={1082}
              height={1016}
              priority={false}
              unoptimized={true}
            />
          </div>
        </div>
        <div className='md:absolute bottom-0 md:-right-68 xl:right-0 bg-white dark:bg-black py-12 px-8 mobile:px-16 md:pl-16 md:pr-[295px] rounded-2xl md:rounded-none md:rounded-tl-2xl mt-24'>
          <div className='grid grid-cols-2 sm:grid-cols-4 md:flex gap-16 md:gap-24 sm:text-center dark:text-white text-black'>
            <div className='flex flex-col sm:items-center gap-3'>
              <div className='w-[50px] h-[50px] flex items-center justify-center'>
                <Image
                  src={'/images/hero/suite.png'}
                  alt='bed'
                  width={48}
                  height={48}
                  className='block dark:hidden object-contain'
                  unoptimized={true}
                />
                <Image
                  src={'/images/hero/dark-suite.png'}
                  alt='bed'
                  width={48}
                  height={48}
                  className='hidden dark:block object-contain'
                  unoptimized={true}
                />
              </div>
              <p className='text-sm sm:text-base font-normal text-inherit' suppressHydrationWarning>
                {!mounted || loading ? '...' : `${roomCounts.suite} Suite`}
              </p>
            </div>

            <div className='flex flex-col sm:items-center gap-3'>
              <div className='w-[50px] h-[50px] flex items-center justify-center'>
                <Image
                  src={'/images/hero/estudio.png'}
                  alt='bed'
                  width={45}
                  height={30}
                  className='block dark:hidden object-contain'
                  unoptimized={true}
                />
                <Image
                  src={'/images/hero/dark-estudio.png'}
                  alt='bed'
                  width={45} 
                  height={32}
                  className='hidden dark:block object-contain'
                  unoptimized={true}
                />
              </div>
              <p className='text-sm sm:text-base font-normal text-inherit' suppressHydrationWarning>
                {!mounted || loading ? '...' : `${roomCounts.estudio} Estudio`}
              </p>
            </div>

            <div className='flex flex-col sm:items-center gap-3'>
              <div className='w-[50px] h-[50px] flex items-center justify-center'>
                <Image
                  src={'/images/hero/sofa.svg'}
                  alt='sofa'
                  width={35}
                  height={50}
                  className='block dark:hidden object-contain'
                  unoptimized={true}
                />
                <Image
                  src={'/images/hero/dark-sofa.svg'}
                  alt='sofa'
                  width={35}
                  height={50}
                  className='hidden dark:block object-contain'
                  unoptimized={true}
                />
              </div>
              <p className='text-sm sm:text-base font-normal text-inherit' suppressHydrationWarning>
                {!mounted || loading ? '...' : `${roomCounts.simple} ${roomCounts.simple === 1 ? 'Simple' : 'Simples'}`}
              </p>
            </div>

            <div className='flex flex-col sm:items-center gap-3'>
              <div className='w-[50px] h-[50px] flex items-center justify-center'>
                <Image
                  src={'/images/hero/dark.png'}
                  alt='tube'
                  width={57}
                  height={57}
                  className='block dark:hidden object-contain'
                  unoptimized={true}
                />
                <Image
                  src={'/images/hero/dark-doble.png'}
                  alt='tube'
                  width={57}
                  height={57}
                  className='hidden dark:block object-contain'
                  unoptimized={true}
                />
              </div>
              <p className='text-sm sm:text-base font-normal text-inherit' suppressHydrationWarning>
                {!mounted || loading ? '...' : `${roomCounts.doble} ${roomCounts.doble === 1 ? 'Doble' : 'Dobles'}`}
              </p>
            </div>

            <div className='flex flex-col sm:items-center gap-3'>
              <div className='w-[50px] h-[50px] flex items-center justify-center'>
                <Image
                  src={'/images/hero/parking.svg'}
                  alt='parking'
                  width={35}
                  height={35}
                  className='block dark:hidden object-contain'
                  unoptimized={true}
                />
                <Image
                  src={'/images/hero/dark-parking.svg'}
                  alt='parking'
                  width={35}
                  height={35}
                  className='hidden dark:block object-contain'
                  unoptimized={true}
                />
              </div>
              <p className='text-sm sm:text-base font-normal text-inherit'>
                Estacionamiento
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
