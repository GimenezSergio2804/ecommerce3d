import { Router } from "express";
import {
  crearFilamento,
  listarFilamentos,
  obtenerFilamentoPorId,
  actualizarFilamento,
  desactivarFilamento,
  stockPorColor,
} from "../controllers/filamentoController.js";

const router = Router();

// Crear filamento
router.post("/", crearFilamento);

// Listar filamentos activos con paginación y filtros
router.get("/", listarFilamentos);

// Obtener filamento por ID
router.get("/:id", obtenerFilamentoPorId);

// Actualizar filamento
 router.put("/:id", actualizarFilamento);

// Desactivar filamento
router.patch("/:id/desactivar", desactivarFilamento);

// Consultar stock total por color y marca
router.get("/stock/stockporColor", stockPorColor);

export default router;
