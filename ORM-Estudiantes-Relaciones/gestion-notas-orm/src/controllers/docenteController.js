import { Docente } from "../models/docenteModel.js";

// Controlador para crear un nuevo docente
export const crearDocente = async (req, res) => {
    try {
        const { nombreDocente, departamento } = req.body;
        if (!nombreDocente || !departamento) {
            return res.status(400).json({ mensaje: "Nombre y departamento son obligatorios" });
        }
        const nuevo = await Docente.create({ nombreDocente, departamento });
        res.status(201).json(nuevo);
    } catch (error) {
        console.error("Error al crear docente:", error);
        res.status(500).json({ error: error.message });
    }
};

export const obtenerDocentes = async (_req, res) => {
    try {
        const docentes = await Docente.findAll();
        res.status(200).json(docentes);
    } catch (error) {
        console.error("Error al obtener docentes:", error);
        res.status(500).json({ mensaje: "Error al obtener docentes" });
    }
};

export const obtenerDocentePorId = async (req, res) => {
    try {
        const docente = await Docente.findByPk(req.params.id);
        if (!docente) return res.status(404).json({ mensaje: "Docente no encontrado" });
        res.status(200).json(docente);
    } catch (error) {
        console.error("Error al obtener docente:", error);
        res.status(500).json({ mensaje: "Error al obtener docente" });
    }
};

export const actualizarDocente = async (req, res) => {
    try {
        const docente = await Docente.findByPk(req.params.id);
        if (!docente) return res.status(404).json({ mensaje: "Docente no encontrado" });
        const { nombreDocente, departamento } = req.body;
        if (nombreDocente == null && departamento == null) {
            return res.status(400).json({ mensaje: "Ingresar nombre y/o departamento" });
        }
        if (nombreDocente != null) docente.nombreDocente = nombreDocente;
        if (departamento != null) docente.departamento = departamento;
        await docente.save();
        res.status(200).json(docente);
    } catch (error) {
        console.error("Error al actualizar docente:", error);
        res.status(500).json({ mensaje: "Error al actualizar docente", error: error.message });
    }
};

export const eliminarDocente = async (req, res) => {
    try {
        const docente = await Docente.findByPk(req.params.id);
        if (!docente) return res.status(404).json({ mensaje: "Docente no encontrado" });
        await docente.destroy();
        res.status(204).send();
    } catch (error) {
        console.error("Error al eliminar docente:", error);
        res.status(500).json({ mensaje: "Error al eliminar docente", error: error.message });
    }
};
