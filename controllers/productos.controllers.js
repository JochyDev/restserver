const { response } = require("express");
const { Producto } = require("../models");


// Obtener Productos 
const obtenerProductos = async(req, res = response) => {
    
    const {limite = 5, desde = 0} = req.query;

    const query = {estado: true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    });

}

// Obtener Product by Id
const obtenerProducto = async(req,  res = response) => {

    const {id} = req.params;

    const producto = await Producto.findById(id)


    res.json({
        producto
    })

}


// Crear Productos
const crearProductos = async(req, res = response) => {

    const {estado, usuario, ...body} = req.body;

    const nombre = body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre });
    
    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        })
    }


    // Generar la data a guardar
    const data = {
        ...body,
        nombre, 
        usuario: req.usuario._id
    }

    const producto = new Producto( data )
    await producto.save();

    res.status(201).json(producto)

}


// Actualizar Producto 
const actualizarProducto = async(req, res = response) => {

    const {id} = req.params;

    const {estado, usuario, ...data } = req.body

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})

    res.json(producto)

}

// Borrar producto

const borrarProductos = async(req, res = response) => {

    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false})

    res.json(producto)

}






module.exports = {
    obtenerProductos,
    crearProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProductos
}