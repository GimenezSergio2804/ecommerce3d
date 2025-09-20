import mongoose from 'mongoose';

const FilamentoSchema = new mongoose.Schema({

     // Relación con Marca
     marca: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marca", // referencia al modelo Marca
      required: true,
    },

    material: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Color del filamento (ej: Rojo, Azul, Negro)
    color: {
      type: String,
      required: true,
      trim: true,
    },

    colorHex: {
        type: String,
        default: null, // opcional
        match: /^#([0-9A-Fa-f]{3}){1,2}$/, // valida que sea formato hex si se carga
    },

    pesoRestante: {
      type: Number,
      required: true,
    },
    numeroRollo: {
      type: Number,
      unique: true,
      default: null, // opcional
      sparse: true // para poder guardar mas de un null
    },
    
    // Alerta cuando quede poca cantidad
    alertaMinima: {
      type: Number,
      default: 100, // si baja de 100g muestra alerta
    },

    estado: {
        type: Boolean,
        default: true, // true = activo, false = inactivo
    },
},

    {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    }
)

export default mongoose.model("Filamento", FilamentoSchema);