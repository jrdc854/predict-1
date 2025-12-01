// services/productoService.js
'use strict';
const Producto = require('../models/producto');
async function obtenerProductoPorId(id) {
try {
return await Producto.findById(id);
} catch (err) {
throw new Error(`Error al obtener el producto: ${err}`);
}
}
async function crearProducto(datosProducto) {
try {
const producto = new Producto(datosProducto);
return await producto.save();
} catch (err) {
throw new Error(`Error al crear el producto: ${err}`);
}
}
module.exports = {
obtenerProductoPorId,
crearProducto
};

async function actualizarProducto(id, datosProducto) {
try {
return await Producto.findByIdAndUpdate(id, datosProducto, { new: true });
} catch (err) {
throw new Error(`Error al actualizar el producto: ${err}`);
}
};

//funciones a implementar en la practica dele crud (ejercicio)
async function eliminarProducto(id) {
    try {
        return await Producto.findByIdAndDelete(id);
    } catch (err) {
        throw new Error(`Error al eliminar el producto: ${err}`);
    }
}

async function obtenerTodosLosProductos(id) {
    try {
        return await Producto.find({});
    } catch (err) {
        throw new Error(`Error al obtener el listado de productos: ${err}`);
    }
}

module.exports = {
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    obtenerTodosLosProductos,
    eliminarProducto
};
