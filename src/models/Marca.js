import mongoose from "mongoose";

// definimos el esquema de marca
const marcaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true, // lo hace obligatorio
      unique: true, // no se pueden repetir marcas con el mismo nombre
      trim: true, // elimina espacios en blanco innecesarios
    },
    pesoRolloVacio: {
      type: Number,
      required: true, // obligatorio
      min: 0, // no puede ser negativo
    },
  },
  {
    timestamps: true, // agrega createAt y updateAt automaticamente
  }
);

// creamos el modelo en la base de datos
export const Marca = mongoose.model("Marca", marcaSchema);
