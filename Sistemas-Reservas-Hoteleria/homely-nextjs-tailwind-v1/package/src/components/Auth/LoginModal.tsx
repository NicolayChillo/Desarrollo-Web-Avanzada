"use client"
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { login } from '@/services/api';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(correo, contrasena);
            
            // Guardar información del usuario en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.rol || 'CLIENTE');
            localStorage.setItem('idUsuario', response.idUsuario?.toString() || '');
            localStorage.setItem('userEmail', correo);

            // Disparar evento de storage manualmente para actualizar el Header
            window.dispatchEvent(new Event('storage'));

            // Redirigir según el rol
            if (response.rol === 'ADMINISTRADOR') {
                // Página de admin
                router.push('/admin');
            } else {
                // Página principal para clientes
                router.push('/home');
            }

            onClose();
        } catch (err) {
            setError('Credenciales incorrectas. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Icon icon="ph:x" width={24} height={24} />
                </button>

                <div className="text-center mb-6">
                    <Icon icon="ph:house-simple-fill" className="text-5xl text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Iniciar Sesión</h2>
                    <p className="text-dark/50 dark:text-white/50 mt-2">Bienvenido de nuevo a Hotel Scalibur</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-dark dark:text-white mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-dark dark:text-white mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-dark transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-dark/50 dark:text-white/50">
                        ¿No tienes una cuenta?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-primary hover:underline font-medium"
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
