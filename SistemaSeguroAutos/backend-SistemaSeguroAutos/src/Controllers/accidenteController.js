import { Accidente } from "../Models/Accidente.js";
import { Conductor } from "../Models/Conductor.js";

// crear accidente
export const crearAccidente = async (req, res) => {
    try {
        const { conductorId, vehiculoId, fechaAccidente, descripcion, gravedad } = req.body;

        if (!conductorId || !vehiculoId || !fechaAccidente || !descripcion || !gravedad) {
            return res.status(400).json({
                mensaje: "ID del conductor, ID del vehículo, fecha del accidente, descripción y gravedad son obligatorios"
            });
        }

        // Validar gravedad valida
        const gravedadesValidas = ["leve", "moderada", "grave"];
        if (!gravedadesValidas.includes(gravedad.toLowerCase())) {
            return res.status(400).json({
                mensaje: `Gravedad invalida. Debe ser: ${gravedadesValidas.join(", ")}`
            });
        }

        // Verificar que el conductor existe
        const conductor = await Conductor.findByPk(conductorId);
        if (!conductor) {
            return res.status(404).json({
                mensaje: "Conductor no encontrado"
            });
        }

        const nuevoAccidente = await Accidente.create({
            conductorId,
            vehiculoId,
            fechaAccidente,
            descripcion,
            gravedad: gravedad.toLowerCase()
        });

        res.status(201).json(nuevoAccidente);

    } catch (error) {
        console.error("Error al registrar accidente:", error);
        res.status(500).json({ error: error.message });
    }
};

// obtener todos los accidentes
export const obtenerAccidentes = async (_req, res) => {
    try {
        const accidentes = await Accidente.findAll();
        res.status(200).json(accidentes);
    } catch (error) {
        console.error("Error al obtener accidentes:", error);
        res.status(500).json({ mensaje: "Error al obtener accidentes" });
    }
};

// obtener un accidente por id
export const obtenerAccidente = async (req, res) => {
    try {
        const accidente = await Accidente.findByPk(req.params.id);

        if (!accidente) {
            return res.status(404).json({
                mensaje: "Accidente no encontrado"
            });
        }

        res.status(200).json(accidente);

    } catch (error) {
        console.error("Error al obtener accidente:", error);
        res.status(500).json({ mensaje: "Error al obtener accidente" });
    }
};

// obtener accidentes por conductor
export const obtenerAccidentesPorConductor = async (req, res) => {
    try {
        const { conductorId } = req.params;

        // Verificar que el conductor existe
        const conductor = await Conductor.findByPk(conductorId);
        if (!conductor) {
            return res.status(404).json({
                mensaje: "Conductor no encontrado"
            });
        }

        const accidentes = await Accidente.findAll({
            where: { conductorId }
        });

        res.status(200).json(accidentes);

    } catch (error) {
        console.error("Error al obtener accidentes del conductor:", error);
        res.status(500).json({ mensaje: "Error al obtener accidentes del conductor" });
    }
};

// actualizar un accidente
export const actualizarAccidente = async (req, res) => {
    try {
        const accidente = await Accidente.findByPk(req.params.id);

        if (!accidente) {
            return res.status(404).json({
                mensaje: "Accidente no encontrado"
            });
        }

        const { descripcion, gravedad } = req.body;

        if (descripcion == null && gravedad == null) {
            return res.status(400).json({
                mensaje: "Ingresar descripción y/o gravedad"
            });
        }

        // Validar gravedad si se proporciona
        if (gravedad) {
            const gravedadesValidas = ["leve", "moderada", "grave"];
            if (!gravedadesValidas.includes(gravedad.toLowerCase())) {
                return res.status(400).json({
                    mensaje: `Gravedad inválida. Debe ser: ${gravedadesValidas.join(", ")}`
                });
            }
            accidente.gravedad = gravedad.toLowerCase();
        }

        if (descripcion != null) accidente.descripcion = descripcion;

        await accidente.save();

        res.status(200).json(accidente);

    } catch (error) {
        console.error("Error al actualizar accidente:", error);
        res.status(500).json({ mensaje: "Error al actualizar accidente", error: error.message });
    }
};

// eliminar un accidente
export const eliminarAccidente = async (req, res) => {
    try {
        const accidente = await Accidente.findByPk(req.params.id);

        if (!accidente) {
            return res.status(404).json({
                mensaje: "Accidente no encontrado"
            });
        }

        await accidente.destroy();

        res.status(204).send();

    } catch (error) {
        console.error("Error al eliminar accidente:", error);
        res.status(500).json({ mensaje: "Error al eliminar accidente", error: error.message });
    }
};
