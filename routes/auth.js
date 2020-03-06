// RUTAS PARA AUTENTICAR USUARIOS
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//---- MIDDLAWARE  -----------
// api/auth

//INICIAR SESION
router.post('/', 
    [
        check('email', 'Agrega un Email valido').isEmail(),
        check('password', 'El password deve contener 6 caracteres como minimo').isLength({min:6})
    ],
    authController.autenticarUsuario
);

//Obtiene usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;