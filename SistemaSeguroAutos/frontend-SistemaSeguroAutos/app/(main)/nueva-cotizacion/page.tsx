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

        // Validación inmediata de edad del conductor para evitar llamadas innecesarias
        const conductorSeleccionado = conductores.find(c => c.idConductor === cotizacionConUsuario.conductorId);
        if (conductorSeleccionado) {
            const edad = calcularEdad(conductorSeleccionado.fechaNacimiento);
            if (edad < 18) {
                const msg = `Conductor menor de 18 años (${edad} años). No se permite generar cotización.`;
                setError(msg);
                toast.current?.show({ severity: 'error', summary: 'No permitido', detail: msg, life: 5000 });
                return;
            }
            if (edad > 75) {
                const msg = `Conductor mayor de 75 años (${edad} años). La cotización se rechaza automáticamente.`;
                setError(msg);
                toast.current?.show({ severity: 'error', summary: 'No permitido', detail: msg, life: 5000 });
                return;
            }
            if (edad > 65) {
                toast.current?.show({ severity: 'warn', summary: 'Edad avanzada', detail: 'Se aplicará recargo y posibles restricciones de cobertura', life: 4000 });
            } else if (edad >= 18 && edad <= 24) {
                toast.current?.show({ severity: 'warn', summary: 'Conductor joven', detail: 'Se aplicará recargo por conductor joven (18-24)', life: 4000 });
            }
            if ((conductorSeleccionado.numeroAccidentes ?? 0) > 3) {
                toast.current?.show({ severity: 'warn', summary: 'Riesgo alto por accidentes', detail: 'Más de 3 accidentes: la cotización puede quedar pendiente o con recargo alto', life: 5000 });
            }
        }

        const vehiculoSeleccionado = vehiculos.find(v => v.idVehiculo === cotizacionConUsuario.vehiculoId);
        if (vehiculoSeleccionado) {
            const antiguedad = new Date().getFullYear() - vehiculoSeleccionado.anio;
            if (antiguedad > 20) {
                const msg = `Vehículo con ${antiguedad} años. No puede ser cotizado (>20 años).`;
                setError(msg);
                toast.current?.show({ severity: 'error', summary: 'No permitido', detail: msg, life: 5000 });
                return;
            }
        }

        setSaving(true);
        try {
            const response = await cotizacionService.create(cotizacionConUsuario);
            setResultado(response);
            const estado = response?.detalles?.estado?.toLowerCase?.() || 'aprobada';
            const detalle = estado === 'rechazada'
                ? (response?.mensaje || 'Cotización rechazada por reglas de negocio')
                : 'Cotización creada exitosamente';

            toast.current?.show({ 
                severity: estado === 'rechazada' ? 'error' : 'success', 
                summary: estado === 'rechazada' ? 'Rechazada' : 'Éxito', 
                detail: detalle, 
                life: 5000 
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
        const riesgo = getRiesgoConductor(edad);
        return `${option.nombreConductor} - ${edad} años - ${option.numeroAccidentes} accidentes - ${riesgo}`;
    };

    const vehiculoTemplate = (option: Vehiculo) => {
        const antiguedad = new Date().getFullYear() - option.anio;
        return `${option.marca} ${option.modelo} (${option.numeroPlaca}) - ${option.tipo} - ${antiguedad} años - ${formatCurrency(option.valorComercial)}`;
    };

    const getRiesgoConductor = (edad: number) => {
        if (edad < 18) return 'No cotiza (<18)';
        if (edad <= 24) return 'Recargo conductor joven';
        if (edad <= 65) return 'Riesgo estándar';
        if (edad <= 75) return 'Recargo edad avanzada';
        return 'Rechazo (>75)';
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
                                {cotizacion.conductorId !== 0 && (() => {
                                    const c = conductores.find(x => x.idConductor === cotizacion.conductorId);
                                    if (!c) return null;
                                    const edad = calcularEdad(c.fechaNacimiento);
                                    const riesgo = getRiesgoConductor(edad);
                                    const accidentes = c.numeroAccidentes ?? 0;
                                    const severity = edad < 18 || edad > 75 ? 'error' : (edad <= 24 || edad > 65 || accidentes > 3 ? 'warn' : 'info');
                                    const msgEdad = `Riesgo: ${riesgo} (edad ${edad})`;
                                    const msgAcc = accidentes === 0 ? 'Sin accidentes: aplica descuento' : `${accidentes} accidente(s)` + (accidentes > 3 ? ' — riesgo alto (puede requerir revisión)' : '');
                                    return (
                                        <Message severity={severity} text={`${msgEdad}. ${msgAcc}`} className="w-full mt-2" />
                                    );
                                })()}
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
                                {cotizacion.vehiculoId !== 0 && (() => {
                                    const v = vehiculos.find(x => x.idVehiculo === cotizacion.vehiculoId);
                                    if (!v) return null;
                                    const antiguedad = new Date().getFullYear() - v.anio;
                                    const recargoUso = v.uso === 'comercial' ? 'Recargo por uso comercial' : 'Uso particular';
                                    const tipoBase = v.tipo?.toLowerCase() === 'suv' || v.tipo?.toLowerCase() === 'camioneta' ? 'Costo base incrementado' : 'Costo base estándar';
                                    const severity = antiguedad > 20 ? 'error' : (v.uso === 'comercial' ? 'warn' : 'info');
                                    const msgAnt = antiguedad > 20 ? `Antigüedad ${antiguedad} años: no cotiza (>20)` : `Antigüedad ${antiguedad} años`;
                                    return (
                                        <Message severity={severity} text={`${tipoBase} · ${recargoUso} · ${msgAnt}`} className="w-full mt-2" />
                                    );
                                })()}
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

                        {cotizacion.formaPago && (
                            <div className="col-12">
                                <Message 
                                    severity={cotizacion.formaPago === 'tarjeta_debito' ? 'warn' : 'info'}
                                    text={cotizacion.formaPago === 'tarjeta_debito' 
                                        ? 'Tarjeta de débito: activación pendiente hasta aprobación del banco.'
                                        : (cotizacion.formaPago === 'tarjeta_credito' 
                                            ? (cotizacion.pagoEnCuotas ? 'Tarjeta de crédito en cuotas: +15% recargo y emisión inmediata.' : 'Tarjeta de crédito: emisión inmediata. Puede aplicar descuento anual si eliges ANUAL.')
                                            : 'Pago anual: 10% de descuento y emisión inmediata.')}
                                    className="w-full"
                                />
                            </div>
                        )}

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
                                {(() => {
                                    const estado = resultado.detalles?.estado?.toLowerCase?.() || 'aprobada';
                                    let severity: 'success' | 'warn' | 'error' = 'success';
                                    let text = `Estado: ${estado.toUpperCase()}`;
                                    if (estado === 'rechazada') {
                                        severity = 'error';
                                        text = resultado.mensaje || 'Cotización rechazada por reglas de negocio';
                                    } else if (estado === 'pendiente') {
                                        severity = 'warn';
                                        text = resultado.mensaje || 'Cotización pendiente por revisión o pago';
                                    }
                                    return <Message severity={severity} text={text} className="w-full mb-3" />;
                                })()}
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
