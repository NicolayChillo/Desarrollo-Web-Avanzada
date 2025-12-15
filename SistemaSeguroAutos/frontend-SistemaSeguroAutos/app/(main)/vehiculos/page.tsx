'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { classNames } from 'primereact/utils';
import vehiculoService, { Vehiculo } from '../../../services/vehiculoService';
import authService from '../../../services/authService';

const VehiculosPage = () => {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [vehiculo, setVehiculo] = useState<Vehiculo>({
        marca: '',
        modelo: '',
        anio: new Date().getFullYear(),
        numeroPlaca: '',
        tipo: 'sedan',
        uso: 'personal',
        valorComercial: 0
    });
    const toast = React.useRef<Toast>(null);

    const tiposVehiculo = [
        { label: 'Sedán', value: 'sedan' },
        { label: 'SUV', value: 'SUV' },
        { label: 'Camioneta', value: 'camioneta' }
    ];

    const tiposUso = [
        { label: 'Personal', value: 'personal' },
        { label: 'Comercial', value: 'comercial' }
    ];

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            window.location.href = '/auth/login';
            return;
        }
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        try {
            const data = await vehiculoService.getAll();
            setVehiculos(data);
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setVehiculo({
            marca: '',
            modelo: '',
            anio: new Date().getFullYear(),
            numeroPlaca: '',
            tipo: 'sedan',
            uso: 'personal',
            valorComercial: 0
        });
        setSubmitted(false);
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialogVisible(false);
    };

    const saveVehiculo = async () => {
        setSubmitted(true);

        if (vehiculo.marca.trim() && vehiculo.modelo.trim() && vehiculo.numeroPlaca.trim() && vehiculo.valorComercial > 0) {
            try {
                if (vehiculo.idVehiculo) {
                    await vehiculoService.update(vehiculo.idVehiculo, vehiculo);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Vehículo actualizado', life: 3000 });
                } else {
                    await vehiculoService.create(vehiculo);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Vehículo creado', life: 3000 });
                }
                await cargarVehiculos();
                hideDialog();
            } catch (error: any) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
            }
        }
    };

    const editVehiculo = (vehiculo: Vehiculo) => {
        setVehiculo({ ...vehiculo });
        setDialogVisible(true);
    };

    const confirmDeleteVehiculo = async (vehiculo: Vehiculo) => {
        if (window.confirm(`¿Está seguro de eliminar el vehículo ${vehiculo.marca} ${vehiculo.modelo}?`)) {
            try {
                await vehiculoService.delete(vehiculo.idVehiculo!);
                await cargarVehiculos();
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Vehículo eliminado', life: 3000 });
            } catch (error: any) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
            }
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _vehiculo = { ...vehiculo };
        (_vehiculo as any)[name] = val;
        setVehiculo(_vehiculo);
    };

    const onDropdownChange = (e: any, name: string) => {
        let _vehiculo = { ...vehiculo };
        (_vehiculo as any)[name] = e.value;
        setVehiculo(_vehiculo);
    };

    const onNumberChange = (e: any, name: string) => {
        let _vehiculo = { ...vehiculo };
        (_vehiculo as any)[name] = e.value;
        setVehiculo(_vehiculo);
    };

    const actionBodyTemplate = (rowData: Vehiculo) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editVehiculo(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteVehiculo(rowData)} />
            </>
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);
    };

    const priceBodyTemplate = (rowData: Vehiculo) => {
        return formatCurrency(rowData.valorComercial);
    };

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveVehiculo} />
        </>
    );

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
                        <h2 className="m-0">🚗 Gestión de Vehículos</h2>
                        <Button label="Nuevo Vehículo" icon="pi pi-plus" onClick={openNew} />
                    </div>

                    <DataTable value={vehiculos} paginator rows={10} dataKey="idVehiculo" emptyMessage="No hay vehículos registrados">
                        <Column field="idVehiculo" header="ID" sortable style={{ width: '5%' }} />
                        <Column field="marca" header="Marca" sortable style={{ width: '15%' }} />
                        <Column field="modelo" header="Modelo" sortable style={{ width: '15%' }} />
                        <Column field="anio" header="Año" sortable style={{ width: '10%' }} />
                        <Column field="numeroPlaca" header="Placa" sortable style={{ width: '12%' }} />
                        <Column field="tipo" header="Tipo" sortable style={{ width: '12%' }} />
                        <Column field="uso" header="Uso" sortable style={{ width: '12%' }} />
                        <Column field="valorComercial" header="Valor" body={priceBodyTemplate} sortable style={{ width: '12%' }} />
                        <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ width: '10%' }} />
                    </DataTable>
                </Card>
            </div>

            <Dialog visible={dialogVisible} style={{ width: '600px' }} header="Detalle del Vehículo" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="marca">Marca *</label>
                            <InputText id="marca" value={vehiculo.marca} onChange={(e) => onInputChange(e, 'marca')} required className={classNames({ 'p-invalid': submitted && !vehiculo.marca })} />
                            {submitted && !vehiculo.marca && <small className="p-error">La marca es requerida.</small>}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="modelo">Modelo *</label>
                            <InputText id="modelo" value={vehiculo.modelo} onChange={(e) => onInputChange(e, 'modelo')} required className={classNames({ 'p-invalid': submitted && !vehiculo.modelo })} />
                            {submitted && !vehiculo.modelo && <small className="p-error">El modelo es requerido.</small>}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="anio">Año *</label>
                            <InputNumber id="anio" value={vehiculo.anio} onValueChange={(e) => onNumberChange(e, 'anio')} useGrouping={false} required />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="numeroPlaca">Número de Placa *</label>
                            <InputText id="numeroPlaca" value={vehiculo.numeroPlaca} onChange={(e) => onInputChange(e, 'numeroPlaca')} required className={classNames({ 'p-invalid': submitted && !vehiculo.numeroPlaca })} />
                            {submitted && !vehiculo.numeroPlaca && <small className="p-error">La placa es requerida.</small>}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="tipo">Tipo *</label>
                            <Dropdown id="tipo" value={vehiculo.tipo} onChange={(e) => onDropdownChange(e, 'tipo')} options={tiposVehiculo} placeholder="Seleccione un tipo" />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="uso">Uso *</label>
                            <Dropdown id="uso" value={vehiculo.uso} onChange={(e) => onDropdownChange(e, 'uso')} options={tiposUso} placeholder="Seleccione el uso" />
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="field">
                            <label htmlFor="valorComercial">Valor Comercial ($) *</label>
                            <InputNumber id="valorComercial" value={vehiculo.valorComercial} onValueChange={(e) => onNumberChange(e, 'valorComercial')} mode="currency" currency="USD" locale="es-EC" required className={classNames({ 'p-invalid': submitted && vehiculo.valorComercial <= 0 })} />
                            {submitted && vehiculo.valorComercial <= 0 && <small className="p-error">El valor comercial debe ser mayor a 0.</small>}
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default VehiculosPage;
