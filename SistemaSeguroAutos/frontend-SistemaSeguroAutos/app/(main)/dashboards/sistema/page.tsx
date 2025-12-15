'use client';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/navigation';
import authService from '../../../../services/authService';
import vehiculoService from '../../../../services/vehiculoService';
import conductorService from '../../../../services/conductorService';
import cotizacionService from '../../../../services/cotizacionService';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalVehiculos: 0,
        totalConductores: 0,
        totalCotizaciones: 0,
        cotizacionesAprobadas: 0,
        cotizacionesPendientes: 0
    });
    const router = useRouter();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            window.location.href = '/auth/login';
            return;
        }
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const [vehiculos, conductores, cotizaciones] = await Promise.all([
                vehiculoService.getAll(),
                conductorService.getAll(),
                cotizacionService.getAll()
            ]);

            const aprobadas = cotizaciones.filter(c => c.estado === 'aprobada').length;
            const pendientes = cotizaciones.filter(c => c.estado === 'pendiente').length;

            setStats({
                totalVehiculos: vehiculos.length,
                totalConductores: conductores.length,
                totalCotizaciones: cotizaciones.length,
                cotizacionesAprobadas: aprobadas,
                cotizacionesPendientes: pendientes
            });
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: ['Aprobadas', 'Pendientes', 'Rechazadas'],
        datasets: [
            {
                data: [stats.cotizacionesAprobadas, stats.cotizacionesPendientes, stats.totalCotizaciones - stats.cotizacionesAprobadas - stats.cotizacionesPendientes],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                hoverBackgroundColor: ['#059669', '#d97706', '#dc2626']
            }
        ]
    };

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <ProgressSpinner />
            </div>
        );
    }

    const usuario = authService.getCurrentUser();

    return (
        <div className="grid">
            <div className="col-12">
                <Card>
                    <h1 className="text-900 font-bold mb-3">🏠 Sistema de Seguros de Autos</h1>
                    <p className="text-600 line-height-3 mb-0">
                        Bienvenido/a <strong>{usuario?.nombreUsuario}</strong>. Administra vehículos, conductores y genera cotizaciones de seguros.
                    </p>
                </Card>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <Card className="shadow-2">
                    <div className="flex justify-content-between align-items-center">
                        <div>
                            <span className="block text-500 font-medium mb-2">Vehículos</span>
                            <div className="text-900 font-bold text-4xl">{stats.totalVehiculos}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-car text-blue-500 text-3xl"></i>
                        </div>
                    </div>
                    <Button label="Ver Vehículos" icon="pi pi-arrow-right" className="p-button-text mt-3" onClick={() => router.push('/vehiculos')} />
                </Card>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <Card className="shadow-2">
                    <div className="flex justify-content-between align-items-center">
                        <div>
                            <span className="block text-500 font-medium mb-2">Conductores</span>
                            <div className="text-900 font-bold text-4xl">{stats.totalConductores}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-users text-orange-500 text-3xl"></i>
                        </div>
                    </div>
                    <Button label="Ver Conductores" icon="pi pi-arrow-right" className="p-button-text mt-3" onClick={() => router.push('/conductores')} />
                </Card>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <Card className="shadow-2">
                    <div className="flex justify-content-between align-items-center">
                        <div>
                            <span className="block text-500 font-medium mb-2">Cotizaciones</span>
                            <div className="text-900 font-bold text-4xl">{stats.totalCotizaciones}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-list text-cyan-500 text-3xl"></i>
                        </div>
                    </div>
                    <Button label="Ver Cotizaciones" icon="pi pi-arrow-right" className="p-button-text mt-3" onClick={() => router.push('/cotizaciones')} />
                </Card>
            </div>

            <div className="col-12 md:col-6 lg:col-3">
                <Card className="shadow-2">
                    <div className="flex justify-content-between align-items-center">
                        <div>
                            <span className="block text-500 font-medium mb-2">Nueva Cotización</span>
                            <div className="text-900 font-bold text-xl">Generar</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '3rem', height: '3rem' }}>
                            <i className="pi pi-plus text-green-500 text-3xl"></i>
                        </div>
                    </div>
                    <Button label="Crear Cotización" icon="pi pi-plus" className="p-button-success mt-3" onClick={() => router.push('/nueva-cotizacion')} />
                </Card>
            </div>

            <div className="col-12 lg:col-6">
                <Card title="📊 Estado de Cotizaciones">
                    {stats.totalCotizaciones > 0 ? (
                        <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
                    ) : (
                        <p className="text-center text-500">No hay cotizaciones registradas</p>
                    )}
                </Card>
            </div>

            <div className="col-12 lg:col-6">
                <Card title="🚀 Acciones Rápidas">
                    <div className="flex flex-column gap-3">
                        <Button 
                            label="Registrar Nuevo Vehículo" 
                            icon="pi pi-car" 
                            className="p-button-outlined w-full"
                            onClick={() => router.push('/vehiculos')}
                        />
                        <Button 
                            label="Registrar Nuevo Conductor" 
                            icon="pi pi-user-plus" 
                            className="p-button-outlined w-full"
                            onClick={() => router.push('/conductores')}
                        />
                        <Button 
                            label="Crear Nueva Cotización" 
                            icon="pi pi-calculator" 
                            className="p-button-success w-full"
                            onClick={() => router.push('/nueva-cotizacion')}
                        />
                    </div>
                </Card>
            </div>

            <div className="col-12">
                <Card>
                    <h3>📋 Información del Sistema</h3>
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3">
                                <i className="pi pi-check text-blue-500 text-xl"></i>
                            </div>
                            <span className="text-900 font-medium">Cotizaciones Aprobadas: <strong>{stats.cotizacionesAprobadas}</strong></span>
                        </li>
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3">
                                <i className="pi pi-clock text-orange-500 text-xl"></i>
                            </div>
                            <span className="text-900 font-medium">Cotizaciones Pendientes: <strong>{stats.cotizacionesPendientes}</strong></span>
                        </li>
                        <li className="flex align-items-center py-2">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-purple-100 border-circle mr-3">
                                <i className="pi pi-inbox text-purple-500 text-xl"></i>
                            </div>
                            <span className="text-900 font-medium">Total de Registros: <strong>{stats.totalVehiculos + stats.totalConductores}</strong></span>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
