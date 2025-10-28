import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

// Crear clase base del modelo Empleado
export class Empleado extends Model {
  
  // Método para calcular salario semanal basado en registros diarios
  async calcularSalarioSemanal() {
    // Importar RegistroHoras aquí para evitar dependencia circular
    const { RegistroHoras } = await import('./registroHoras.js');
    
    // Obtener todos los registros de horas de este empleado
    const registros = await RegistroHoras.findAll({
      where: { empleadoId: this.id }
    });
    
    // Sumar todas las horas trabajadas (HT = suma de horas)
    const totalHoras = registros.reduce((sum, reg) => sum + parseFloat(reg.horas), 0);
    
    // Calcular días laborados (DT)
    const diasLaborados = registros.length;
    
    // Calcular salario (SS = HT * PH)
    // Puedes agregar lógica de horas extras aquí si necesitas
    const salarioSemanal = totalHoras * this.pago_hora;
    
    return {
      empleado: this.nombre,
      totalHoras: totalHoras,        // HT (suma de horas semanales)
      diasLaborados: diasLaborados,  // DT (días trabajados)
      pagoPorHora: this.pago_hora,   // PH
      salarioSemanal: salarioSemanal, // SS
      registros: registros.map(r => ({
        fecha: r.fecha,
        dia: r.dia,
        horas: r.horas
      }))
    };
  }
}

// Definir la estructura de la tabla
Empleado.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        pago_hora: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
        // ⚠️ NO tiene horas_trabajadas - se calcula dinámicamente desde RegistroHoras
    },
    {
        sequelize,
        modelName: "Empleado",
        timestamps: true
    }
);