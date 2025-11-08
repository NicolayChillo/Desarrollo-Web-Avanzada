import { Router } from "express";
import {
    crearNota,
    obtenerNota,
    obtenerNotaPorId,
    actualizarNota,
    eliminarNota
} from "../controllers/notaController.js";

const router = Router();

router.post("/", crearNota);
router.get("/", obtenerNota);
router.get("/:id", obtenerNotaPorId);
router.put("/:id", actualizarNota);
router.delete("/:id", eliminarNota);

export default router;
