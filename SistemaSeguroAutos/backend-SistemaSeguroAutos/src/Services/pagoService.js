import { Pago } from "../Models/Pago.js";
import { Cotizacion } from "../Models/Cotizacion.js";

// constantes para calculos de pago
const DESCUENTO_PAGO_ANUAL = 0.10; // 10% descuento pago anual
const RECARGO_PAGO_CUOTAS = 0.15; // 15% recargo pago en cuotas
const ESTADO_PAGO_EXITOSO_SIMULADO = 0.90; // 90% de probabilidad de éxito

// validar los datos del pago
const validarDatosPago = (datosPago) => {
    const { cotizacionId, tipoPago, formaPago, monto } = datosPago;
    
    if (!cotizacionId || !tipoPago || !formaPago || !monto) {
        return {
            valido: false,
            razon: "Faltan datos requeridos: cotizacionId, tipoPago, formaPago, monto"
        };
    }
    
    const tiposPagosValidos = ["credito", "debito"];
    if (!tiposPagosValidos.includes(tipoPago.toLowerCase())) {
        return {
            valido: false,
            razon: "Tipo de pago inválido. Debe ser: credito o debito"
        };
    }
    
    const formasPagoValidas = ["contado", "cuotas"];
    if (!formasPagoValidas.includes(formaPago.toLowerCase())) {
        return {
            valido: false,
            razon: "Forma de pago inválida. Debe ser: contado o cuotas"
        };
    }
    
    if (monto <= 0) {
        return {
            valido: false,
            razon: "El monto debe ser mayor a 0"
        };
    }
    
    return { valido: true };
};

// simular pasarela de pago
const simularPasarelaPago = (tipoPago, monto) => {
    const exito = Math.random() > (1 - ESTADO_PAGO_EXITOSO_SIMULADO);
    
    const transaccionId = exito
        // simular un ID de transacción 
        ? `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        : null;
    
    const mensaje = exito 
        ? `Pago procesado exitosamente con ${tipoPago.toUpperCase()}`
        : "Error en el procesamiento del pago. Intente de nuevo.";
    
    return {
        exito,
        transaccionId,
        mensaje,
        fechaProceso: new Date(),
        tipoPago: tipoPago.toUpperCase(),
        monto
    };
};

// calcular el monto final segun forma de pago
const calcularMontoFinal = (montoBase, formaPago) => {
    let montoFinal = parseFloat(montoBase);
    
    if (formaPago.toLowerCase() === "contado") {
        montoFinal = montoBase * (1 - DESCUENTO_PAGO_ANUAL);
    } else if (formaPago.toLowerCase() === "cuotas") {
        montoFinal = montoBase * (1 + RECARGO_PAGO_CUOTAS);
    }
    
    return parseFloat(montoFinal.toFixed(2));
};

// procesar un pago
export const procesarPago = async (conductorId, usuarioId, vehiculoId, formaPago, tipoPago) => {
    try {
        // Buscar cotización vigente
        const cotizacion = await Cotizacion.findOne({
            where: {
                conductorId,
                usuarioId,
                vehiculoId,
                estado: "aprobada"
            }
        });
        
        if (!cotizacion) {
            return {
                exito: false,
                razon: "No existe cotización aprobada para estos datos"
            };
        }
        
        // Validar datos del pago
        const datosPago = {
            cotizacionId: cotizacion.idCotizacion,
            tipoPago,
            formaPago,
            monto: cotizacion.costoFinal
        };
        
        const validacion = validarDatosPago(datosPago);
        if (!validacion.valido) {
            return {
                exito: false,
                razon: validacion.razon
            };
        }
        
        // Calcular monto final según forma de pago
        const montoFinal = calcularMontoFinal(cotizacion.costoFinal, formaPago);
        
        // Simular procesamiento en pasarela
        const resultadoPasarela = simularPasarelaPago(tipoPago, montoFinal);
        
        // Determinar estado del pago
        const estado = resultadoPasarela.exito ? "aprobado" : "rechazado";
        
        // Crear registro de pago
        const pago = await Pago.create({
            cotizacionId: cotizacion.idCotizacion,
            fechaPago: new Date().toISOString().split('T')[0],
            tipoPago: tipoPago.toLowerCase(),
            formaPago: formaPago.toLowerCase(),
            monto: montoFinal,
            estado
        });
        
        return {
            exito: resultadoPasarela.exito,
            idPago: pago.idPago,
            idCotizacion: cotizacion.idCotizacion,
            estado,
            montoBase: cotizacion.costoFinal,
            montoFinal,
            diferencia: montoFinal - cotizacion.costoFinal,
            transaccionId: resultadoPasarela.transaccionId,
            mensaje: resultadoPasarela.mensaje,
            detalles: {
                tipoPago: tipoPago.toUpperCase(),
                formaPago: formaPago.toUpperCase(),
                descuentoAplicado: formaPago.toLowerCase() === "contado" ? `${DESCUENTO_PAGO_ANUAL * 100}%` : "0%",
                recargoAplicado: formaPago.toLowerCase() === "cuotas" ? `${RECARGO_PAGO_CUOTAS * 100}%` : "0%"
            }
        };
        
    } catch (error) {
        console.error("Error al procesar pago:", error);
        return {
            exito: false,
            razon: "Error interno al procesar el pago",
            error: error.message
        };
    }
};

// obtener pagos de una cotizacion
export const obtenerPagosCotizacion = async (cotizacionId) => {
    try {
        const pagos = await Pago.findAll({
            where: { cotizacionId }
        });
        
        return {
            exito: true,
            cantidad: pagos.length,
            pagos: pagos.map(p => ({
                idPago: p.idPago,
                idCotizacion: p.cotizacionId,
                fechaPago: p.fechaPago,
                tipoPago: p.tipoPago,
                formaPago: p.formaPago,
                monto: p.monto,
                estado: p.estado
            }))
        };
        
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        return {
            exito: false,
            razon: "Error al obtener los pagos"
        };
    }
};

// verificar si una cotizacion tiene pago aprobado
export const verificarPagoAprobado = async (cotizacionId) => {
    try {
        const pago = await Pago.findOne({
            where: {
                cotizacionId,
                estado: "aprobado"
            }
        });
        
        return {
            tienePA: pago !== null,
            pago: pago ? {
                idPago: pago.idPago,
                fechaPago: pago.fechaPago,
                monto: pago.monto
            } : null
        };
        
    } catch (error) {
        console.error("Error al verificar pago:", error);
        return {
            tienePA: false,
            error: error.message
        };
    }
};

// calcular monto final con forma de pago
export const calcularMontoConFormaPago = (montoBase, formaPago) => {
    const formaPagoLower = formaPago.toLowerCase();
    const montoFinal = calcularMontoFinal(montoBase, formaPagoLower);
    const diferencia = montoFinal - montoBase;
    
    return {
        montoBase,
        montoFinal,
        diferencia,
        porcentaje: formaPagoLower === "contado" 
            ? `-${DESCUENTO_PAGO_ANUAL * 100}%` 
            : `+${RECARGO_PAGO_CUOTAS * 100}%`,
        ahorroORecargo: formaPagoLower === "contado" ? Math.abs(diferencia) : diferencia
    };
};
