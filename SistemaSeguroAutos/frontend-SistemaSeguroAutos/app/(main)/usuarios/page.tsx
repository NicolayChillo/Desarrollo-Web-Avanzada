'use client';
import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Password } from 'primereact/password';
import authService, { Usuario } from '../../../services/authService';

const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [dialog, setDialog] = useState(false);
    const [usuario, setUsuario] = useState<any>({
        nombreUsuario: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/usuarios');
            const data = await response.json();
            setUsuarios(data);
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar usuarios', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const openNew = () => {
        setUsuario({
            nombreUsuario: '',
            email: '',
            password: ''
        });
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDialog(false);
    };

    const saveUsuario = async () => {
        setSubmitted(true);

        if (!usuario.nombreUsuario.trim() || !usuario.email.trim() || !usuario.password.trim()) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Complete los campos requeridos', life: 3000 });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombreUsuario: usuario.nombreUsuario,
                    email: usuario.email,
                    password: usuario.password
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.mensaje || 'Error al crear usuario');
            }

            await cargarUsuarios();
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado', life: 3000 });
            setDialog(false);
            setUsuario({
                nombreUsuario: '',
                email: '',
                password: ''
            });
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        }
    };

    const deleteUsuario = async (usuario: Usuario) => {
        if (confirm(`¿Está seguro de eliminar al usuario ${usuario.nombreUsuario}?`)) {
            try {
                await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`, {
                    method: 'DELETE'
                });
                await cargarUsuarios();
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado', life: 3000 });
            } catch (error: any) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar usuario', life: 3000 });
            }
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <Button label="Nuevo Usuario" icon="pi pi-plus" severity="success" onClick={openNew} />
        );
    };

    const actionBodyTemplate = (rowData: Usuario) => {
        return (
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => deleteUsuario(rowData)} />
        );
    };

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveUsuario} />
        </>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h5>Gestión de Usuarios</h5>
                    <Toolbar className="mb-4" start={leftToolbarTemplate}></Toolbar>

                    <DataTable value={usuarios} loading={loading} paginator rows={10} dataKey="idUsuario">
                        <Column field="idUsuario" header="ID" sortable style={{ width: '10%' }}></Column>
                        <Column field="nombreUsuario" header="Nombre" sortable style={{ width: '30%' }}></Column>
                        <Column field="email" header="Email" sortable style={{ width: '45%' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ width: '15%' }}></Column>
                    </DataTable>

                    <Dialog visible={dialog} style={{ width: '450px' }} header="Nuevo Usuario" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombreUsuario">Nombre de Usuario *</label>
                            <InputText 
                                id="nombreUsuario" 
                                value={usuario.nombreUsuario} 
                                onChange={(e) => setUsuario({ ...usuario, nombreUsuario: e.target.value })} 
                                required 
                                className={!usuario.nombreUsuario && submitted ? 'p-invalid' : ''}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email *</label>
                            <InputText 
                                id="email" 
                                type="email"
                                value={usuario.email} 
                                onChange={(e) => setUsuario({ ...usuario, email: e.target.value })} 
                                required 
                                className={!usuario.email && submitted ? 'p-invalid' : ''}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="password">Contraseña *</label>
                            <Password 
                                id="password" 
                                value={usuario.password} 
                                onChange={(e) => setUsuario({ ...usuario, password: e.target.value })} 
                                toggleMask
                                feedback={false}
                                className={!usuario.password && submitted ? 'p-invalid' : ''}
                            />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UsuariosPage;
