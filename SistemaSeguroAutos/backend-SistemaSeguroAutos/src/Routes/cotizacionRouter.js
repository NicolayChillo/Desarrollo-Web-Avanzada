import express from "express";
import {
    crearCotizacion,
    obtenerCotizacion,
    obtenerCotizaciones,
    actualizarEstadoCotizacion,
    eliminarCotizacion,
    verificarVigenciaCotizacion
} from "../Controllers/cotizacionController.js";

const router = express.Router();

router.post("/", crearCotizacion);
router.get("/", obtenerCotizaciones);
router.get("/:id", obtenerCotizacion);
router.get("/:id/vigencia", verificarVigenciaCotizacion);
router.put("/:id", actualizarEstadoCotizacion);
router.delete("/:id", eliminarCotizacion);

export default router;
