import { Usuario } from "./Usuario.js";
import { Cotizacion } from "./Cotizacion.js";
import { Conductor } from "./Conductor.js";
import { Vehiculo } from "./Vehiculo.js";
import { Accidente } from "./Accidente.js";
import { Pago } from "./Pago.js";

export const iniciarRelaciones = () => {
    // Usuario - Cotizacion (1:N)
    Usuario.hasMany(Cotizacion, { foreignKey: "usuarioId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "cotizaciones" });
    Cotizacion.belongsTo(Usuario, { foreignKey: "usuarioId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "usuario" });

    // Conductor - Cotizacion (1:N)
    Conductor.hasMany(Cotizacion, { foreignKey: "conductorId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "cotizaciones" });
    Cotizacion.belongsTo(Conductor, { foreignKey: "conductorId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "conductor" });

    // Vehiculo - Cotizacion (1:N)
    Vehiculo.hasMany(Cotizacion, { foreignKey: "vehiculoId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "cotizaciones" });
    Cotizacion.belongsTo(Vehiculo, { foreignKey: "vehiculoId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "vehiculo" });

    // Cotizacion - Pago (1:1)
    Cotizacion.hasOne(Pago, { foreignKey: "cotizacionId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "pago" });
    Pago.belongsTo(Cotizacion, { foreignKey: "cotizacionId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "cotizacion" });

    // Conductor - Accidente (1:N)
    Conductor.hasMany(Accidente, { foreignKey: "conductorId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "accidentes" });
    Accidente.belongsTo(Conductor, { foreignKey: "conductorId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "conductor" });

    // Vehiculo - Accidente (1:N)
    Vehiculo.hasMany(Accidente, { foreignKey: "vehiculoId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "accidentes" });
    Accidente.belongsTo(Vehiculo, { foreignKey: "vehiculoId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "vehiculo" });

    console.log("✓ Relaciones inicializadas correctamente");
};

export default iniciarRelaciones;
