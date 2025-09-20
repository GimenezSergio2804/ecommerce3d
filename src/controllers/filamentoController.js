import mongoose from 'mongoose';
import Filamento from "../models/Filamento.js";
import Marca from "../models/Marca.js";

// Crear un nuevo filamento
export const crearFilamento = async (req, res) => {
  try {
    const { marcaId, material, color, pesoRestante, numeroRollo, colorHex } = req.body;

    // Verificar que la marca exista
    if (!mongoose.Types.ObjectId.isValid(marcaId)) {
      return res.status(400).json({ ok: false, mensaje: "Marca inválida" });
    }

    const marca = await Marca.findById(marcaId);
    if (!marca) {
      return res.status(404).json({ ok: false, mensaje: "Marca no encontrada" });
    }

    // Validaciones básicas
    if (!material || !color || typeof pesoRestante !== "number") {
      return res.status(400).json({
        ok: false,
        mensaje: "Material, color y pesoRestante son obligatorios",
      });
    }

    // ✅ Verificar si ya existe un rollo con ese número (único global)
    if (numeroRollo) {
      const existe = await Filamento.findOne({ numeroRollo, estado: true });
      if (existe) {
        return res.status(409).json({
          ok: false,
          mensaje: `El rollo número ${numeroRollo} ya existe en el sistema`,
        });
      }
    }

    // Crear el filamento
    const filamento = new Filamento({
      marca: marcaId,
      material,
      color,
      pesoRestante,
      numeroRollo: numeroRollo || null,
      colorHex: colorHex || null,
    });

    await filamento.save();

    return res.status(201).json({ ok: true, data: filamento });
  } catch (err) {
    console.error("crearFilamento error:", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};


// Listar filamentos activos con paginación y filtros
export const listarFilamentos = async (req, res) => {
  try {
    const { page = 1, limit = 10, marcaId, color, material } = req.query;

    const filtro = { estado: true };
    if (marcaId) filtro.marca = marcaId;
    if (color) filtro.color = { $regex: color, $options: "i" };
    if (material) filtro.material = { $regex: material, $options: "i" };

    const total = await Filamento.countDocuments(filtro);

    const filamentos = await Filamento.find(filtro)
      .populate("marca", "nombre pesoRolloVacio")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ color: 1, material: 1 });

    return res.json({
      ok: true,
      data: filamentos,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("listarFilamentos error:", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// Stock general por marca (agrupado por color)
export const stockGeneral = async (req, res) => {
  try {
    const { marcaId } = req.query;

    // validar marcaId
    if (!marcaId || !mongoose.Types.ObjectId.isValid(marcaId)) {
      return res.status(400).json({ ok: false, mensaje: "marcaId inválido o faltante" });
    }

    // agrupar por color y sumar pesos actuales
    const stock = await Filamento.aggregate([
      { $match: { marca: new mongoose.Types.ObjectId(marcaId), estado: true } },
      {
        $group: {
          _id: "$color",
          totalGramos: { $sum: "$pesoRestante" },
          cantidadRollos: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.json({ ok: true, data: stock });
  } catch (err) {
    console.error("stockGeneral error", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};


// Obtener filamento por id
export const obtenerFilamentoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ ok: false, mensaje: "Id inválido" });

    const filamento = await Filamento.findById(id).populate("marca", "nombre");
    if (!filamento)
      return res.status(404).json({ ok: false, mensaje: "Filamento no encontrado" });

    return res.json({ ok: true, data: filamento });
  } catch (err) {
    console.error("obtenerFilamentoPorId error:", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// Actualizar un filamento
export const actualizarFilamento = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ ok: false, mensaje: "Id inválido" });

    const { material, color, pesoRestante, numeroRollo, colorHex, estado } =
      req.body;

    const update = {};
    if (material) update.material = material;
    if (color) update.color = color;
    if (typeof pesoRestante === "number") update.pesoRestante = pesoRestante;
    if (numeroRollo) update.numeroRollo = numeroRollo;
    if (colorHex) update.colorHex = colorHex;
    if (typeof estado === "boolean") update.estado = estado;

    const filamento = await Filamento.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!filamento)
      return res.status(404).json({ ok: false, mensaje: "Filamento no encontrado" });

    return res.json({ ok: true, data: filamento });
  } catch (err) {
    console.error("actualizarFilamento error:", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// Marcar filamento como inactivo
export const desactivarFilamento = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ ok: false, mensaje: "Id inválido" });

    const filamento = await Filamento.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    if (!filamento)
      return res.status(404).json({ ok: false, mensaje: "Filamento no encontrado" });

    return res.json({
      ok: true,
      mensaje: "Filamento marcado como inactivo",
      data: filamento,
    });
  } catch (err) {
    console.error("desactivarFilamento error:", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// Consultar stock total de un color de una marca
export const stockPorColor = async (req, res) => {
  try {
    const { marcaId, color } = req.query;

    if (!marcaId || !color)
      return res
        .status(400)
        .json({ ok: false, mensaje: "Debe especificar marcaId y color" });

    const filamentos = await Filamento.find({
      marca: marcaId,
      color,
      estado: true,
    });

    if (!filamentos.length)
      return res.json({
        ok: true,
        data: { totalGramos: 0, cantidadRollos: 0, alerta: false },
      });

    const totalGramos = filamentos.reduce((acc, f) => acc + f.pesoRestante, 0);
    const cantidadRollos = filamentos.length;

    const marca = await Marca.findById(marcaId);
    const alerta = totalGramos <= marca.pesoRolloVacio + 100;

    return res.json({
      ok: true,
      data: { totalGramos, cantidadRollos, alerta },
    });
  } catch (err) {
    console.error("stockPorColor error:", err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};