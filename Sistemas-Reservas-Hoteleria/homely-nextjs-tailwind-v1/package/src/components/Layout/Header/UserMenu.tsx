"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/services/api';

interface UserMenuProps {
    isHomepage: boolean;
    sticky: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ isHomepage, sticky }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        // Obtener información del usuario desde el token
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            setUserData(decoded);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        
        // Disparar evento de storage para actualizar el Header
        window.dispatchEvent(new Event('storage'));
        
        router.push('/');
    };

    const iconColorClass = isHomepage
        ? sticky
            ? 'text-dark dark:text-white'
            : 'text-white'
        : 'text-dark dark:text-white';

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 ${iconColorClass}`}
                aria-label="Menú de usuario"
            >
                <div className="relative">
                    <Icon icon="ph:user-circle-fill" width={40} height={40} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark"></div>
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    {/* Header del menú */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Icon icon="ph:user-circle-fill" width={48} height={48} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{userData?.sub || 'Usuario'}</h3>
                                <p className="text-sm text-white/80">{userData?.rol || 'Cliente'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Opciones del menú */}
                    <div className="p-3">
                        {/* Información del perfil */}
                        <Link 
                            href="/profile" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Icon icon="ph:user" width={20} height={20} className="text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-dark dark:text-white text-sm">Mi Perfil</p>
                                <p className="text-xs text-dark/50 dark:text-white/50">Ver información y opciones</p>
                            </div>
                            <Icon icon="ph:caret-right" width={16} height={16} className="text-dark/30 dark:text-white/30" />
                        </Link>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                        {/* Cerrar sesión */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 w-full group"
                        >
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                                <Icon icon="ph:sign-out" width={20} height={20} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-medium text-red-600 dark:text-red-400 text-sm">Cerrar Sesión</p>
                                <p className="text-xs text-red-600/60 dark:text-red-400/60">Salir de tu cuenta</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
