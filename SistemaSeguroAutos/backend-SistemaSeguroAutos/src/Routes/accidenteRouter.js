import express from "express";
import {
    crearAccidente,
    obtenerAccidentes,
    obtenerAccidente,
    obtenerAccidentesPorConductor,
    actualizarAccidente,
    eliminarAccidente
} from "../Controllers/accidenteController.js";

const router = express.Router();

router.post("/", crearAccidente);
router.get("/", obtenerAccidentes);
router.get("/:id", obtenerAccidente);
router.get("/conductor/:conductorId", obtenerAccidentesPorConductor);
router.put("/:id", actualizarAccidente);
router.delete("/:id", eliminarAccidente);

export default router;
