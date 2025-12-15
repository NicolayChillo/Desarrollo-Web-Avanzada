import express from "express";
import {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario
} from "../Controllers/usuarioController.js";

const router = express.Router();

// Ruta de login (debe ir antes de /:id)
router.post("/login", loginUsuario);

router.post("/", crearUsuario);
router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;
