'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { classNames } from 'primereact/utils';
import { Tag } from 'primereact/tag';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import accidenteService, { Accidente } from '../../../services/accidenteService';
import conductorService, { Conductor } from '../../../services/conductorService';
import vehiculoService, { Vehiculo } from '../../../services/vehiculoService';
import authService from '../../../services/authService';

const AccidentesPage = () => {
    const [accidentes, setAccidentes] = useState<Accidente[]>([]);
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [accidente, setAccidente] = useState<Accidente>({
        conductorId: 0,
        vehiculoId: 0,
        fechaAccidente: '',
        descripcion: '',
        gravedad: 'leve'
    });
    const toast = React.useRef<Toast>(null);

    const gravedadOptions = [
        { label: 'Leve', value: 'leve' },
        { label: 'Moderada', value: 'moderada' },
        { label: 'Grave', value: 'grave' }
    ];

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            window.location.href = '/auth/login';
            return;
        }
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [accidentesData, conductoresData, vehiculosData] = await Promise.all([
                accidenteService.getAll(),
                conductorService.getAll(),
                vehiculoService.getAll()
            ]);
            setAccidentes(accidentesData);
            setConductores(conductoresData);
            setVehiculos(vehiculosData);
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setAccidente({
            conductorId: 0,
            vehiculoId: 0,
            fechaAccidente: '',
            descripcion: '',
            gravedad: 'leve'
        });
        setSubmitted(false);
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialogVisible(false);
    };

    const saveAccidente = async () => {
        setSubmitted(true);

        if (accidente.conductorId && accidente.vehiculoId && accidente.fechaAccidente && accidente.descripcion.trim()) {
            try {
                if (accidente.idAccidente) {
                    await accidenteService.update(accidente.idAccidente, accidente);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Accidente actualizado', life: 3000 });
                } else {
                    await accidenteService.create(accidente);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Accidente registrado', life: 3000 });
                }
                await cargarDatos();
                hideDialog();
            } catch (error: any) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
            }
        }
    };

    const editAccidente = (accidente: Accidente) => {
        setAccidente({ ...accidente });
        setDialogVisible(true);
    };

    const confirmDeleteAccidente = (accidente: Accidente) => {
        confirmDialog({
            message: `¿Está seguro de eliminar este accidente?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await accidenteService.delete(accidente.idAccidente!);
                    await cargarDatos();
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Accidente eliminado', life: 3000 });
                } catch (error: any) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                }
            }
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _accidente = { ...accidente };
        (_accidente as any)[name] = val;
        setAccidente(_accidente);
    };

    const onDateChange = (e: any) => {
        let _accidente = { ...accidente };
        const date = e.value as Date;
        _accidente.fechaAccidente = date ? date.toISOString().split('T')[0] : '';
        setAccidente(_accidente);
    };

    const onDropdownChange = (e: any, name: string) => {
        let _accidente = { ...accidente };
        (_accidente as any)[name] = e.value;
        setAccidente(_accidente);
    };

    const gravedadBodyTemplate = (rowData: Accidente) => {
        const severityMap: { [key: string]: 'success' | 'warning' | 'danger' } = {
            leve: 'success',
            moderada: 'warning',
            grave: 'danger'
        };
        return <Tag value={rowData.gravedad.toUpperCase()} severity={severityMap[rowData.gravedad]} />;
    };

    const conductorBodyTemplate = (rowData: Accidente) => {
        return rowData.conductor?.nombreConductor || 'N/A';
    };

    const vehiculoBodyTemplate = (rowData: Accidente) => {
        if (rowData.vehiculo) {
            return `${rowData.vehiculo.marca} ${rowData.vehiculo.modelo} (${rowData.vehiculo.numeroPlaca})`;
        }
        return 'N/A';
    };

    const actionBodyTemplate = (rowData: Accidente) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editAccidente(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteAccidente(rowData)} />
            </>
        );
    };

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveAccidente} />
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
                        <h2 className="m-0">💥 Gestión de Accidentes</h2>
                        <Button label="Registrar Accidente" icon="pi pi-plus" onClick={openNew} />
                    </div>

                    <DataTable value={accidentes} paginator rows={10} dataKey="idAccidente" emptyMessage="No hay accidentes registrados">
                        <Column field="idAccidente" header="ID" sortable style={{ width: '5%' }} />
                        <Column header="Conductor" body={conductorBodyTemplate} sortable style={{ width: '20%' }} />
                        <Column header="Vehículo" body={vehiculoBodyTemplate} style={{ width: '25%' }} />
                        <Column field="fechaAccidente" header="Fecha" sortable style={{ width: '12%' }} />
                        <Column field="gravedad" header="Gravedad" body={gravedadBodyTemplate} sortable style={{ width: '12%' }} />
                        <Column field="descripcion" header="Descripción" style={{ width: '18%' }} />
                        <Column body={actionBodyTemplate} header="Acciones" exportable={false} style={{ width: '8%' }} />
                    </DataTable>
                </Card>
            </div>

            <Dialog visible={dialogVisible} style={{ width: '700px' }} header="Detalle del Accidente" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="conductorId">Conductor *</label>
                            <Dropdown
                                id="conductorId"
                                value={accidente.conductorId}
                                onChange={(e) => onDropdownChange(e, 'conductorId')}
                                options={conductores}
                                optionLabel="nombreConductor"
                                optionValue="idConductor"
                                placeholder="Seleccione un conductor"
                                filter
                                className={classNames({ 'p-invalid': submitted && !accidente.conductorId })}
                            />
                            {submitted && !accidente.conductorId && <small className="p-error">El conductor es requerido.</small>}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="vehiculoId">Vehículo *</label>
                            <Dropdown
                                id="vehiculoId"
                                value={accidente.vehiculoId}
                                onChange={(e) => onDropdownChange(e, 'vehiculoId')}
                                options={vehiculos}
                                optionLabel="modelo"
                                optionValue="idVehiculo"
                                placeholder="Seleccione un vehículo"
                                filter
                                itemTemplate={(option) => `${option.marca} ${option.modelo} (${option.numeroPlaca})`}
                                className={classNames({ 'p-invalid': submitted && !accidente.vehiculoId })}
                            />
                            {submitted && !accidente.vehiculoId && <small className="p-error">El vehículo es requerido.</small>}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="fechaAccidente">Fecha del Accidente *</label>
                            <Calendar
                                id="fechaAccidente"
                                value={accidente.fechaAccidente ? new Date(accidente.fechaAccidente) : null}
                                onChange={onDateChange}
                                dateFormat="yy-mm-dd"
                                showIcon
                                maxDate={new Date()}
                                required
                                className={classNames({ 'p-invalid': submitted && !accidente.fechaAccidente })}
                            />
                            {submitted && !accidente.fechaAccidente && <small className="p-error">La fecha es requerida.</small>}
                            <small className="text-500">Solo se permiten fechas hasta hoy</small>
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="field">
                            <label htmlFor="gravedad">Gravedad *</label>
                            <Dropdown
                                id="gravedad"
                                value={accidente.gravedad}
                                onChange={(e) => onDropdownChange(e, 'gravedad')}
                                options={gravedadOptions}
                                placeholder="Seleccione la gravedad"
                                className={classNames({ 'p-invalid': submitted && !accidente.gravedad })}
                            />
                            {submitted && !accidente.gravedad && <small className="p-error">La gravedad es requerida.</small>}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="field">
                            <label htmlFor="descripcion">Descripción *</label>
                            <InputTextarea
                                id="descripcion"
                                value={accidente.descripcion}
                                onChange={(e) => onInputChange(e, 'descripcion')}
                                required
                                rows={4}
                                className={classNames({ 'p-invalid': submitted && !accidente.descripcion })}
                            />
                            {submitted && !accidente.descripcion && <small className="p-error">La descripción es requerida.</small>}
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AccidentesPage;
