'use client';
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Page } from '../../../../types/layout';
import authService from '../../../../services/authService';
import { Message } from 'primereact/message';

const Login: Page = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Si ya está autenticado, redirigir al dashboard
        if (authService.isAuthenticated()) {
            router.push('/dashboards/sistema');
        }
    }, [router]);

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ email, password });
            
            // Login exitoso
            console.log('Login exitoso:', response);
            
            // Redirigir al dashboard del sistema
            router.push('/dashboards/sistema');
            
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="overflow-hidden margin-0 relative h-screen">
                <div className="bg-cover bg-center" style={{ backgroundImage: 'url(/layout/images/pages/login/bg-login.jpg)', height: 'calc(100% - 370px)' }}></div>
                <div className="w-full absolute mb-0 bottom-0 text-center surface-900 border-noround p-fluid h-27rem">
                    <div className="px-6 md:p-0 w-29rem relative text-white" style={{ marginLeft: ' -200px', top: '30px', left: '50%' }}>
                        <div className="grid">
                            <div className="col-3 text-left">
                                <img src="/layout/images/pages/login/icon-login.svg" alt="avalon-react" />
                            </div>
                            <div className="col-9 text-left">
                                <h2 className="mb-0 text-0">Sistema de Seguros</h2>
                                <span className="text-500 text-sm">Inicie sesión para continuar</span>
                            </div>
                            {error && (
                                <div className="col-12">
                                    <Message severity="error" text={error} className="w-full" />
                                </div>
                            )}
                            <div className="col-12 text-left">
                                <label className="text-400 mb-1">Email</label>
                                <div className="mt-1">
                                    <InputText 
                                        type="email" 
                                        placeholder="Email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="col-12 text-left">
                                <label className="text-400 mb-1">Contraseña</label>
                                <div className="mt-1">
                                    <InputText 
                                        type="password" 
                                        placeholder="Contraseña" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <Button 
                                    onClick={handleLogin} 
                                    label={loading ? "Cargando..." : "Iniciar Sesión"}
                                    disabled={loading}
                                ></Button>
                            </div>
                            <div className="col-12 md:col-6">
                                <Button text className="text-gray-300 flex justify-content-center">
                                    ¿Olvidó su contraseña?
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
