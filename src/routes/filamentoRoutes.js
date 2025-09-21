import { Router } from "express";
import {
  crearFilamento,
  listarFilamentos,
  obtenerFilamentoPorId,
  actualizarFilamento,
  desactivarFilamento,
  stockPorColor,
  stockGeneral,
  actualizarPesoRollo
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

 // Actualizar peso de un rollo
router.put("/:id/actualizar-peso", actualizarPesoRollo);

// Desactivar filamento
router.patch("/:id/desactivar", desactivarFilamento);

// Consultar stock total por color y marca
router.get("/stock/stockporColor", stockPorColor);

// consulta stock general por marca (agrupado por color)
router.get("/stock/general", stockGeneral);

export default router;
