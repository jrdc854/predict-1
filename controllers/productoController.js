// controllers/productoController.js
'use strict';
const productoService = require('../services/productoService');
async function obtenerProductoPorId (req, res) {
let productoId = req.params.id;
try {
const producto = await productoService.obtenerProductoPorId(productoId);
if (!producto) {
return res.status(404).send({ mensaje: 'El producto no existe' });
}
res.status(200).send({ producto });
} catch (err) {
res.status(500).send({ mensaje: `Error al realizar la petición: ${err.message}` });
}
};
async function crearProducto (req, res) {
console.log('POST /api/producto');
console.log(req.body);
try {
const productoStored = await productoService.crearProducto(req.body);
res.status(200).send({ producto: productoStored });
} catch (err) {
res.status(500).send({ mensaje: `Error al salvar en la base de datos: ${err.message}` });
}
};
module.exports = {
obtenerProductoPorId,
crearProducto
};

async function actualizarProducto(req, res) {
console.log('PUT /api/producto/:id');
console.log(req.body);
let productoId = req.params.id;
let update = req.body;
try {
const productoUpdated = await productoService.actualizarProducto(productoId, update);
if (!productoUpdated) {
return res.status(404).send({ mensaje: 'El producto no existe' });
}
res.status(200).send({ producto: productoUpdated });
} catch (err) {
res.status(500).send({ mensaje: `Error al actualizar el producto: ${err.message}` });
}
};

//funciones nuevas 
async function obtenerTodosLosProductos(req, res) {
    try {
        const productos = await productoService.obtenerTodosLosProductos();
        res.status(200).send({ productos });
    } catch (err) {
        res.status(500).send({ mensaje: 'Error al listar los productos: ${err.message}'});
    }
}

async function eliminarProducto(req, res) {
    let productoId = req.params.id;
    try {
        const resultado = await productoService.eliminarProducto(productoId);
        
        // findByIdAndDelete devuelve null si no encuentra el producto a eliminar
        if (!resultado) { 
            return res.status(404).send({ mensaje: 'El producto a eliminar no existe' });
        }
        // Si se eliminó correctamente, respondemos con 200 OK y el producto eliminado
        res.status(200).send({ mensaje: 'Producto eliminado correctamente', producto: resultado });

    } catch (err) {
        res.status(500).send({ mensaje: `Error al eliminar el producto: ${err.message}` });
    }
}

module.exports = {
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    obtenerTodosLosProductos,
    eliminarProducto
};