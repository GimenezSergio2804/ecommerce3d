import mongoose from "mongoose";

// Función para conectar con la base de datos MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error);
    process.exit(1); // Fuerza la salida si falla la conexión
  }
};
