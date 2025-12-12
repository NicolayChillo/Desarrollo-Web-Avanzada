export { Vehiculo } from "./Models/vehiculo.js";

// Crear un nuevo vehiculo
export const crearVehiculo = async (req, res) => {
    try {
        const { placa, tipo, usoComercial, anioFabricacion, valorVehiculo } = req.body;
        if (!placa || !tipo || anioFabricacion === undefined || valorVehiculo === undefined) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }
        res.status(201).json(nuevoVehiculo);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el vehiculo" });
    }   
};

// Obtener todos los vehiculos
export const obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.findAll();
        res.json(vehiculos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los vehiculos" });
    }
};

// Obtener un vehiculo por ID
export const obtenerVehiculoPorId = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findByPk(req.params.id);
        if (!vehiculo) {
            return res.status(404).json({ error: "Vehiculo no encontrado" });
        }
        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el vehiculo" });
    }
};

// Actualizar un vehiculo por ID
export const actualizarVehiculo = async (req, res) => {
    try {   
        const vehiculo = await Vehiculo.findByPk(req.params.id);
        if (!vehiculo) {
            return res.status(404).json({ error: "Vehiculo no encontrado" });
        }
        const { placa, tipo, usoComercial, anioFabricacion, valorVehiculo } = req.body;
        await vehiculo.update({ placa, tipo, usoComercial, anioFabricacion, valorVehiculo });
        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el vehiculo" });
    }
};
// Eliminar un vehiculo por ID
export const eliminarVehiculo = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findByPk(req.params.id);
        if (!vehiculo) {
            return res.status(404).json({ error: "Vehiculo no encontrado" });
        }
        await vehiculo.destroy();
        res.json({ message: "Vehiculo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el vehiculo" });
    }
};

//
