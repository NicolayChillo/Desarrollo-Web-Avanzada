'use client';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { useRouter } from 'next/navigation';
import vehiculoService, { Vehiculo } from '../../../services/vehiculoService';
import conductorService, { Conductor } from '../../../services/conductorService';
import cotizacionService, { CotizacionCreate } from '../../../services/cotizacionService';
import authService from '../../../services/authService';

const NuevaCotizacionPage = () => {
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [resultado, setResultado] = useState<any>(null);
    const [error, setError] = useState<string>('');
    
    const [cotizacion, setCotizacion] = useState<CotizacionCreate>({
        conductorId: 0,
        usuarioId: 0,
        vehiculoId: 0,
        formaPago: undefined,
        pagoEnCuotas: false,
        numeroCuotas: undefined,
        aceptaTerminos: false
    });

    const toast = React.useRef<Toast>(null);
    const router = useRouter();

    const formasPago = [
        { label: 'Pago Anual (10% descuento)', value: 'ANUAL' },
        { label: 'Tarjeta de Crédito', value: 'tarjeta_credito' },
        { label: 'Tarjeta de Débito', value: 'tarjeta_debito' }
    ];

    const opcionesCuotas = [
        { label: '3 cuotas', value: 3 },
        { label: '6 cuotas', value: 6 },
        { label: '12 cuotas', value: 12 }
    ];

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            window.location.href = '/auth/login';
            return;
        }

        const usuario = authService.getCurrentUser();
        if (usuario) {
            setCotizacion(prev => ({ ...prev, usuarioId: usuario.id }));
        }

        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [conductoresData, vehiculosData] = await Promise.all([
                conductorService.getAll(),
                vehiculoService.getAll()
            ]);
            setConductores(conductoresData);
            setVehiculos(vehiculosData);
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const onConductorChange = (e: any) => {
        const conductor = conductores.find(c => c.idConductor === e.value);
        if (conductor) {
            setCotizacion({ ...cotizacion, conductorId: conductor.idConductor || 0 });
        }
        setResultado(null);
        setError('');
    };

    const onVehiculoChange = (e: any) => {
        const vehiculo = vehiculos.find(v => v.idVehiculo === e.value);
        if (vehiculo) {
            setCotizacion({ ...cotizacion, vehiculoId: vehiculo.idVehiculo || 0 });
        }
        setResultado(null);
        setError('');
    };

    const onFormaPagoChange = (e: any) => {
        setCotizacion({ 
            ...cotizacion, 
            formaPago: e.value,
            pagoEnCuotas: false,
            numeroCuotas: undefined
        });
        setResultado(null);
    };

    const onPagoEnCuotasChange = (checked: boolean) => {
        setCotizacion({ 
            ...cotizacion, 
            pagoEnCuotas: checked,
            numeroCuotas: checked ? 3 : undefined
        });
        setResultado(null);
    };

    const onNumeroCuotasChange = (e: any) => {
        setCotizacion({ ...cotizacion, numeroCuotas: e.value });
        setResultado(null);
    };

    const crearCotizacion = async () => {
        setSubmitted(true);
        setError('');

        // Asegurar que el usuarioId esté presente
        const usuario = authService.getCurrentUser();
        const cotizacionConUsuario = {
            ...cotizacion,
            usuarioId: usuario?.id || 1 // Usar ID 1 por defecto si no hay usuario
        };

        console.log('Datos de cotización a enviar:', cotizacionConUsuario);

        if (!cotizacionConUsuario.conductorId || !cotizacionConUsuario.vehiculoId || !cotizacionConUsuario.aceptaTerminos) {
            toast.current?.show({ 
                severity: 'warn', 
                summary: 'Advertencia', 
                detail: 'Complete todos los campos requeridos y acepte los términos', 
                life: 3000 
            });
            return;
        }

        setSaving(true);
        try {
            const response = await cotizacionService.create(cotizacionConUsuario);
            setResultado(response);
            toast.current?.show({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Cotización creada exitosamente', 
                life: 3000 
            });
        } catch (error: any) {
            setError(error.message);
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: error.message, 
                life: 5000 
            });
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);
    };

    const conductorTemplate = (option: Conductor) => {
        const edad = calcularEdad(option.fechaNacimiento);
        return `${option.nombreConductor} - ${edad} años - ${option.numeroAccidentes} accidentes`;
    };

    const vehiculoTemplate = (option: Vehiculo) => {
        return `${option.marca} ${option.modelo} (${option.numeroPlaca}) - ${option.tipo} - ${formatCurrency(option.valorComercial)}`;
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
                <Card title="📝 Nueva Cotización de Seguro" subTitle="Complete el formulario para generar una cotización">
                    {error && <Message severity="error" text={error} className="w-full mb-4" />}

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="conductor">Conductor *</label>
                                <Dropdown
                                    id="conductor"
                                    value={cotizacion.conductorId}
                                    onChange={onConductorChange}
                                    options={conductores}
                                    optionLabel="nombreConductor"
                                    optionValue="idConductor"
                                    placeholder="Seleccione un conductor"
                                    filter
                                    itemTemplate={conductorTemplate}
                                    className={classNames({ 'p-invalid': submitted && !cotizacion.conductorId })}
                                />
                                {submitted && !cotizacion.conductorId && <small className="p-error">Seleccione un conductor.</small>}
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="vehiculo">Vehículo *</label>
                                <Dropdown
                                    id="vehiculo"
                                    value={cotizacion.vehiculoId}
                                    onChange={onVehiculoChange}
                                    options={vehiculos}
                                    optionLabel="modelo"
                                    optionValue="idVehiculo"
                                    placeholder="Seleccione un vehículo"
                                    filter
                                    itemTemplate={vehiculoTemplate}
                                    className={classNames({ 'p-invalid': submitted && !cotizacion.vehiculoId })}
                                />
                                {submitted && !cotizacion.vehiculoId && <small className="p-error">Seleccione un vehículo.</small>}
                            </div>
                        </div>

                        <div className="col-12">
                            <Divider />
                            <h3>💳 Forma de Pago</h3>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="formaPago">Forma de Pago</label>
                                <Dropdown
                                    id="formaPago"
                                    value={cotizacion.formaPago}
                                    onChange={onFormaPagoChange}
                                    options={formasPago}
                                    placeholder="Seleccione forma de pago"
                                />
                            </div>
                        </div>

                        {cotizacion.formaPago && cotizacion.formaPago !== 'ANUAL' && (
                            <div className="col-12 md:col-6">
                                <div className="field-checkbox mt-4">
                                    <Checkbox
                                        inputId="pagoEnCuotas"
                                        checked={cotizacion.pagoEnCuotas}
                                        onChange={(e) => onPagoEnCuotasChange(e.checked || false)}
                                    />
                                    <label htmlFor="pagoEnCuotas" className="ml-2">Pago en cuotas (+15% recargo)</label>
                                </div>
                            </div>
                        )}

                        {cotizacion.pagoEnCuotas && (
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="numeroCuotas">Número de Cuotas</label>
                                    <Dropdown
                                        id="numeroCuotas"
                                        value={cotizacion.numeroCuotas}
                                        onChange={onNumeroCuotasChange}
                                        options={opcionesCuotas}
                                        placeholder="Seleccione cuotas"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="col-12">
                            <Divider />
                        </div>

                        <div className="col-12">
                            <div className="field-checkbox">
                                <Checkbox
                                    inputId="aceptaTerminos"
                                    checked={cotizacion.aceptaTerminos}
                                    onChange={(e) => setCotizacion({ ...cotizacion, aceptaTerminos: e.checked || false })}
                                    className={classNames({ 'p-invalid': submitted && !cotizacion.aceptaTerminos })}
                                />
                                <label htmlFor="aceptaTerminos" className="ml-2">
                                    Acepto los términos y condiciones del seguro *
                                </label>
                            </div>
                            {submitted && !cotizacion.aceptaTerminos && <small className="p-error block mt-1">Debe aceptar los términos y condiciones.</small>}
                        </div>

                        <div className="col-12">
                            <Button 
                                label={saving ? "Generando..." : "Generar Cotización"} 
                                icon="pi pi-calculator" 
                                onClick={crearCotizacion}
                                disabled={saving}
                                className="w-full md:w-auto"
                            />
                            <Button 
                                label="Ver Cotizaciones" 
                                icon="pi pi-list" 
                                severity="secondary"
                                outlined
                                onClick={() => router.push('/cotizaciones')}
                                className="w-full md:w-auto ml-0 md:ml-2 mt-2 md:mt-0"
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {resultado && (
                <div className="col-12">
                    <Card title="✅ Resultado de la Cotización" className="shadow-4">
                        <div className="grid">
                            <div className="col-12">
                                <Message 
                                    severity={resultado.detalles?.estado === 'aprobada' ? 'success' : 'warn'} 
                                    text={`Estado: ${resultado.detalles?.estado?.toUpperCase()}`} 
                                    className="w-full mb-3"
                                />
                            </div>

                            <div className="col-12 md:col-6 lg:col-3">
                                <Panel header="💰 Costo Base">
                                    <p className="text-2xl font-bold text-primary m-0">{formatCurrency(resultado.detalles?.costoBase || 0)}</p>
                                </Panel>
                            </div>

                            <div className="col-12 md:col-6 lg:col-3">
                                <Panel header="➕ Recargos">
                                    <p className="text-2xl font-bold text-orange-500 m-0">{formatCurrency(resultado.detalles?.recargoTotal || 0)}</p>
                                </Panel>
                            </div>

                            <div className="col-12 md:col-6 lg:col-3">
                                <Panel header="➖ Descuentos">
                                    <p className="text-2xl font-bold text-green-500 m-0">{formatCurrency(resultado.detalles?.descuentoTotal || 0)}</p>
                                </Panel>
                            </div>

                            <div className="col-12 md:col-6 lg:col-3">
                                <Panel header="💵 Costo Final">
                                    <p className="text-3xl font-bold text-primary m-0">{formatCurrency(resultado.detalles?.costoFinal || 0)}</p>
                                </Panel>
                            </div>

                            <div className="col-12">
                                <Divider />
                                <h3>📋 Detalles de Ajustes</h3>
                            </div>

                            {resultado.detalles?.detallesAjustes && (
                                <>
                                    {Object.keys(resultado.detalles.detallesAjustes.conductor || {}).length > 0 && (
                                        <div className="col-12 md:col-6">
                                            <h4>👤 Por Conductor:</h4>
                                            <ul>
                                                {Object.entries(resultado.detalles.detallesAjustes.conductor).map(([key, value]) => (
                                                    <li key={key}>{value as string}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {Object.keys(resultado.detalles.detallesAjustes.accidentes || {}).length > 0 && (
                                        <div className="col-12 md:col-6">
                                            <h4>💥 Por Accidentes:</h4>
                                            <ul>
                                                {Object.entries(resultado.detalles.detallesAjustes.accidentes).map(([key, value]) => (
                                                    <li key={key}>{value as string}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {Object.keys(resultado.detalles.detallesAjustes.vehiculo || {}).length > 0 && (
                                        <div className="col-12 md:col-6">
                                            <h4>🚗 Por Vehículo:</h4>
                                            <ul>
                                                {Object.entries(resultado.detalles.detallesAjustes.vehiculo).map(([key, value]) => (
                                                    <li key={key}><strong>{key}:</strong> {value as string}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {Object.keys(resultado.detalles.detallesAjustes.pago || {}).length > 0 && (
                                        <div className="col-12 md:col-6">
                                            <h4>💳 Por Forma de Pago:</h4>
                                            <ul>
                                                {Object.entries(resultado.detalles.detallesAjustes.pago).map(([key, value]) => (
                                                    <li key={key}>{value as string}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}

                            {resultado.detalles?.advertencias && resultado.detalles.advertencias.length > 0 && (
                                <div className="col-12">
                                    <Message severity="warn" className="w-full">
                                        <ul className="m-0 pl-3">
                                            {resultado.detalles.advertencias.map((adv: string, i: number) => (
                                                <li key={i}>{adv}</li>
                                            ))}
                                        </ul>
                                    </Message>
                                </div>
                            )}

                            <div className="col-12">
                                <p className="text-500">
                                    <i className="pi pi-calendar mr-2"></i>
                                    Vigencia: {resultado.detalles?.vigencia} días (hasta {resultado.detalles?.fechaVencimiento})
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default NuevaCotizacionPage;
