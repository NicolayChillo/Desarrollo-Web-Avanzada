import { Router } from "express";
import {
  crearEmpleado,
  listarEmpleados,
  obtenerEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  registrarHorasDia,
  obtenerRegistrosEmpleado,
  obtenerResumenSemanal,
  calcularSalarioEmpleado,
  obtenerEstadisticasEmpresa
} from "../controllers/empleadoController.js";

const router = Router();



// Estadísticas generales de la empresa
router.get("/estadisticas", obtenerEstadisticasEmpresa);



// Crear empleado
router.post("/", crearEmpleado);

router.get("/", listarEmpleados);

router.get("/:id", obtenerEmpleado);

router.put("/:id", actualizarEmpleado);

router.delete("/:id", eliminarEmpleado);

// GESTIÓN DE HORAS DIARIAS

// Registrar horas de un día para un empleado
router.post("/:id/horas", registrarHorasDia);

// Obtener todos los registros de horas de un empleado
router.get("/:id/horas", obtenerRegistrosEmpleado);



// Calcular salario semanal de un empleado
router.get("/:id/salario", calcularSalarioEmpleado);

// Resumen semanal (horas por día + salario de la semana)
router.get("/:id/semana", obtenerResumenSemanal);

export default router;