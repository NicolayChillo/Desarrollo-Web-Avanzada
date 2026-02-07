'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import authService from '../../../services/authService';
import cotizacionService from '../../../services/cotizacionService';

interface Cotizacion {
    idCotizacion: number;
    costoBase: number;
    costoFinal: number;
    descuentos: number;
    recargos: number;
    estado: string;
    fechaCreacion: string;
    fechaVencimiento: string;
    detalleCalculo: any;
    conductor: {
        nombreConductor: string;
    };
    vehiculo: {
        marca: string;
        modelo: string;
        tipo: string;
        numeroPlaca: string;
    };
}

const CotizacionesPage = () => {
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const toast = React.useRef<Toast>(null);
    const router = useRouter();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            window.location.href = '/auth/login';
            return;
        }
        cargarCotizaciones();
    }, []);

    const cargarCotizaciones = async () => {
        try {
            const data = await cotizacionService.getAll();
            setCotizaciones(data);
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    const estadoBodyTemplate = (rowData: Cotizacion) => {
        const severityMap: { [key: string]: 'success' | 'warning' | 'danger' | 'info' } = {
            aprobada: 'success',
            pendiente: 'warning',
            rechazada: 'danger',
            vencida: 'info'
        };
        return <Tag value={rowData.estado.toUpperCase()} severity={severityMap[rowData.estado]} />;
    };

    const costoBodyTemplate = (rowData: Cotizacion) => {
        return formatCurrency(rowData.costoFinal);
    };

    const accionesBodyTemplate = (rowData: Cotizacion) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    tooltip="Ver Detalles"
                    className="p-button-sm p-button-info"
                    onClick={() => verDetalles(rowData)}
                />
                {rowData.estado === 'pendiente' && (
                    <>
                        <Button
                            icon="pi pi-check"
                            tooltip="Aprobar"
                            className="p-button-sm p-button-success"
                            onClick={() => cambiarEstado(rowData.idCotizacion, 'aprobada')}
                        />
                        <Button
                            icon="pi pi-times"
                            tooltip="Rechazar"
                            className="p-button-sm p-button-danger"
                            onClick={() => cambiarEstado(rowData.idCotizacion, 'rechazada')}
                        />
                    </>
                )}
            </div>
        );
    };

    const verDetalles = (cotizacion: Cotizacion) => {
        console.log('Cotización completa:', cotizacion);
        console.log('detalleCalculo:', cotizacion.detalleCalculo);
        setSelectedCotizacion(cotizacion);
        setDialogVisible(true);
    };

    const cambiarEstado = async (id: number, nuevoEstado: string) => {
        try {
            await cotizacionService.updateEstado(id, nuevoEstado);
            toast.current?.show({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: `Cotización ${nuevoEstado === 'aprobada' ? 'aprobada' : 'rechazada'} exitosamente`, 
                life: 3000 
            });
            await cargarCotizaciones();
            setDialogVisible(false);
        } catch (error: any) {
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: error.message, 
                life: 3000 
            });
        }
    };

    const renderDetalleCalculo = () => {
        if (!selectedCotizacion?.detalleCalculo) return null;

        // Si detalleCalculo es string, parsearlo
        let detalle = selectedCotizacion.detalleCalculo;
        if (typeof detalle === 'string') {
            try {
                detalle = JSON.parse(detalle);
            } catch (e) {
                console.error('Error parsing detalleCalculo:', e);
                return <p>Error al cargar detalles de cálculo</p>;
            }
        }
        
        // Función helper para formatear valores que pueden venir como string o número
        const formatValue = (value: any) => {
            const num = typeof value === 'string' ? parseFloat(value) : value;
            return isNaN(num) ? 0 : num;
        };

        return (
            <div className="grid">
                <div className="col-12">
                    <h3>Costos</h3>
                    <ul className="list-none p-0">
                        <li className="mb-2"><strong>Costo Base:</strong> {formatCurrency(formatValue(detalle.costoBase))}</li>
                        <li className="mb-2"><strong>Recargos Totales:</strong> {formatCurrency(formatValue(detalle.recargoTotal))}</li>
                        <li className="mb-2"><strong>Descuentos Totales:</strong> {formatCurrency(formatValue(detalle.descuentoTotal))}</li>
                        <li className="mb-2 text-2xl"><strong>Costo Final:</strong> <span className="text-primary">{formatCurrency(formatValue(detalle.costoFinal))}</span></li>
                    </ul>
                </div>

                <div className="col-12 md:col-6">
                    <h3>Ajustes por Conductor</h3>
                    <ul className="list-none p-0">
                        {detalle.detallesAjustes?.conductor?.recargoJoven && (
                            <li className="mb-2 text-orange-500">
                                <i className="pi pi-exclamation-triangle mr-2"></i>
                                <strong>Conductor Joven:</strong> {detalle.detallesAjustes.conductor.recargoJoven}
                            </li>
                        )}
                        {detalle.detallesAjustes?.conductor?.recargoEdad && (
                            <li className="mb-2 text-orange-500">
                                <i className="pi pi-exclamation-triangle mr-2"></i>
                                <strong>Edad Avanzada:</strong> {detalle.detallesAjustes.conductor.recargoEdad}
                            </li>
                        )}
                        {!detalle.detallesAjustes?.conductor?.recargoJoven && !detalle.detallesAjustes?.conductor?.recargoEdad && (
                            <li className="mb-2 text-green-500">
                                <i className="pi pi-check mr-2"></i>
                                <strong>Edad Estándar:</strong> Sin recargo
                            </li>
                        )}
                    </ul>
                </div>

                <div className="col-12 md:col-6">
                    <h3>Ajustes por Vehículo</h3>
                    <ul className="list-none p-0">
                        <li className="mb-2">
                            <strong>Tipo:</strong> {selectedCotizacion.vehiculo?.tipo?.toUpperCase() || 'N/A'}
                        </li>
                        {detalle.detallesAjustes?.vehiculo?.antiguedad && (
                            <li className="mb-2">
                                <strong>Antigüedad:</strong> {detalle.detallesAjustes.vehiculo.antiguedad}
                            </li>
                        )}
                        {detalle.detallesAjustes?.vehiculo?.usoComercial && detalle.detallesAjustes.vehiculo.usoComercial !== "No aplica" && (
                            <li className="mb-2 text-orange-500">
                                <i className="pi pi-exclamation-triangle mr-2"></i>
                                <strong>Uso Comercial:</strong> {detalle.detallesAjustes.vehiculo.usoComercial}
                            </li>
                        )}
                    </ul>
                </div>

                <div className="col-12 md:col-6">
                    <h3>Historial de Accidentes</h3>
                    <ul className="list-none p-0">
                        {detalle.detallesAjustes?.accidentes?.descuentoSinAccidentes && (
                            <li className="mb-2 text-green-500">
                                <i className="pi pi-check mr-2"></i>
                                <strong>Sin Accidentes:</strong> {detalle.detallesAjustes.accidentes.descuentoSinAccidentes}
                            </li>
                        )}
                        {detalle.detallesAjustes?.accidentes?.recargoPorAccidentes && (
                            <li className="mb-2 text-red-500">
                                <i className="pi pi-times mr-2"></i>
                                <strong>Recargo por Accidentes:</strong> {detalle.detallesAjustes.accidentes.recargoPorAccidentes}
                            </li>
                        )}
                    </ul>
                </div>

                <div className="col-12 md:col-6">
                    <h3>Forma de Pago</h3>
                    <ul className="list-none p-0">
                        {detalle.detallesAjustes?.pago?.descuentoAnual && (
                            <li className="mb-2 text-green-500">
                                <i className="pi pi-check mr-2"></i>
                                <strong>Pago Anual:</strong> Descuento {detalle.detallesAjustes.pago.descuentoAnual}
                            </li>
                        )}
                        {detalle.detallesAjustes?.pago?.recargoCuotas && (
                            <li className="mb-2 text-orange-500">
                                <i className="pi pi-exclamation-triangle mr-2"></i>
                                <strong>Pago en Cuotas:</strong> Recargo {detalle.detallesAjustes.pago.recargoCuotas}
                            </li>
                        )}
                        {!detalle.detallesAjustes?.pago?.descuentoAnual && !detalle.detallesAjustes?.pago?.recargoCuotas && (
                            <li className="mb-2">
                                <strong>Pago estándar</strong>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="col-12">
                    <h3>Vigencia</h3>
                    <ul className="list-none p-0">
                        <li className="mb-2"><strong>Vigencia:</strong> {detalle.vigencia} días</li>
                        <li className="mb-2"><strong>Fecha de Vencimiento:</strong> {detalle.fechaVencimiento}</li>
                    </ul>
                </div>

                {detalle.advertencias && detalle.advertencias.length > 0 && (
                    <div className="col-12">
                        <h3 className="text-orange-500">Advertencias</h3>
                        <ul className="list-none p-0">
                            {detalle.advertencias.map((adv: string, index: number) => (
                                <li key={index} className="mb-2 text-orange-500">
                                    <i className="pi pi-exclamation-triangle mr-2"></i>
                                    {adv}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <Card>
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h2 className="m-0">Cotizaciones de Seguros</h2>
                        <Button label="Nueva Cotización" icon="pi pi-plus" onClick={() => router.push('/nueva-cotizacion')} />
                    </div>

                    <DataTable
                        value={cotizaciones}
                        paginator
                        rows={10}
                        dataKey="idCotizacion"
                        emptyMessage="No hay cotizaciones registradas"
                        className="p-datatable-sm"
                    >
                        <Column field="idCotizacion" header="ID" sortable style={{ width: '5%' }} />
                        <Column
                            field="conductor.nombreConductor"
                            header="Conductor"
                            sortable
                            style={{ width: '20%' }}
                        />
                        <Column
                            header="Vehículo"
                            body={(rowData) => `${rowData.vehiculo.marca} ${rowData.vehiculo.modelo} (${rowData.vehiculo.numeroPlaca})`}
                            style={{ width: '25%' }}
                        />
                        <Column
                            field="costoFinal"
                            header="Costo Final"
                            body={costoBodyTemplate}
                            sortable
                            style={{ width: '15%' }}
                        />
                        <Column
                            field="estado"
                            header="Estado"
                            body={estadoBodyTemplate}
                            sortable
                            style={{ width: '10%' }}
                        />
                        <Column
                            field="fechaCreacion"
                            header="Fecha"
                            sortable
                            style={{ width: '15%' }}
                        />
                        <Column
                            header="Acciones"
                            body={accionesBodyTemplate}
                            style={{ width: '10%' }}
                        />
                    </DataTable>
                </Card>
            </div>

            <Dialog
                header={`Detalle de Cotización #${selectedCotizacion?.idCotizacion}`}
                visible={dialogVisible}
                style={{ width: '90vw', maxWidth: '1000px' }}
                onHide={() => setDialogVisible(false)}
                maximizable
            >
                {selectedCotizacion && (
                    <div>
                        <div className="grid mb-4">
                            <div className="col-12 md:col-6">
                                <h3>Conductor</h3>
                                <p><strong>Nombre:</strong> {selectedCotizacion.conductor.nombreConductor}</p>
                            </div>
                            <div className="col-12 md:col-6">
                                <h3>Vehículo</h3>
                                <p>
                                    <strong>Vehículo:</strong> {selectedCotizacion.vehiculo.marca} {selectedCotizacion.vehiculo.modelo}
                                    <br />
                                    <strong>Tipo:</strong> {selectedCotizacion.vehiculo.tipo}
                                    <br />
                                    <strong>Placa:</strong> {selectedCotizacion.vehiculo.numeroPlaca}
                                </p>
                            </div>
                        </div>

                        <hr />

                        {renderDetalleCalculo()}
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default CotizacionesPage;
