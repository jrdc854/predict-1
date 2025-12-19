// server.js
// Entry point del servicio PREDICT
require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require('mongoose');

const predictRoutes = require("./routes/predictRoutes");
const predictController = require('./controllers/predictController');
const { initModel } = require("./services/tfModelService");

const MODEL_VERSION = process.env.MODEL_VERSION || "v1.0"; 
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/prediction";

const app = express();
app.use(express.json());



mongoose.connect(MONGO_URI)
.then(() => {
  console.log('[MONGODB] Conexión a la base de datos establecida');
}).catch(err => {
  console.error('[MONGODB] Error de conexión a la base de datos:', err);
});


const modelDir = path.resolve(__dirname, "model");
app.use("/model", express.static(modelDir));

app.get('/api/predict/heañthy', predictController.health);
app.post('/api/predict/ready', predictController.ready);
app.post('/api/predict', predictController.doPredict);
app.get('/api/predict', predictController.obtenerTodos); 
app.delete('/api/predict/:id', predictController.eliminar); 

app.use("/", predictRoutes);

// Arranque del servidor y carga del modelo
app.listen(PORT, async () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`[PREDICT] Servicio escuchando en ${serverUrl}`);

  try {
    await initModel(serverUrl);
  } catch (err) {
    console.error("Error al inicializar modelo:", err);
    process.exit(1);
  }
});




