import express from "express";
import {
    crearVehiculo,
    obtenerVehiculos,
    obtenerVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
} from "../Controllers/vehiculoController.js";

const router = express.Router();

router.post("/", crearVehiculo);
router.get("/", obtenerVehiculos);
router.get("/:id", obtenerVehiculo);
router.put("/:id", actualizarVehiculo);
router.delete("/:id", eliminarVehiculo);

export default router;
