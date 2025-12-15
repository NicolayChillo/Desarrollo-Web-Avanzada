import { Cotizacion } from "../Models/Cotizacion.js";
import { Conductor } from "../Models/Conductor.js";
import { Usuario } from "../Models/Usuario.js";
import { Vehiculo } from "../Models/Vehiculo.js";
import * as cotizacionService from "../Services/cotizacionService.js";

// crear una nueva cotizacion
export const crearCotizacion = async (req, res) => {
    try {
        const { conductorId, usuarioId, vehiculoId, formaPago } = req.body;

        if (!conductorId || !usuarioId || !vehiculoId) {
            return res.status(400).json({
                mensaje: "conductorId, usuarioId y vehiculoId son obligatorios"
            });
        }

        // Calcular cotizacion
        const resultado = await cotizacionService.calcularCotizacion(
            conductorId,
            usuarioId,
            vehiculoId,
            formaPago
        );

        if (!resultado.exito) {
            return res.status(400).json({
                mensaje: resultado.mensaje,
                detalles: resultado.datos
            });
        }

        // Determinar estado (si el cliente lo envía, validarlo; si no, 'pendiente')
        const estadosValidos = ["pendiente", "aprobada", "rechazada"];
        const estadoBody = (req.body.estado || "").toLowerCase();
        const estadoFinal = estadosValidos.includes(estadoBody) ? estadoBody : "pendiente";

        // Guardar cotizacion
        const nuevaCotizacion = await Cotizacion.create({
            conductorId,
            usuarioId,
            vehiculoId,
            costoBase: resultado.datos.costoBase,
            costoFinal: resultado.datos.costoFinal,
            descuentos: resultado.datos.descuentoTotal ?? 0,
            recargos: resultado.datos.recargoTotal ?? 0,
            estado: resultado.datos.estado || estadoFinal,
            aceptaTerminos: req.body.aceptaTerminos ?? false,
            formaPago: req.body.formaPago || null,
            pagoEnCuotas: req.body.pagoEnCuotas ?? false,
            numeroCuotas: req.body.numeroCuotas || null,
            fechaVencimiento: resultado.datos.fechaVencimiento,
            detalleCalculo: resultado.datos
        });

        res.status(201).json({
            mensaje: "Cotización creada exitosamente",
            cotizacion: nuevaCotizacion,
            detalles: resultado.datos
        });

    } catch (error) {
        console.error("Error al crear cotización:", error);
        res.status(500).json({ error: error.message });
    }
};

// obtener una cotización por id
export const obtenerCotizacion = async (req, res) => {
    try {
        const cotizacion = await Cotizacion.findByPk(req.params.id, {
            include: [
                { model: Usuario, as: "usuario", attributes: ["idUsuario", "nombreUsuario", "email"] },
                { model: Conductor, as: "conductor", attributes: ["idConductor", "nombreConductor", "fechaNacimiento"] },
                { model: Vehiculo, as: "vehiculo", attributes: ["idVehiculo", "numeroPlaca", "modelo", "tipo"] }
            ]
        });

        if (!cotizacion) {
            return res.status(404).json({
                mensaje: "Cotización no encontrada"
            });
        }

        res.status(200).json(cotizacion);

    } catch (error) {
        console.error("Error al obtener cotización:", error);
        res.status(500).json({ mensaje: "Error al obtener cotización" });
    }
};

// obtener todas las cotizaciones
export const obtenerCotizaciones = async (req, res) => {
    try {
        const { estado } = req.query;

        let filtro = {};
        if (estado) filtro.estado = estado.toLowerCase();

        const cotizaciones = await Cotizacion.findAll({
            where: filtro,
            include: [
                { model: Usuario, as: "usuario", attributes: ["idUsuario", "nombreUsuario", "email"] },
                { model: Conductor, as: "conductor", attributes: ["idConductor", "nombreConductor"] },
                { model: Vehiculo, as: "vehiculo", attributes: ["idVehiculo", "numeroPlaca", "modelo"] }
            ],
            order: [['fechaCreacion', 'DESC']]
        });

        res.status(200).json(cotizaciones);

    } catch (error) {
        console.error("Error al obtener cotizaciones:", error.message);
        res.status(500).json({ mensaje: "Error al obtener cotizaciones", error: error.message });
    }
};

// actualizar estado de una cotizacion
export const actualizarEstadoCotizacion = async (req, res) => {
    try {
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                mensaje: "estado es obligatorio"
            });
        }

        const estadosValidos = ["pendiente", "aprobada", "rechazada"];
        if (!estadosValidos.includes(estado.toLowerCase())) {
            return res.status(400).json({
                mensaje: `Estado inválido. Debe ser: ${estadosValidos.join(", ")}`
            });
        }

        const cotizacion = await Cotizacion.findByPk(req.params.id);

        if (!cotizacion) {
            return res.status(404).json({
                mensaje: "Cotización no encontrada"
            });
        }

        cotizacion.estado = estado.toLowerCase();
        await cotizacion.save();

        res.status(200).json(cotizacion);

    } catch (error) {
        console.error("Error al actualizar estado de cotización:", error);
        res.status(500).json({ mensaje: "Error al actualizar estado", error: error.message });
    }
};

// eliminar una cotizacion
export const eliminarCotizacion = async (req, res) => {
    try {
        const cotizacion = await Cotizacion.findByPk(req.params.id);

        if (!cotizacion) {
            return res.status(404).json({
                mensaje: "Cotización no encontrada"
            });
        }

        await cotizacion.destroy();

        res.status(204).send();

    } catch (error) {
        console.error("Error al eliminar cotización:", error);
        res.status(500).json({ mensaje: "Error al eliminar cotización", error: error.message });
    }
};

// verificar vigencia de una cotizacion
export const verificarVigenciaCotizacion = async (req, res) => {
    try {
        const cotizacion = await Cotizacion.findByPk(req.params.id);

        if (!cotizacion) {
            return res.status(404).json({
                mensaje: "Cotización no encontrada"
            });
        }

        const vigencia = cotizacionService.verificarVigencia(cotizacion);

        res.status(200).json({
            idCotizacion: cotizacion.idCotizacion,
            vigente: vigencia,
            fechaCreacion: cotizacion.fechaCreacion,
            estado: cotizacion.estado
        });

    } catch (error) {
        console.error("Error al verificar vigencia:", error);
        res.status(500).json({ mensaje: "Error al verificar vigencia", error: error.message });
    }
};
