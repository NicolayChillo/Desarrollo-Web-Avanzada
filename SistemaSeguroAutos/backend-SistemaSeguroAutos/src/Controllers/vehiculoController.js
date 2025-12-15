import { Vehiculo } from "../Models/Vehiculo.js";

// crear vehiculo
export const crearVehiculo = async (req, res) => {
    try {
        const { marca, modelo, anio, numeroPlaca, tipo, uso, valorComercial } = req.body;

        if (!marca || !modelo || !anio || !numeroPlaca || !tipo || !uso || !valorComercial) {
            return res.status(400).json({
                mensaje: "Marca, modelo, año, número de placa, tipo, uso y valor comercial son obligatorios"
            });
        }

        // Validar placa unica
        const vehiculoExistente = await Vehiculo.findOne({
            where: { numeroPlaca }
        });

        if (vehiculoExistente) {
            return res.status(400).json({
                mensaje: "El número de placa ya está registrado"
            });
        }

        // Validar tipos validos
        const tiposValidos = ["sedan", "SUV", "camioneta"];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                mensaje: `Tipo de vehículo inválido. Debe ser: ${tiposValidos.join(", ")}`
            });
        }

        const usosValidos = ["personal", "comercial"];
        if (!usosValidos.includes(uso)) {
            return res.status(400).json({
                mensaje: `Uso de vehículo inválido. Debe ser: ${usosValidos.join(", ")}`
            });
        }

        const nuevoVehiculo = await Vehiculo.create({
            marca,
            modelo,
            anio,
            numeroPlaca,
            tipo,
            uso,
            valorComercial
        });

        res.status(201).json(nuevoVehiculo);

    } catch (error) {
        console.error("Error al crear vehículo:", error);
        res.status(500).json({ error: error.message });
    }
};

// obtener todos los vehiculos
export const obtenerVehiculos = async (_req, res) => {
    try {
        const vehiculos = await Vehiculo.findAll();
        res.status(200).json(vehiculos);
    } catch (error) {
        console.error("Error al obtener vehículos:", error);
        res.status(500).json({ mensaje: "Error al obtener vehículos" });
    }
};

// obtener un vehiculo por id
export const obtenerVehiculo = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findByPk(req.params.id);

        if (!vehiculo) {
            return res.status(404).json({
                mensaje: "Vehículo no encontrado"
            });
        }

        res.status(200).json(vehiculo);

    } catch (error) {
        console.error("Error al obtener vehículo:", error);
        res.status(500).json({ mensaje: "Error al obtener vehículo" });
    }
};

// actualizar un vehiculo
export const actualizarVehiculo = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findByPk(req.params.id);

        if (!vehiculo) {
            return res.status(404).json({
                mensaje: "Vehículo no encontrado"
            });
        }

        const { marca, modelo, anio, numeroPlaca, tipo, uso, valorComercial } = req.body;

        if (marca == null && modelo == null && anio == null && numeroPlaca == null && tipo == null && uso == null && valorComercial == null) {
            return res.status(400).json({
                mensaje: "Ingresar marca, modelo, año, número de placa, tipo, uso y/o valor comercial"
            });
        }

        // Validar si la placa esta siendo usada por otro vehiculo
        if (numeroPlaca && numeroPlaca !== vehiculo.numeroPlaca) {
            const placaExistente = await Vehiculo.findOne({
                where: { numeroPlaca }
            });
            if (placaExistente) {
                return res.status(400).json({
                    mensaje: "El número de placa ya está registrado"
                });
            }
        }

        // Validar tipos si se proporciona
        if (tipo) {
            const tiposValidos = ["sedan", "SUV", "camioneta"];
            if (!tiposValidos.includes(tipo)) {
                return res.status(400).json({
                    mensaje: `Tipo de vehículo inválido. Debe ser: ${tiposValidos.join(", ")}`
                });
            }
        }

        if (uso) {
            const usosValidos = ["personal", "comercial"];
            if (!usosValidos.includes(uso)) {
                return res.status(400).json({
                    mensaje: `Uso de vehículo inválido. Debe ser: ${usosValidos.join(", ")}`
                });
            }
        }

        if (marca != null) vehiculo.marca = marca;
        if (modelo != null) vehiculo.modelo = modelo;
        if (anio != null) vehiculo.anio = anio;
        if (numeroPlaca != null) vehiculo.numeroPlaca = numeroPlaca;
        if (tipo != null) vehiculo.tipo = tipo;
        if (uso != null) vehiculo.uso = uso;
        if (valorComercial != null) vehiculo.valorComercial = valorComercial;

        await vehiculo.save();

        res.status(200).json(vehiculo);

    } catch (error) {
        console.error("Error al actualizar vehículo:", error);
        res.status(500).json({ mensaje: "Error al actualizar vehículo", error: error.message });
    }
};

// eliminar un vehículo
export const eliminarVehiculo = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findByPk(req.params.id);

        if (!vehiculo) {
            return res.status(404).json({
                mensaje: "Vehículo no encontrado"
            });
        }

        await vehiculo.destroy();

        res.status(204).send();

    } catch (error) {
        console.error("Error al eliminar vehículo:", error);
        res.status(500).json({ mensaje: "Error al eliminar vehículo", error: error.message });
    }
};
