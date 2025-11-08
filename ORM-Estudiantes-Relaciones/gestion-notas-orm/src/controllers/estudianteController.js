import { Estudiante } from "../models/estudianteModel.js";

// Controlador para crear un nuevo estudiante
export const crearEstudiante = async (req, res) => {
    try {
        const { nombreEstudiante, carrera } = req.body;
        if(!nombreEstudiante || !carrera){
            return res.status(400).json({ mensaje: "Nombre y carrera son obligatorios" }); // 400 nos da la confirmacion de que hay un error del cliente
        }
        const nuevoEstudiante = await Estudiante.create({ nombreEstudiante, carrera });
        res.status(201).json(nuevoEstudiante); // 201 nos da la confirmacion de que se creo correctamente
    } 
    catch (error) {
        console.error("Error al crear estudiante:", error);
        res.status(500).json({ error: error.message }); // 500 nos da la confirmacion de que hay un error en el servidor
    }
};

// Controlador para obtener todos los estudiantes
export const obtenerEstudiantes = async (_req, res) => {
    try {
        const estudiantes = await Estudiante.findAll();
        res.status(200).json(estudiantes);
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        res.status(500).json({ mensaje: "Error al obtener estudiantes" });
    }
};

// Controlador para obtener un estudiante por ID
export const obtenerEstudiantePorId = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByPk(req.params.id);
        if (!estudiante) {
            return res.status(404).json({ mensaje: "Estudiante no encontrado" });
        }
        res.status(200).json(estudiante);
    } catch (error) {
        console.error("Error al obtener estudiante:", error);
        res.status(500).json({ mensaje: "Error al obtener estudiante" });
    }
};

// Controlador para actualizar un estudiante por ID
export const actualizarEstudiante = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByPk(req.params.id);
        if(!estudiante){
            return res.status(404).json({message: "Estudiante no encontrado"});
        }
        const { nombreEstudiante, carrera } = req.body;

        await estudiante.update({nombreEstudiante, carrera});
        res.json(estudiante);
        if(!nombreEstudiante || !carrera){
            return  res.status(400).json({message: "Ingrese todos los datos obligatorios"});
        }
        // Devolver la entidad actualizada
        res.status(200).json(estudiante);
    } catch (error) {
        console.error("Error al actualizar estudiante:", error);
        res.status(500).json({ message: "Error al actualizar estudiante", error: error.message });
    }
};

// Controlador para eliminar un estudiante por ID
export const eliminarEstudiante = async (req, res) => {
    try {
        const estudiante = await Estudiante.findByPk(req.params.id);
        if(!estudiante){
            return res.status(404).json({message: "Estudiante no encontrado"});
        }
        await estudiante.destroy();
        //quiero que muestre que se elimino estudiantes en postman como 
        res.status(201).json({message:"Estudiante eliminado"});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({message: "Error al eliminar estudiante", error: error.message});
    }
};