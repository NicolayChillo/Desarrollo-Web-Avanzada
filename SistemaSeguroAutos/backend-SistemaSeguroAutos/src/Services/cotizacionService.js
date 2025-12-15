import { Cotizacion } from "../Models/Cotizacion.js";
import { Conductor } from "../Models/Conductor.js";
import { Vehiculo } from "../Models/Vehiculo.js";
import { Usuario } from "../Models/Usuario.js";
import { Accidente } from "../Models/Accidente.js";

// Constantes para calculos de cotizacion
const COSTO_BASE_SEDAN = 500;
const COSTO_BASE_SUV = 750;
const COSTO_BASE_CAMIONETA = 800;

const RECARGO_CONDUCTOR_JOVEN = 0.25; // 25% recargo (18-24 años)
const RECARGO_EDAD_AVANZADA = 0.20; // 20% recargo (>65 años)
const DESCUENTO_SIN_ACCIDENTES = 0.10; // 10% descuento
const RECARGO_POR_ACCIDENTE = 0.15; // 15% por cada accidente
const RECARGO_USO_COMERCIAL = 0.30; // 30% recargo por uso comercial
const DESCUENTO_PAGO_ANUAL = 0.10; // 10% descuento pago anual
const RECARGO_PAGO_CUOTAS = 0.15; // 15% recargo pago en cuotas

const VIGENCIA_COTIZACION = 30; // días

// calcula la edad a partir de la fecha de nacimiento
const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    
    return edad;
};

// valida si el conductor es apto para cotizar
const validarConductor = (conductor) => {
    const edad = calcularEdad(conductor.fechaNacimiento);
    const resultado = { valido: true, razon: null, edad };
    
    if (edad < 18) {
        resultado.valido = false;
        resultado.razon = `Conductor menor de 18 años (${edad} años). No se permite generar cotización.`;
    } else if (edad > 75) {
        resultado.valido = false;
        resultado.razon = `Conductor mayor de 75 años (${edad} años). Cotización rechazada automáticamente.`;
    }
    
    return resultado;
};

// valida si el vehículo es apto para cotizar
const validarVehiculo = (vehiculo) => {
    const añoActual = new Date().getFullYear();
    const antiguedad = añoActual - vehiculo.anio;
    const resultado = { valido: true, razon: null, antiguedad };
    
    if (antiguedad > 20) {
        resultado.valido = false;
        resultado.razon = `Vehículo con ${antiguedad} años de antigüedad. Vehículos con más de 20 años no pueden ser cotizados.`;
    }
    
    return resultado;
};

// obtiene el costo base segun el tipo de vehiculo
const obtenerCostoBase = (tipoVehiculo) => {
    switch (tipoVehiculo.toLowerCase()) {
        case "sedan":
            return COSTO_BASE_SEDAN;
        case "suv":
            return COSTO_BASE_SUV;
        case "camioneta":
            return COSTO_BASE_CAMIONETA;
        default:
            return COSTO_BASE_SEDAN;
    }
};

// calcula ajustes por edad del conductor
const calcularAjustesConductor = (conductor, edad) => {
    let recargo = 0;
    let descuento = 0;
    const detalles = {};
    
    if (edad >= 18 && edad <= 24) {
        recargo += RECARGO_CONDUCTOR_JOVEN;
        detalles.recargoJoven = `${RECARGO_CONDUCTOR_JOVEN * 100}% (edad ${edad})`;
    } else if (edad > 65 && edad <= 75) {
        recargo += RECARGO_EDAD_AVANZADA;
        detalles.recargoEdad = `${RECARGO_EDAD_AVANZADA * 100}% (edad ${edad})`;
    }
    
    return { recargo, descuento, detalles };
};

// calcula ajustes por accidentes del conductor
const calcularAjustesAccidentes = async (conductorId) => {
    let recargo = 0;
    let descuento = 0;
    const detalles = {};
    
    const accidentes = await Accidente.findAll({
        where: { conductorId }
    });
    
    const cantidadAccidentes = accidentes.length;
    
    if (cantidadAccidentes === 0) {
        descuento = DESCUENTO_SIN_ACCIDENTES;
        detalles.descuentoSinAccidentes = `${DESCUENTO_SIN_ACCIDENTES * 100}% (sin accidentes)`;
    } else if (cantidadAccidentes <= 3) {
        recargo = RECARGO_POR_ACCIDENTE * cantidadAccidentes;
        detalles.recargoPorAccidentes = `${recargo * 100}% (${cantidadAccidentes} accidentes)`;
    }
    
    return { recargo, descuento, cantidadAccidentes, detalles, requiereRevision: cantidadAccidentes > 3 };
};

// calcula la cotización completa
export const calcularCotizacion = async (conductorId, usuarioId, vehiculoId, formaPago) => {
    try {
        // Validar existencia de registros
        const conductor = await Conductor.findByPk(conductorId);
        const vehiculo = await Vehiculo.findByPk(vehiculoId);
        const usuario = await Usuario.findByPk(usuarioId);
        
        if (!conductor || !vehiculo || !usuario) {
            return {
                exito: false,
                mensaje: "Conductor, vehículo o usuario no encontrado",
                datos: null
            };
        }
        
        // Validar conductor
        const validacionConductor = validarConductor(conductor);
        if (!validacionConductor.valido) {
            return {
                exito: false,
                mensaje: validacionConductor.razon,
                datos: null
            };
        }
        
        // Validar vehiculo
        const validacionVehiculo = validarVehiculo(vehiculo);
        if (!validacionVehiculo.valido) {
            return {
                exito: false,
                mensaje: validacionVehiculo.razon,
                datos: null
            };
        }
        
        // Obtener costo base segun tipo de vehiculo
        let costoBase = obtenerCostoBase(vehiculo.tipo);
        
        // Ajustar por valor comercial del vehiculo (por cada 10000 de valor, suma 50)
        const ajusteValor = (vehiculo.valorComercial / 10000) * 50;
        costoBase += ajusteValor;
        
        // Calcular ajustes del conductor (edad)
        const ajustesConductor = calcularAjustesConductor(conductor, validacionConductor.edad);
        
        // Calcular ajustes por accidentes
        const ajustesAccidentes = await calcularAjustesAccidentes(conductorId);
        
        // Ajustar por uso comercial
        let recargoComercial = 0;
        if (vehiculo.uso === "comercial") {
            recargoComercial = RECARGO_USO_COMERCIAL;
        }
        
        // Calcular totales antes de forma de pago
        const recargoTotal = ajustesConductor.recargo + ajustesAccidentes.recargo + recargoComercial;
        const descuentoTotal = ajustesConductor.descuento + ajustesAccidentes.descuento;
        
        // Aplicar recargos y descuentos
        let costoFinal = costoBase * (1 + recargoTotal) * (1 - descuentoTotal);
        
        // Ajustes por forma de pago (si se proporciona)
        let detallesPago = {};
        if (formaPago) {
            if (formaPago.toUpperCase() === "ANUAL") {
                costoFinal = costoFinal * (1 - DESCUENTO_PAGO_ANUAL);
                detallesPago.descuentoAnual = `${DESCUENTO_PAGO_ANUAL * 100}%`;
            } else if (formaPago.toUpperCase() === "CUOTAS") {
                costoFinal = costoFinal * (1 + RECARGO_PAGO_CUOTAS);
                detallesPago.recargoCuotas = `${RECARGO_PAGO_CUOTAS * 100}%`;
            }
        }
        
        costoFinal = parseFloat(costoFinal.toFixed(2));
        
        // Determinar estado de la cotización
        let estado = "aprobada";
        let advertencias = [];
        
        if (ajustesAccidentes.requiereRevision) {
            estado = "pendiente";
            advertencias.push("Más de 3 accidentes. Requiere revisión manual antes de aprobar.");
        }
        
        return {
            exito: true,
            datos: {
                costoBase: parseFloat(costoBase.toFixed(2)),
                recargoTotal: parseFloat((recargoTotal * costoBase).toFixed(2)),
                descuentoTotal: parseFloat((descuentoTotal * costoBase * (1 + recargoTotal)).toFixed(2)),
                costoFinal,
                estado,
                vigencia: VIGENCIA_COTIZACION,
                fechaVencimiento: new Date(new Date().setDate(new Date().getDate() + VIGENCIA_COTIZACION)).toISOString().split('T')[0],
                detallesAjustes: {
                    conductor: ajustesConductor.detalles,
                    accidentes: ajustesAccidentes.detalles,
                    vehiculo: {
                        usoComercial: vehiculo.uso === "comercial" ? `${RECARGO_USO_COMERCIAL * 100}%` : "No aplica",
                        antiguedad: `${validacionVehiculo.antiguedad} años`
                    },
                    pago: detallesPago
                },
                advertencias
            }
        };
        
    } catch (error) {
        console.error("Error al calcular cotización:", error);
        return {
            exito: false,
            mensaje: "Error al calcular la cotización",
            error: error.message
        };
    }
};

// verificar la vigencia de una cotización
export const verificarVigencia = (cotizacion) => {
    const fechaCreacion = new Date(cotizacion.fechaCreacion);
    const diasTranscurridos = Math.floor((new Date() - fechaCreacion) / (1000 * 60 * 60 * 24));
    
    return {
        valida: diasTranscurridos <= VIGENCIA_COTIZACION,
        diasRestantes: VIGENCIA_COTIZACION - diasTranscurridos,
        diasTranscurridos
    };
};

// obtener un resumen de la cotizacion
export const obtenerResumenCotizacion = async (cotizacion) => {
    const conductor = await Conductor.findByPk(cotizacion.conductorId);
    const vehiculo = await Vehiculo.findByPk(cotizacion.vehiculoId);
    const usuario = await Usuario.findByPk(cotizacion.usuarioId);
    const vigencia = verificarVigencia(cotizacion);
    
    return {
        idCotizacion: cotizacion.idCotizacion,
        fechaCreacion: cotizacion.fechaCreacion,
        estado: cotizacion.estado,
        vigencia,
        cliente: {
            nombre: usuario.nombreUsuario,
            email: usuario.email
        },
        conductor: {
            nombre: conductor.nombreConductor,
            licencia: conductor.numeroLicenia,
            fechaNacimiento: conductor.fechaNacimiento,
            edad: calcularEdad(conductor.fechaNacimiento)
        },
        vehiculo: {
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            tipo: vehiculo.tipo,
            anio: vehiculo.anio,
            placa: vehiculo.numeroPlaca,
            valor: vehiculo.valorComercial
        },
        costos: {
            costoBase: cotizacion.costoBase,
            recargoTotal: cotizacion.recargos,
            descuentoTotal: cotizacion.descuentos,
            costoFinal: cotizacion.costoFinal
        }
    };
};
