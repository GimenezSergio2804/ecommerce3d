import mongoose from 'mongoose';
import Marca from '../models/Marca.js'

// crear una marca ( marca del rollo)

export const crearMarca = async (req, res) => {
  try {
    // obtengo las variables del body
    const { nombre, pesoRolloVacio } = req.body;

    // respuesta si vienen datos vacios
    if (!nombre || typeof pesoRolloVacio !== 'number') {
      return res.status(400).json({ ok: false, mensaje: 'nombre y el peso del rollo(vacio) son obligatorios' });
    }

    // respuesta si ya existe una marca con ese nombre
    const existe = await Marca.findOne({ nombre: nombre.trim() });
    if (existe) return res.status(409).json({ ok: false, mensaje: 'Marca ya existe' });

    // creacion si esta todo ok
    const marca = await Marca.create({ nombre: nombre.trim(), pesoRolloVacio });
    return res.status(201).json({ ok: true, data: marca });

  } catch (err) {
    console.error('crearMarca error', err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// Listar todas las marcas - paginado

export const listarMarcas = async (req, res) => {
  try {
    // destructurop por si viene q en mi query, y paginamos
     const { q, page = 1, limit = 10 } = req.query;
    // creo una variable filtro por si no viene q en mi query
    const filtro = {};
    // filtro con expresiones regulares si existe q en mi query
    if (q) filtro.nombre = { $regex: q, $options: 'i' };

    // conteo para paginacion
    const total = await Marca.countDocuments(filtro);

    // si q no existe entonces me trae todas las marcas
    const marcas = await Marca.find(filtro)
    .sort({ nombre: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));;

    // paginacion y return
    return res.json({ ok: true, data: marcas,  
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit), });

  } catch (err) {
    console.error('listarMarcas error', err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};


// Obtener marca por id

export const obtenerMarcaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // el id no es correcto
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ ok: false, mensaje: 'id inválido' });

    // buscamos id
    const marca = await Marca.findById(id);
    // si no existe
    if (!marca) return res.status(404).json({ ok: false, mensaje: 'Marca no encontrada' });
    // si es que existe
    return res.json({ ok: true, data: marca });
  } catch (err) {
    console.error('obtenerMarcaPorId error', err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// Actualizar Marca
export const actualizarMarca = async (req, res) => {
  try {
    const { id } = req.params;

    // id invalido
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ ok: false, mensaje: 'id inválido' });

    // traemos los datos
    const { nombre, pesoRolloVacio } = req.body;
    const update = {};

    // se genera variables de actualizacion
    if (typeof nombre === 'string') update.nombre = nombre.trim();
    if (typeof pesoRolloVacio === 'number') update.pesoRolloVacio = pesoRolloVacio;

    // actualizacion de datos
    const marca = await Marca.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    // si no hay marca se retorna que no se encontro
    if (!marca) return res.status(404).json({ ok: false, mensaje: 'Marca no encontrada' });

    // return de datos correctos
    return res.json({ ok: true, data: marca });

  } catch (err) {
    console.error('actualizarMarca error', err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// eliminar marca
export const eliminarMarca = async (req, res) => {
  try {
    const { id } = req.params;

    // id invalido
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ ok: false, mensaje: 'id inválido' });

    // buscamos y eliminamos
    const marca = await Marca.findByIdAndDelete(id);

    // si no habia datos se retorna "no encontrada"
    if (!marca) return res.status(404).json({ ok: false, mensaje: 'Marca no encontrada' });

    // return correcto
    return res.json({ ok: true, mensaje: 'Marca eliminada' });

  } catch (err) {
    console.error('eliminarMarca error', err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};

// Buscar marca por nombre (case-insensitive) // es la misma que listarMArcas -- la utilizamos para diferenciar - sin paginar

export const buscarPorNombre = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ ok: false, mensaje: 'query param q requerido' });
    const marcas = await Marca.find({ nombre: { $regex: q, $options: 'i' } }).sort({ nombre: 1 });
    return res.json({ ok: true, data: marcas });
  } catch (err) {
    console.error('buscarPorNombre error', err);
    return res.status(500).json({ ok: false, mensaje: err.message });
  }
};