//Ruta raiz: /api/usuarios

const { Router } = require('express');
const {getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario} = require('../controllers/usuarios');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');
const router = Router();

router.get('/',validarJwt, getUsuarios);

//Funciones que se ejecutan antes de pasar al controlador
router.post('/',
     [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('password','El password es obligatorio').not().isEmpty(),
        check('email','Email obligatorio').isEmail(),
        validarCampos,
     ],
 crearUsuario);

 router.put('/:id',
    [
       validarJwt,
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('email','Email obligatorio').isEmail(),
        check('role','El role es obligatorio').not().isEmpty(),
        validarCampos,
    ] ,
    actualizarUsuario);

    
 router.delete('/:id',
    validarJwt,
    borrarUsuario);






module.exports = router;