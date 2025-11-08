import { Asignatura } from "../models/asignaturaModel.js";
import { Docente } from "../models/docenteModel.js";

// Controlador para crear una nueva asignatura
export const crearAsignatura = async (req, res) => {
    try {
        const { nombreAsignatura, creditos, idDocente } = req.body;
        if (!nombreAsignatura || creditos == null) {
            return res.status(400).json({ mensaje: "Nombre y creditos son obligatorios" });
        }
        // si se provee idDocente, opcionalmente podríamos validar su existencia
        if (idDocente != null) {
            const docente = await Docente.findByPk(idDocente);
            if (!docente) return res.status(404).json({ mensaje: "Docente no encontrado" });
        }
        const nueva = await Asignatura.create({ nombreAsignatura, creditos, idDocente });
        res.status(201).json(nueva);
    } catch (error) {
        console.error("Error al crear asignatura:", error);
        res.status(500).json({ error: error.message });
    }
};

export const obtenerAsignaturas = async (_req, res) => {
    try {
        const asignaturas = await Asignatura.findAll({ include: { model: Docente } });
        res.status(200).json(asignaturas);
    } catch (error) {
        console.error("Error al obtener asignaturas:", error);
        res.status(500).json({ mensaje: "Error al obtener asignaturas" });
    }
};

export const obtenerAsignaturaPorId = async (req, res) => {
    try {
        const asignatura = await Asignatura.findByPk(req.params.id, { include: { model: Docente } });
        if (!asignatura) return res.status(404).json({ mensaje: "Asignatura no encontrada" });
        res.status(200).json(asignatura);
    } catch (error) {
        console.error("Error al obtener asignatura:", error);
        res.status(500).json({ mensaje: "Error al obtener asignatura" });
    }
};

export const actualizarAsignatura = async (req, res) => {
    try {
        const asignatura = await Asignatura.findByPk(req.params.id);
        if (!asignatura) return res.status(404).json({ mensaje: "Asignatura no encontrada" });
        const { nombreAsignatura, creditos, idDocente } = req.body;
        if (nombreAsignatura == null && creditos == null && idDocente == null) {
            return res.status(400).json({ mensaje: "Enviar al menos un campo a actualizar" });
        }
        if (idDocente != null) {
            const docente = await Docente.findByPk(idDocente);
            if (!docente) return res.status(404).json({ mensaje: "Docente no encontrado" });
            asignatura.idDocente = idDocente;
        }
        if (nombreAsignatura != null) asignatura.nombreAsignatura = nombreAsignatura;
        if (creditos != null) asignatura.creditos = creditos;
        await asignatura.save();
        res.status(200).json(asignatura);
    } catch (error) {
        console.error("Error al actualizar asignatura:", error);
        res.status(500).json({ mensaje: "Error al actualizar asignatura", error: error.message });
    }
};

export const eliminarAsignatura = async (req, res) => {
    try {
        const asignatura = await Asignatura.findByPk(req.params.id);
        if (!asignatura) return res.status(404).json({ mensaje: "Asignatura no encontrada" });
        await asignatura.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Error al eliminar asignatura:", error);
        res.status(500).json({ mensaje: "Error al eliminar asignatura", error: error.message });
    }
};
