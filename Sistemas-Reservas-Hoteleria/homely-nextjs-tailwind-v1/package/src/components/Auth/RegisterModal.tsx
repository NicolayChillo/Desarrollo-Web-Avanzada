"use client"
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { register } from '@/services/api';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validaciones
        if (contrasena !== confirmarContrasena) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            await register(nombre, correo, contrasena);
            setSuccess(true);
            
            // Limpiar formulario
            setNombre('');
            setCorreo('');
            setContrasena('');
            setConfirmarContrasena('');

            // Después de 2 segundos, cambiar a login
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } catch (err) {
            setError('Error al registrarse. El correo puede estar en uso.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Icon icon="ph:x" width={24} height={24} />
                </button>

                <div className="text-center mb-6">
                    <Icon icon="ph:user-plus" className="text-5xl text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Crear Cuenta</h2>
                    <p className="text-dark/50 dark:text-white/50 mt-2">Únete a Hotel Scalibur</p>
                </div>

                {success ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        ¡Registro exitoso! Redirigiendo al inicio de sesión...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-dark dark:text-white mb-2">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Juan Pérez"
                            />
                        </div>

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
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark dark:text-white mb-2">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-dark transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registrando...' : 'Crear Cuenta'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-dark/50 dark:text-white/50">
                        ¿Ya tienes una cuenta?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-primary hover:underline font-medium"
                        >
                            Inicia sesión aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;
