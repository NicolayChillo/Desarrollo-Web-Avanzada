import { Conductor } from "../Models/Conductor.js";

// Función para calcular edad
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

// crear conductor
export const crearConductor = async (req, res) => {
    try {
        const { nombreConductor, numeroLicenia, fechaNacimiento } = req.body;

        if (!nombreConductor || !numeroLicenia || !fechaNacimiento) {
            return res.status(400).json({
                mensaje: "Nombre del conductor, número de licencia y fecha de nacimiento son obligatorios"
            });
        }

        // Validar que la fecha de nacimiento sea razonable
        const fechaNac = new Date(fechaNacimiento);
        const hoy = new Date();
        
        if (fechaNac > hoy) {
            return res.status(400).json({
                mensaje: "La fecha de nacimiento no puede estar en el futuro."
            });
        }
        
        const edad = calcularEdad(fechaNacimiento);
        if (edad > 75 || edad < 0) {
            return res.status(400).json({
                mensaje: `Fecha de nacimiento inválida. Edad calculada: ${edad} años.`
            });
        }

        // Validar licencia unica
        const conductorExistente = await Conductor.findOne({
            where: { numeroLicenia }
        });

        if (conductorExistente) {
            return res.status(400).json({
                mensaje: "El número de licencia ya está registrado"
            });
        }

        const nuevoConductor = await Conductor.create({
            nombreConductor,
            numeroLicenia,
            fechaNacimiento
        });

        res.status(201).json(nuevoConductor);

    } catch (error) {
        console.error("Error al crear conductor:", error);
        res.status(500).json({ error: error.message });
    }
};

// obtener todos los conductores
export const obtenerConductores = async (_req, res) => {
    try {
        const conductores = await Conductor.findAll();
        res.status(200).json(conductores);
    } catch (error) {
        console.error("Error al obtener conductores:", error);
        res.status(500).json({ mensaje: "Error al obtener conductores" });
    }
};

// obtener un conductor por id
export const obtenerConductor = async (req, res) => {
    try {
        const conductor = await Conductor.findByPk(req.params.id);

        if (!conductor) {
            return res.status(404).json({
                mensaje: "Conductor no encontrado"
            });
        }

        res.status(200).json(conductor);

    } catch (error) {
        console.error("Error al obtener conductor:", error);
        res.status(500).json({ mensaje: "Error al obtener conductor" });
    }
};

// actualizar un conductor
export const actualizarConductor = async (req, res) => {
    try {
        const conductor = await Conductor.findByPk(req.params.id);

        if (!conductor) {
            return res.status(404).json({
                mensaje: "Conductor no encontrado"
            });
        }

        const { nombreConductor, numeroLicenia, fechaNacimiento } = req.body;

        if (nombreConductor == null && numeroLicenia == null && fechaNacimiento == null) {
            return res.status(400).json({
                mensaje: "Ingresar nombre del conductor, número de licencia y/o fecha de nacimiento"
            });
        }

        // Validar edad si se actualiza fecha de nacimiento
        if (fechaNacimiento != null) {
            const fechaNac = new Date(fechaNacimiento);
            const hoy = new Date();
            
            if (fechaNac > hoy) {
                return res.status(400).json({
                    mensaje: "La fecha de nacimiento no puede estar en el futuro."
                });
            }
            
            const edad = calcularEdad(fechaNacimiento);
            if (edad > 120 || edad < 0) {
                return res.status(400).json({
                    mensaje: `Fecha de nacimiento inválida. Edad calculada: ${edad} años.`
                });
            }
        }

        // Validar si la licencia esta siendo usada por otro conductor
        if (numeroLicenia && numeroLicenia !== conductor.numeroLicenia) {
            const licenciaExistente = await Conductor.findOne({
                where: { numeroLicenia }
            });
            if (licenciaExistente) {
                return res.status(400).json({
                    mensaje: "El número de licencia ya está registrado"
                });
            }
        }

        if (nombreConductor != null) conductor.nombreConductor = nombreConductor;
        if (numeroLicenia != null) conductor.numeroLicenia = numeroLicenia;
        if (fechaNacimiento != null) conductor.fechaNacimiento = fechaNacimiento;

        await conductor.save();

        res.status(200).json(conductor);

    } catch (error) {
        console.error("Error al actualizar conductor:", error);
        res.status(500).json({ mensaje: "Error al actualizar conductor", error: error.message });
    }
};

// eliminar un conductor
export const eliminarConductor = async (req, res) => {
    try {
        const conductor = await Conductor.findByPk(req.params.id);

        if (!conductor) {
            return res.status(404).json({
                mensaje: "Conductor no encontrado"
            });
        }

        await conductor.destroy();

        res.status(204).send();

    } catch (error) {
        console.error("Error al eliminar conductor:", error);
        res.status(500).json({ mensaje: "Error al eliminar conductor", error: error.message });
    }
};
