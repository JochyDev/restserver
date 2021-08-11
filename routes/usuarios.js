const  { Router } = require('express');
const { check } = require('express-validator')


const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('./../middlewares/index')

const { 
    esRoleValido,
    emailExiste,
    existerUsuarioPorId
} = require('../helpers/db-validators');

const { 
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete 
} = require('../controllers/usuarios.controllers');

const router = Router();



router.get('/', usuariosGet);

router.put('/:id',
[
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom( existerUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
],
usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y debe terner mas de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom( existerUsuarioPorId ),
    validarCampos
], usuariosDelete);




module.exports = router;