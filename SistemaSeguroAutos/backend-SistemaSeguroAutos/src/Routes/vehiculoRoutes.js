//
import { Router } from 'express';
import {
  crearVehiculo,
    obtenerVehiculos,
    obtenerVehiculoPorId,
    actualizarVehiculo,
    eliminarVehiculo
} from '../Controllers/vehiculoController.js';

const router = Router();

// Ruta para crear un nuevo vehiculo
router.post('/', crearVehiculo);
router.get('/', obtenerVehiculos);
router.get('/:id', obtenerVehiculoPorId);
router.put('/:id', actualizarVehiculo);
router.delete('/:id', eliminarVehiculo);

export default router;