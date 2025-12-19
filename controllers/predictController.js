// controllers/predictController.js
const { getModelInfo, predict } = require("../services/tfModelService");
const Prediction = require("../model/dataModel"); // <--- AÑADIDO: Importar el modelo

function health(req, res) {
  res.json({
    status: "ok",
    service: "predict"
  });
}

function ready(req, res) {
  const info = getModelInfo();

  if (!info.ready) {
    return res.status(503).json({
      ready: false,
      modelVersion: info.modelVersion,
      message: "Model is still loading"
    });
  }

  res.json({
    ready: true,
    modelVersion: info.modelVersion
  });
}

async function doPredict(req, res) {
  const start = Date.now();

  try {
    const info = getModelInfo();
    if (!info.ready) {
      return res.status(503).json({
        error: "Model not ready",
        ready: false
      });
    }

    const { features, meta } = req.body;

    if (!features) {
      return res.status(400).json({ error: "Missing features" });
    }
    if (!meta || typeof meta !== "object") {
      return res.status(400).json({ error: "Missing meta object" });
    }

    const { featureCount } = meta;

    if (featureCount !== info.inputDim) {
      return res.status(400).json({
        error: `featureCount must be ${info.inputDim}, received ${featureCount}`
      });
    }

    if (!Array.isArray(features) || features.length !== info.inputDim) {
      return res.status(400).json({
        error: `features must be an array of ${info.inputDim} numbers`
      });
    }

    const prediction = await predict(features);
    const latencyMs = Date.now() - start;
    const timestamp = new Date().toISOString();

    // --- AÑADIDO: Lógica para guardar en Mongo ---
    // Convertimos prediction a número si viene en array para que cuadre con tu Schema
    const valPred = Array.isArray(prediction) ? prediction[0] : prediction;
    
    const nuevaPrediccion = new Prediction({
        features: features,
        prediction: valPred,
        modelVersion: info.modelVersion,
        // ts: se pone solo por el default
    });
    const guardado = await nuevaPrediccion.save();
    // ---------------------------------------------

    // Modificado solo predictionId para devolver el real
    res.status(201).json({
      predictionId: guardado._id, 
      prediction,
      timestamp,
      latencyMs
    });
  } catch (err) {
    console.error("Error en /predict:", err);
    res.status(500).json({ error: "Internal error" });
  }
}

// Corregido "red" -> "res" para que funcione
async function obtenerTodos(req, res) { 

    try {
        // --- MODIFICADO: Usar Mongoose en lugar de tfModelService ---
        const predictions = await Prediction.find(); 
        res.status(200).send({ predictions });
    } catch (err) {
        res.status(500).send({ mensaje: `Error al listar las predicciones: ${err.message}`});
    }
}

async function eliminar(req, res) {
    let predictionId = req.params.id;
    try {
        // --- MODIFICADO: Usar Mongoose en lugar de productoService ---
        const resultado = await Prediction.findByIdAndDelete(predictionId);
        
        // findByIdAndDelete devuelve null si no encuentra el producto a eliminar
        if (!resultado) { 
            return res.status(404).send({ mensaje: 'El producto a eliminar no existe' });
        }
        // Si se eliminó correctamente, respondemos con 200 OK y el producto eliminado
        res.status(200).send({ mensaje: 'Producto eliminado correctamente', prediction: resultado });

    } catch (err) {
        res.status(500).send({ mensaje: `Error al eliminar el producto: ${err.message}` });
    }
}
module.exports = {
  health,
  ready,
  doPredict,
  obtenerTodos,
  eliminar
};