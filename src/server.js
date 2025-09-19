import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// carga de variables de entorno
dotenv.config();

// conexion de la base de datos
connectDB();

// inicializacion de la app
const app = express();

// Middlewares
app.use(cors()); // permite peticiones desde otros dominios (CORS)
app.use(express.json()); // permite recibir datos en formato JSON en el body

// Rutas de prueba
app.get("/prueba", (req, res) => {
  res.send("🚀 Backend de ecommerce funcionando");
});

// Servidor

// Definir el puerto desde .env o usar 5000 por defecto
const PORT = process.env.PORT || 5000;

// levantar el server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
