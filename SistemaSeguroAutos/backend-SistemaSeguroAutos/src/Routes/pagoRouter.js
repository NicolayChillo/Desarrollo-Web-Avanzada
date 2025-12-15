import express from "express";
import {
    procesarPagoController,
    obtenerPagosPorCotizacion,
    obtenerPago,
    obtenerPagos,
    actualizarEstadoPago,
    eliminarPago,
    verificarPagoAprobadoController,
    calcularMontoFinalPreview
} from "../Controllers/pagoController.js";

const router = express.Router();

router.post("/procesar", procesarPagoController);
router.get("/calcular/monto-final", calcularMontoFinalPreview);
router.get("/cotizacion/:cotizacionId/verificar-aprobado", verificarPagoAprobadoController);
router.get("/cotizacion/:cotizacionId", obtenerPagosPorCotizacion);
router.get("/", obtenerPagos);
router.get("/:id", obtenerPago);
router.put("/:id", actualizarEstadoPago);
router.delete("/:id", eliminarPago);

export default router;
