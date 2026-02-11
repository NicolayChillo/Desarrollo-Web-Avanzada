import React from 'react';
import { Icon } from "@iconify/react";

interface Tip {
    icon: string;
    title: string;
    description: string;
}

const BlogSmall: React.FC = () => {
    const tips: Tip[] = [
        {
            icon: "ph:wifi-high-fill",
            title: "WiFi de Alta Velocidad",
            description: "Conexión gratuita en todas las áreas del hotel para que estés siempre conectado"
        },
        {
            icon: "ph:broom-fill",
            title: "Limpieza Diaria",
            description: "Servicio de limpieza profesional todos los días para mantener tu habitación impecable"
        },
        {
            icon: "ph:clock-fill",
            title: "Check-in/Check-out Flexible",
            description: "Check-in desde las 2:00 PM y check-out hasta las 12:00 PM"
        },
        {
            icon: "ph:car-fill",
            title: "Estacionamiento Gratuito",
            description: "Parqueadero privado y seguro disponible para todos nuestros huéspedes"
        },
        {
            icon: "ph:phone-fill",
            title: "Recepción 24/7",
            description: "Nuestro equipo está disponible las 24 horas para asistirte en lo que necesites"
        },
        {
            icon: "ph:map-pin-fill",
            title: "Ubicación Privilegiada",
            description: "A pocos minutos de Cumbayá, restaurantes, tiendas y atracciones principales"
        }
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
                <div className='text-center mb-16'>
                    <p className="text-dark/75 dark:text-white/75 text-base font-semibold flex gap-2 justify-center items-center mb-3">
                        <Icon icon="ph:lightbulb-fill" className="text-2xl text-primary" aria-label="Tips icon" />
                        Tips para tu Estadía
                    </p>
                    <h2 className="lg:text-52 text-40 font-medium dark:text-white mb-4">
                        Todo lo que Necesitas Saber
                    </h2>
                    <p className='text-dark/50 dark:text-white/50 text-lg max-w-3xl mx-auto'>
                        Información importante para que tu experiencia sea inolvidable
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tips.map((tip, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="mb-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md group-hover:shadow-xl transition-shadow">
                                <Icon 
                                    icon={tip.icon} 
                                    className="text-primary dark:text-primary/80 transition-transform group-hover:scale-110"
                                    width={56}
                                    height={56}
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-dark dark:text-white mb-2">
                                {tip.title}
                            </h3>
                            <p className="text-dark/60 dark:text-white/60 text-sm leading-relaxed">
                                {tip.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BlogSmall;
