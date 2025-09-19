import mongoose from "mongoose";

// definimos el esquema
const filamenteSchema = new mongoose.Schema(
  {
    marca: {
      type: mongoose.Schema.Types.ObjectId, // relacion con otra coleccion
      ref: "Marca", // referencia al modelo Marca
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    pesoActual: {
      type: Number,
      required: true,
      min: 0,
    },
    fechaCarga: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Filamento = mongoose.model("Filamento", filamentoSchema);
