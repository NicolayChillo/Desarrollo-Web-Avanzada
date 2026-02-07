'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { classNames } from 'primereact/utils';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import conductorService, { Conductor } from '../../../services/conductorService';
import authService from '../../../services/authService';

const ConductoresPage = () => {
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [conductor, setConductor] = useState<Conductor>({
        nombreConductor: '',
        numeroLicenia: '',
        fechaNacimiento: '',
        numeroAccidentes: 0
    });
    const toast = React.useRef<Toast>(null);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            window.location.href = '/auth/login';
            return;
        }
        cargarConductores();
    }, []);

    const cargarConductores = async () => {
        try {
            const data = await conductorService.getAll();
            setConductores(data);
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setConductor({
            nombreConductor: '',
            numeroLicenia: '',
            fechaNacimiento: '',
            numeroAccidentes: 0
        });
        setSubmitted(false);
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialogVisible(false);
    };

    const saveConductor = async () => {
        setSubmitted(true);

        if (conductor.nombreConductor.trim() && conductor.numeroLicenia.trim() && conductor.fechaNacimiento) {
            try {
                if (conductor.idConductor) {
                    await conductorService.update(conductor.idConductor, conductor);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Conductor actualizado', life: 3000 });
                } else {
                    await conductorService.create(conductor);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Conductor creado', life: 3000 });
                }
                await cargarConductores();
                hideDialog();
            } catch (error: any) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
            }
        }
    };

    const editConductor = (conductor: Conductor) => {
        setConductor({ ...conductor });
        setDialogVisible(true);
    };

    const confirmDeleteConductor = (conductor: Conductor) => {
        confirmDialog({
            message: `¿Está seguro de eliminar al conductor ${conductor.nombreConductor}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await conductorService.delete(conductor.idConductor!);
                    await cargarConductores();
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Conductor eliminado', life: 3000 });
                } catch (error: any) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                }
            }
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _conductor = { ...conductor };
        (_conductor as any)[name] = val;
        setConductor(_conductor);
    };

    const onDateChange = (e: any) => {
        let _conductor = { ...conductor };
        const date = e.value as Date;
        if (date && date > new Date()) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se puede seleccionar fechas futuras', life: 3000 });
            return;
        }
        _conductor.fechaNacimiento = date ? date.toISOString().split('T')[0] : '';
        setConductor(_conductor);
    };

    const calcularEdad = (fechaNacimiento: string) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const edadBodyTemplate = (rowData: Conductor) => {
        return `${calcularEdad(rowData.fechaNacimiento)} años`;
    };

    const actionBodyTemplate = (rowData: Conductor) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editConductor(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteConductor(rowData)} />
            </>
        );
    };

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveConductor} />
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
            <ConfirmDialog />
            <div className="col-12">
                <Card>
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h2 className="m-0">👤 Gestión de Conductores</h2>
                        <Button label="Nuevo Conductor" icon="pi pi-plus" onClick={openNew} />
                    </div>

                    <DataTable value={conductores} paginator rows={10} dataKey="idConductor" emptyMessage="No hay conductores registrados">
                        <Column field="idConductor" header="ID" sortable style={{ width: '8%' }} />
                        <Column field="nombreConductor" header="Nombre" sortable style={{ width: '25%' }} />
                        <Column field="numeroLicenia" header="Licencia" sortable style={{ width: '15%' }} />
                        <Column field="fechaNacimiento" header="Fecha Nac." sortable style={{ width: '15%' }} />
                        <Column header="Edad" body={edadBodyTemplate} sortable style={{ width: '10%' }} />
                        <Column field="numeroAccidentes" header="Accidentes" sortable style={{ width: '12%' }} />
                        <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ width: '15%' }} />
                    </DataTable>
                </Card>
            </div>

            <Dialog visible={dialogVisible} style={{ width: '600px' }} header="Detalle del Conductor" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                <div className="grid">
                    <div className="col-12">
                        <div className="field">
                            <label htmlFor="nombreConductor">Nombre Completo *</label>
                            <InputText id="nombreConductor" value={conductor.nombreConductor} onChange={(e) => onInputChange(e, 'nombreConductor')} required className={classNames({ 'p-invalid': submitted && !conductor.nombreConductor })} />
                            {submitted && !conductor.nombreConductor && <small className="p-error">El nombre es requerido.</small>}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="numeroLicenia">Número de Licencia *</label>
                            <InputText id="numeroLicenia" value={conductor.numeroLicenia} onChange={(e) => onInputChange(e, 'numeroLicenia')} required className={classNames({ 'p-invalid': submitted && !conductor.numeroLicenia })} />
                            {submitted && !conductor.numeroLicenia && <small className="p-error">La licencia es requerida.</small>}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento *</label>
                            <Calendar 
                                id="fechaNacimiento" 
                                value={conductor.fechaNacimiento ? new Date(conductor.fechaNacimiento) : null} 
                                onChange={onDateChange} 
                                dateFormat="yy-mm-dd" 
                                showIcon 
                                required 
                                maxDate={new Date()}
                                className={classNames({ 'p-invalid': submitted && !conductor.fechaNacimiento })} 
                            />
                            {submitted && !conductor.fechaNacimiento && <small className="p-error">La fecha de nacimiento es requerida.</small>}
                            <small className="text-500">Solo se permiten fechas hasta hoy</small>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ConductoresPage;
