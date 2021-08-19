const  { Router } = require('express');
const { check } = require('express-validator');

const { 
    obtenerProductos,
    crearProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProductos
} = require('../controllers/productos.controllers');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const routes = Router();

// obtener productos
routes.get('/', obtenerProductos)

// obtener producto
routes.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)
// crear producto
routes.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatorio').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProductos)
// actulizar producto
routes.put('/:id',[
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto)

// borrar producto
routes.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],borrarProductos )


module.exports = routes