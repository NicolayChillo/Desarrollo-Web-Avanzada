import { Estudiante } from "../models/estudianteModel.js";
import { Nota } from "../models/notaModel.js";
import { Asignatura } from "../models/asignaturaModel.js";

// Procesos-funciones para las notas
function enRango(nota) {
    //comprobar si una nota  entre 0 y 20
    return typeof nota === 'number' && nota >= 0 && nota <= 20;
}

// Calcular el promedio
function calcularPromedio(nota1, nota2, nota3){
    const suma = nota1 + nota2 + nota3;
    const promedio = suma / 3;
    return Number(promedio.toFixed(2)); // Redondear a 2 decimales
}

// Determinar la categoria segun el promedio
function determinarCategoria(promedio){
    if (promedio < 14) return "Reprobado";
    if (promedio < 18) return "Aprobado";
    if (promedio >= 18) return "Sobresaliente";
}

// Controlador para crear una nueva nota
export const crearNota = async (req, res) => {
    try {
        const { idEstudiante, idAsignatura, nota1, nota2, nota3 } = req.body;

        // Validaciones
        if (idEstudiante == null || idAsignatura == null || nota1 == null || nota2 == null || nota3 == null) {
            return res.status(400).json({ mensaje: "idEstudiante, idAsignatura y las tres notas son obligatorios" });
        }

        // Comprobar existencia de estudiante y asignatura
        const estudiante = await Estudiante.findByPk(idEstudiante);
        if (!estudiante) return res.status(404).json({ mensaje: "Estudiante no encontrado" });
        const asignaturaObj = await Asignatura.findByPk(idAsignatura);
        if (!asignaturaObj) return res.status(404).json({ mensaje: "Asignatura no encontrada" });

        if (![nota1, nota2, nota3].every(enRango)) {
            return res.status(400).json({ mensaje: "Las notas deben estar en el rango de 0 a 20" });
        }

        // Calcular promedio y categoria
        const promedio = calcularPromedio(nota1, nota2, nota3);
        const categoria = determinarCategoria(promedio);

        const nuevaNota = await Nota.create({ 
            idEstudiante, 
            idAsignatura,
            nota1, 
            nota2, 
            nota3, 
            promedio, 
            categoria
        });        
        res.status(201).json(nuevaNota);
    }
    catch (error) {
        console.error("Error al crear nota:", error);
        res.status(500).json({ mensaje: "Error al crear nota" });
    }
};

// Controlador para obtener todas las notas
export const obtenerNota = async (_req, res) => { //_req indica que no se usa el parametro req
    try {
        const notas = await Nota.findAll({ include: [{ model: Estudiante }, { model: Asignatura }] }); // incluir datos del estudiante y la asignatura asociada
        res.status(200).json(notas);
    } catch (error) {
        console.error("Error al obtener notas:", error);
        res.status(500).json({ mensaje: "Error al obtener notas" });
    }
};

// Controlador para obtener una nota por ID
export const obtenerNotaPorId = async (req, res) => {
    try {
    const nota = await Nota.findByPk(req.params.id, { include: [{ model: Estudiante }, { model: Asignatura }] }); // incluir datos del estudiante y la asignatura asociada
        if (!nota) {
            return res.status(404).json({ mensaje: "Nota no encontrada" });
        }
        res.status(200).json(nota);
    } catch (error) {
        console.error("Error al obtener nota:", error);
        res.status(500).json({ mensaje: "Error al obtener nota" });
    }
};

// Controlador para actualizar una nota por ID
export const actualizarNota = async (req, res) => {
    try {
        const nota = await Nota.findByPk(req.params.id);
        if (!nota) return res.status(404).json({ mensaje: "No existe" });

        // Permitir actualizar cualquier campo; si vienen las 3 notas, recalculamos.
        const { nota1, nota2, nota3, idAsignatura } = req.body;
        const payload = { ...req.body }; // spread operator para copiar los campos

        // Si se actualiza idAsignatura, verificar que exista
        if (idAsignatura != null) {
                const asign = await Asignatura.findByPk(idAsignatura);
                if (!asign) return res.status(404).json({ mensaje: "Asignatura no encontrada" });
        }

        if (nota1 !== undefined && nota2 !== undefined && nota3 !== undefined) {
            if (![nota1, nota2, nota3].every(enRango)) {
                return res.status(400).json({ mensaje: "Las notas deben estar entre 0 y 20." });
            }
            const promedio = calcularPromedio(nota1, nota2,nota3);
            const categoria = determinarCategoria(promedio);
            payload.promedio = promedio;
            payload.categoria = categoria;
        }

        await nota.update(payload);
        res.status(200).json(nota);
    } catch (e) {
        console.error("Error al actualizar nota:", e);
        res.status(500).json({ error: e.message });
    }
};

// Controlador para eliminar un nota por ID
export const eliminarNota = async (req, res) => {
    try {
        const nota = await Nota.findByPk(req.params.id);
        if(!nota){
            return res.status(404).json({message: "Nota no encontrado"});
        }
        await nota.destroy();
        console.log("Nota eliminado");
        res.status(204).send();
    } catch (error) {
        res.status(500).json({message: "Error al eliminar nota", error: error.message});
    }
};