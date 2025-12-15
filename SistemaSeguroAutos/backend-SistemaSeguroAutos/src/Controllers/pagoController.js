import { Pago } from "../Models/Pago.js";
import { Cotizacion } from "../Models/Cotizacion.js";
import * as pagoService from "../Services/pagoService.js";

// procesar un pago
export const procesarPagoController = async (req, res) => {
    try {
        const { conductorId, usuarioId, vehiculoId, formaPago, tipoPago } = req.body;

        if (!conductorId || !usuarioId || !vehiculoId || !formaPago || !tipoPago) {
            return res.status(400).json({
                mensaje: "conductorId, usuarioId, vehiculoId, formaPago y tipoPago son obligatorios"
            });
        }

        const resultado = await pagoService.procesarPago(conductorId, usuarioId, vehiculoId, formaPago, tipoPago);

        if (!resultado.exito) {
            return res.status(400).json({
                mensaje: resultado.razon || resultado.mensaje
            });
        }

        res.status(200).json({
            idPago: resultado.idPago,
            idCotizacion: resultado.idCotizacion,
            estadoPago: resultado.estado,
            montoBase: resultado.montoBase,
            montoFinal: resultado.montoFinal,
            transaccionId: resultado.transaccionId
        });

    } catch (error) {
        console.error("Error al procesar pago:", error);
        res.status(500).json({ error: error.message });
    }
};

// obtener pagos por cotización
export const obtenerPagosPorCotizacion = async (req, res) => {
    try {
        const { cotizacionId } = req.params;

        // Verificar que la cotización existe
        const cotizacion = await Cotizacion.findByPk(cotizacionId);
        if (!cotizacion) {
            return res.status(404).json({
                mensaje: "Cotización no encontrada"
            });
        }

        const pagos = await Pago.findAll({
            where: { cotizacionId }
        });

        res.status(200).json(pagos);

    } catch (error) {
        console.error("Error al obtener pagos:", error);
        res.status(500).json({ mensaje: "Error al obtener pagos de la cotización" });
    }
};

// obtener un pago por id
export const obtenerPago = async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id, {
            include: [
                { model: Cotizacion, as: "cotizacion", attributes: ["idCotizacion", "costoFinal"] }
            ]
        });

        if (!pago) {
            return res.status(404).json({
                mensaje: "Pago no encontrado"
            });
        }

        res.status(200).json(pago);

    } catch (error) {
        console.error("Error al obtener pago:", error);
        res.status(500).json({ mensaje: "Error al obtener pago" });
    }
};

//obtener todos los pagos
export const obtenerPagos = async (req, res) => {
    try {
        const { estado } = req.query;

        let filtro = {};
        if (estado) filtro.estado = estado.toLowerCase();

        const pagos = await Pago.findAll({
            where: filtro,
            include: [
                { model: Cotizacion, as: "cotizacion", attributes: ["idCotizacion", "costoFinal"] }
            ],
            order: [['fechaPago', 'DESC']]
        });

        res.status(200).json(pagos);

    } catch (error) {
        console.error("Error al obtener pagos:", error.message);
        console.error("Stack:", error.stack);
        res.status(500).json({ mensaje: "Error al obtener pagos", error: error.message });
    }
};

// actualizar estado de un pago
export const actualizarEstadoPago = async (req, res) => {
    try {
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                mensaje: "estado es obligatorio"
            });
        }

        const estadosValidos = ["pendiente", "aprobado", "rechazado"];
        if (!estadosValidos.includes(estado.toLowerCase())) {
            return res.status(400).json({
                mensaje: `Estado inválido. Debe ser: ${estadosValidos.join(", ")}`
            });
        }

        const pago = await Pago.findByPk(req.params.id);

        if (!pago) {
            return res.status(404).json({
                mensaje: "Pago no encontrado"
            });
        }

        pago.estado = estado.toLowerCase();
        await pago.save();

        res.status(200).json(pago);

    } catch (error) {
        console.error("Error al actualizar pago:", error);
        res.status(500).json({ mensaje: "Error al actualizar pago", error: error.message });
    }
};

//eliminar un pago
export const eliminarPago = async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id);

        if (!pago) {
            return res.status(404).json({
                mensaje: "Pago no encontrado"
            });
        }

        await pago.destroy();

        res.status(204).send();

    } catch (error) {
        console.error("Error al eliminar pago:", error);
        res.status(500).json({ mensaje: "Error al eliminar pago", error: error.message });
    }
};

// verificar si un pago fue aprobado
export const verificarPagoAprobadoController = async (req, res) => {
    try {
        const { cotizacionId } = req.params;

        // Verificar que la cotización existe
        const cotizacion = await Cotizacion.findByPk(cotizacionId);
        if (!cotizacion) {
            return res.status(404).json({
                mensaje: "Cotización no encontrada"
            });
        }

        const resultado = await pagoService.verificarPagoAprobado(cotizacionId);

        res.status(200).json({
            cotizacionId: parseInt(cotizacionId),
            tienePA: resultado.tienePA,
            pago: resultado.pago
        });

    } catch (error) {
        console.error("Error al verificar pago:", error);
        res.status(500).json({ mensaje: "Error al verificar pago", error: error.message });
    }
};

// calcular monto final con forma de pago
export const calcularMontoFinalPreview = async (req, res) => {
    try {
        const { montoBase, formaPago } = req.body;

        if (!montoBase || !formaPago) {
            return res.status(400).json({
                mensaje: "montoBase y formaPago son obligatorios"
            });
        }

        const resultado = pagoService.calcularMontoConFormaPago(montoBase, formaPago);

        res.status(200).json(resultado);

    } catch (error) {
        console.error("Error al calcular monto:", error);
        res.status(500).json({ mensaje: "Error al calcular monto", error: error.message });
    }
};


