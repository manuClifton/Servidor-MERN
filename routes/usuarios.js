// RUTAS PARA CREAR USUARIOS
const express = require('express');
const router = express.Router();
const usuarioController =require('../controllers/usuarioController')
const { check } = require('express-validator');

//CREA UN USUARIO ---- MIDELWEAR
// api/usuario
router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un Email valido').isEmail(),
        check('password', 'El password deve contener 6 caracteres como minimo').isLength({min:6})
    ],
    usuarioController.crearUsuario
);

module.exports = router;