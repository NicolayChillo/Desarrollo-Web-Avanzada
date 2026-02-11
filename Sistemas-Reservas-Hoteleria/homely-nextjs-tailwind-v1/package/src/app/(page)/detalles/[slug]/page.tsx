"use client"
import React, { useState, useEffect, useRef } from 'react';
import { getAllHabitaciones } from '@/app/api/propertyhomes';
import { useParams } from "next/navigation";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyHomes } from '@/types/properyHomes';
import ReservaForm from '@/components/Reserva/ReservaForm';

export default function Details() {
    const { slug } = useParams();
    const [item, setItem] = useState<PropertyHomes | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReservaForm, setShowReservaForm] = useState(false);
    const reservaFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHabitacion = async () => {
            try {
                const habitaciones = await getAllHabitaciones();
                const found = habitaciones.find((h) => h.slug === slug);
                setItem(found || null);
            } catch (error) {
                console.error('Error al cargar habitación:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHabitacion();
    }, [slug]);

    // Scroll automático al formulario de reserva
    useEffect(() => {
        if (showReservaForm && reservaFormRef.current) {
            setTimeout(() => {
                reservaFormRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    }, [showReservaForm]);

    if (loading) {
        return (
            <section className="pt-44 pb-20 relative">
                <div className="container mx-auto text-center">
                    <p className="text-xl text-dark dark:text-white">Cargando detalles...</p>
                </div>
            </section>
        );
    }

    if (!item) {
        return (
            <section className="pt-44 pb-20 relative">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold text-dark dark:text-white mb-4">Habitación no encontrada</h1>
                    <Link href="/detalles" className="text-primary underline">Volver a habitaciones</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="pt-44 pb-20 relative" >
            <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
                <div className="mb-8">
                    <h1 className='lg:text-52 text-40 font-semibold text-dark dark:text-white'>{item?.name}</h1>
                </div>
                <div className="grid grid-cols-12 gap-8">
                    <div className="lg:col-span-8 col-span-12">
                        {item?.images && item?.images[0] && (
                            <div className="">
                                <Image
                                    src={item.images[0]?.src}
                                    alt="Main Property Image"
                                    width={400}
                                    height={500}
                                    className="rounded-2xl w-full h-540"
                                    unoptimized={true}
                                />
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-4 col-span-12">
                        <div className='flex flex-col gap-6'>
                            <div className='flex items-center gap-4 border-b border-black/10 dark:border-white/20 pb-4'>
                                <Icon icon={'solar:bed-linear'} width={24} height={24} className="text-primary" />
                                <p className='text-base font-normal text-black dark:text-white'>
                                    {item?.capacidad} Máximo de personas
                                </p>
                            </div>
                            <div className='flex items-center gap-4 border-b border-black/10 dark:border-white/20 pb-4'>
                                <Icon icon={'solar:bath-linear'} width={24} height={24} className="text-primary" />
                                <p className='text-base font-normal text-black dark:text-white'>
                                    {item?.baths} Baños
                                </p>
                            </div>
                            <div className='flex items-center gap-4 border-b border-black/10 dark:border-white/20 pb-4'>
                                <Icon icon={'ph:tag'} width={24} height={24} className="text-primary" />
                                <p className='text-base font-normal text-black dark:text-white'>
                                    {item?.codigo}
                                </p>
                            </div>
                        </div>
                        <br />  
                        <br /> 
                        <br />
                        <div className="bg-primary/10 p-8 rounded-2xl relative z-10 overflow-hidden mt-6">
                            <h4 className='text-dark text-3xl font-medium dark:text-white'>
                                {item?.precio}
                            </h4>
                            <p className='text-sm text-dark/50 dark:text-white'>Precio por día</p>
                            <button 
                                onClick={() => setShowReservaForm(true)}
                                className='py-4 px-8 bg-primary text-white rounded-full w-full block text-center hover:bg-dark duration-300 text-base mt-8 hover:cursor-pointer'
                            >
                               Reservar
                            </button>
                            <div className="absolute right-0 top-4 -z-1">
                                <Image src="/images/properties/vector.svg" width={400} height={500} alt="vector" unoptimized={true} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Imágenes pequeñas y galería - solo visible cuando NO está en modo reserva */}
                    {!showReservaForm && (
                        <>
                            <div className="lg:col-span-4 col-span-6">
                                {item?.images && item?.images[1] && (
                                    <Image src={item.images[1]?.src} alt="Property Image 2" width={400} height={500} className="rounded-2xl w-full h-full" unoptimized={true} />
                                )}
                            </div>
                            <div className="lg:col-span-4 col-span-6">
                                {item?.images && item?.images[2] && (
                                    <Image src={item.images[2]?.src} alt="Property Image 3" width={400} height={500} className="rounded-2xl w-full h-full" unoptimized={true} />
                                )}
                            </div>
                            <div className="lg:col-span-4 col-span-6">
                                {item?.images && item?.images[3] && (
                                    <Image src={item.images[3]?.src} alt="Property Image 4" width={400} height={500} className="rounded-2xl w-full h-full" unoptimized={true} />
                                )}
                            </div>
                        </>
                    )}
                </div>
                
                {/* Contenido condicional: Detalles de habitación O Formulario de reserva */}
                {showReservaForm ? (
                    <div ref={reservaFormRef} className="mt-10">
                        <ReservaForm
                            onBack={() => setShowReservaForm(false)}
                            habitacion={{
                                idHabitacion: item.idHabitacion,
                                nombre: item.name,
                                codigo: item.codigo,
                                capacidad: item.capacidad,
                                precio: item.precio
                            }}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-8 mt-10">
                        <div className="lg:col-span-8 col-span-12">
                            <h3 className='text-xl font-medium'>Detalles de la Habitación</h3>
                            <br />
                            <div className="flex flex-col gap-5">
                                <p className='text-dark dark:text-white text-xm '>
                                    {item?.descripcion}
                                </p>
                            </div>
     

                            <div className="py-8 mt-8 border-t border-dark/5 dark:border-white/15">
                                <h3 className='text-xl font-medium'>Lo que ofrece esta habitacion</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-6">
                                    <div className="flex items-center gap-2.5">
                                        <Icon icon="ph:sun" width={24} height={24} className="text-dark dark:text-white" />
                                        <p className='text-base dark:text-white text-dark'>Luz natural</p>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Icon icon="ph:television" width={24} height={24} className="text-dark dark:text-white" />
                                        <p className='text-base dark:text-white text-dark'>TV</p>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Icon icon="ph:bell" width={24} height={24} className="text-dark dark:text-white" />
                                        <p className='text-base dark:text-white text-dark'>Servicio a la habitación</p>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Icon icon="ph:wifi-high" width={24} height={24} className="text-dark dark:text-white" />
                                        <p className='text-base dark:text-white text-dark'>Wifi</p>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d33092.56379520714!2d-78.48899256994828!3d-0.3016443800649932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d5bd12538eb13b%3A0x907c61f1abbe45ab!2sUniversidad%20de%20las%20Fuerzas%20Armadas%20ESPE!5e1!3m2!1ses-419!2sec!4v1770743535852!5m2!1ses-419!2sec"
                                width="1114" height="400" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="rounded-2xl w-full">
                            </iframe>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
