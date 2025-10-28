// Archivo para definir las relaciones entre modelos
import { Empleado } from './empleado.js';
import { RegistroHoras } from './registroHoras.js';

// Definir relaciones
// Un Empleado tiene muchos RegistroHoras
Empleado.hasMany(RegistroHoras, {
  foreignKey: 'empleadoId',
  as: 'registrosHoras'
});

// Un RegistroHoras pertenece a un Empleado
RegistroHoras.belongsTo(Empleado, {
  foreignKey: 'empleadoId',
  as: 'empleado'
});

// Exportar modelos con relaciones
export { Empleado, RegistroHoras };
