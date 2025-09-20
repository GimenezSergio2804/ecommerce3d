// src/routes/marcaRoutes.js
import { Router } from 'express';
import {
  crearMarca,
  listarMarcas,
  obtenerMarcaPorId,
  actualizarMarca,
  eliminarMarca,
  buscarPorNombre,
  
} from '../controllers/marcaControllers.js';

const router = Router();

// Rutas de búsqueda (antes de ':id' para evitar conflicto)
router.get('/buscar', buscarPorNombre);  // GET /api/marcas/buscar?q=texto

// Rutas CRUD básicas
router.post('/', crearMarca);            // POST /api/marcas
router.get('/', listarMarcas);           // GET  /api/marcas
router.get('/:id', obtenerMarcaPorId);   // GET  /api/marcas/:id
router.put('/:id', actualizarMarca);    // PUT  /api/marcas/:id
router.delete('/:id', eliminarMarca);   // DELETE /api/marcas/:id

export default router;
