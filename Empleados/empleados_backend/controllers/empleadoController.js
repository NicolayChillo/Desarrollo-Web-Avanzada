import { Empleado, RegistroHoras } from '../models/index.js';
import { sequelize } from '../config/database.js';
import { Op } from 'sequelize';



// Crear un nuevo empleado
export const crearEmpleado = async (req, res) => {
  try {
    const { nombre, pago_hora } = req.body;
    
    // Validaciones
    if (!nombre || pago_hora == null) {
      return res.status(400).json({ message: "Faltan datos (nombre y pago_hora son obligatorios)" });
    }
    
    if (nombre.trim().length < 3) {
      return res.status(400).json({ message: "El nombre debe tener al menos 3 caracteres" });
    }
    
    if (pago_hora <= 0) {
      return res.status(400).json({ message: "El pago por hora debe ser mayor a 0" });
    }
    
    // Crear empleado (horas se calculan dinámicamente desde RegistroHoras)
    const nuevoEmpleado = await Empleado.create({ 
      nombre: nombre.trim(), 
      pago_hora
    });
    
    res.status(201).json(nuevoEmpleado);
    
  } catch (error) {
    console.error("Error al crear empleado:", error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};


export const obtenerResumenSemanal = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });

    // Determinar rango de la semana
    const qInicio = req.query.inicio; // formato YYYY-MM-DD
    let startDate;
    if (qInicio) {
      startDate = new Date(qInicio + 'T00:00:00');
      if (isNaN(startDate)) return res.status(400).json({ message: 'Fecha inicio inválida. Use YYYY-MM-DD' });
    } else {
      // calcular inicio de la semana (Lunes)
      const today = new Date();
      const day = today.getDay(); // 0 (Dom) - 6 (Sáb)
      const diffToMonday = (day + 6) % 7; // días desde Lunes
      startDate = new Date(today);
      startDate.setDate(today.getDate() - diffToMonday);
    }

    // fecha fin = inicio + 6 días
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    // formatear a YYYY-MM-DD (DATEONLY)
    const fmt = (d) => d.toISOString().slice(0,10);
    const startStr = fmt(startDate);
    const endStr = fmt(endDate);

    // Buscar registros en el rango
    const registros = await RegistroHoras.findAll({
      where: {
        empleadoId: id,
        fecha: { [Op.between]: [startStr, endStr] }
      },
      order: [['fecha', 'ASC']]
    });

    // Construir arreglo de días de la semana con horas (llenar con 0 si no hay registro)
    const diasSemana = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const fecha = fmt(d);
      const reg = registros.find(r => r.fecha === fecha);
      diasSemana.push({
        fecha,
        dia: obtenerNombreDia(fecha),
        horas: reg ? parseFloat(reg.horas) : 0,
        registroId: reg ? reg.id : null
      });
    }

    const totalHoras = diasSemana.reduce((sum, x) => sum + x.horas, 0);
    const salarioSemana = Math.round(totalHoras * empleado.pago_hora * 100) / 100;

    res.json({
      empleado: { id: empleado.id, nombre: empleado.nombre, pago_hora: empleado.pago_hora },
      semana: { inicio: startStr, fin: endStr },
      dias: diasSemana,
      totalHoras,
      salarioSemana
    });

  } catch (error) {
    console.error('Error al obtener resumen semanal:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Listar todos los empleados
export const listarEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      attributes: [
        'id',
        'nombre',
        'pago_hora',
        'createdAt',
        'updatedAt',
        // Calcular horas totales dinámicamente
        [
          sequelize.literal(`(
            SELECT COALESCE(SUM(horas), 0)
            FROM RegistroHoras
            WHERE RegistroHoras.empleadoId = Empleado.id
          )`),
          'horas_trabajadas'
        ]
      ],
      include: [{
        model: RegistroHoras,
        as: 'registrosHoras',
        attributes: ['id', 'fecha', 'dia', 'horas']
      }]
    });
    
    res.json(empleados);
    
  } catch (error) {
    console.error("Error al listar empleados:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener un empleado por ID
export const obtenerEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id, {
      include: [{
        model: RegistroHoras,
        as: 'registrosHoras'
      }]
    });
    
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    
    res.json(empleado);
    
  } catch (error) {
    console.error("Error al buscar empleado:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar empleado
export const actualizarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    
    const { nombre, pago_hora } = req.body;
    
    // Actualizar solo campos proporcionados
    const datosActualizar = {};
    if (nombre !== undefined) datosActualizar.nombre = nombre.trim();
    if (pago_hora !== undefined) {
      if (pago_hora <= 0) {
        return res.status(400).json({ message: "El pago por hora debe ser mayor a 0" });
      }
      datosActualizar.pago_hora = pago_hora;
    }
    
    await empleado.update(datosActualizar);
    res.json(empleado);
    
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar empleado", error: error.message });
  }
};

// Eliminar empleado
export const eliminarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    
    // Eliminar también sus registros de horas
    await RegistroHoras.destroy({ where: { empleadoId: empleado.id } });
    await empleado.destroy();
    
    res.json({ message: "Empleado eliminado exitosamente" });
    
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar empleado", error: error.message });
  }
};

// ============================================
// GESTIÓN DE HORAS DIARIAS
// ============================================

// Registrar horas de un día específico para un empleado
export const registrarHorasDia = async (req, res) => {
  try {
    const { id } = req.params; // ID del empleado
    const { fecha, dia, horas } = req.body;
    
    // Validar que el empleado existe
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    
    // Validaciones
    if (!fecha || horas == null) {
      return res.status(400).json({ message: "Faltan datos (fecha y horas son obligatorios)" });
    }
    
    if (horas < 0 || horas > 24) {
      return res.status(400).json({ message: "Las horas deben estar entre 0 y 24" });
    }
    
    // Verificar si ya existe un registro para esa fecha
    const registroExistente = await RegistroHoras.findOne({
      where: { empleadoId: id, fecha }
    });
    
    if (registroExistente) {
      // Actualizar registro existente
      await registroExistente.update({ horas, dia });
      return res.json({ 
        message: "Registro actualizado", 
        registro: registroExistente 
      });
    }
    
    // Crear nuevo registro
    const nuevoRegistro = await RegistroHoras.create({
      empleadoId: id,
      fecha,
      dia: dia || obtenerNombreDia(fecha),
      horas
    });
    
    res.status(201).json(nuevoRegistro);
    
  } catch (error) {
    console.error("Error al registrar horas:", error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

// Obtener todos los registros de horas de un empleado
export const obtenerRegistrosEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    
    const registros = await RegistroHoras.findAll({
      where: { empleadoId: id },
      order: [['fecha', 'ASC']]
    });
    
    res.json({
      empleado: {
        id: empleado.id,
        nombre: empleado.nombre,
        pago_hora: empleado.pago_hora
      },
      registros
    });
    
  } catch (error) {
    console.error("Error al obtener registros:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// ============================================
// CÁLCULOS DE SALARIOS
// ============================================

// Calcular salario semanal de un empleado
export const calcularSalarioEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }
    
    const salario = await empleado.calcularSalarioSemanal();
    
    res.json({
      id: empleado.id,
      ...salario
    });
    
  } catch (error) {
    console.error("Error al calcular salario:", error);
    res.status(500).json({ message: "Error al calcular salario", error: error.message });
  }
};

// Calcular estadísticas generales de la empresa
export const obtenerEstadisticasEmpresa = async (req, res) => {
  try {
    const empleados = await Empleado.findAll();
    
    if (empleados.length === 0) {
      return res.json({
        totalEmpleados: 0,
        totalHorasSemana: 0,
        totalPagoSemanal: 0,
        promedioHorasPorEmpleado: 0,
        empleados: []
      });
    }
    
    // Calcular salario de cada empleado
    const datosEmpleados = await Promise.all(
      empleados.map(async (emp) => {
        const salario = await emp.calcularSalarioSemanal();
        return {
          id: emp.id,
          nombre: emp.nombre,
          totalHoras: salario.totalHoras,
          diasLaborados: salario.diasLaborados,
          salarioSemanal: salario.salarioSemanal
        };
      })
    );
    
    // Calcular totales de la empresa
    const totalHorasSemana = datosEmpleados.reduce((sum, e) => sum + e.totalHoras, 0);
    const totalPagoSemanal = datosEmpleados.reduce((sum, e) => sum + e.salarioSemanal, 0);
    const promedioHoras = totalHorasSemana / empleados.length;
    
    res.json({
      totalEmpleados: empleados.length,              // N (número de trabajadores)
      totalHorasSemana: totalHorasSemana,           // SH (suma de horas semanales)
      totalPagoSemanal: totalPagoSemanal,           // Total que pagó la empresa
      promedioHorasPorEmpleado: Math.round(promedioHoras * 100) / 100,
      empleados: datosEmpleados
    });
    
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};



// Función auxiliar para obtener nombre del día
function obtenerNombreDia(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const date = new Date(fecha + 'T00:00:00');
  return dias[date.getDay()];
}
