const Usuario = require('../models/Usuarios');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.autenticarUsuario = async (req, res) =>{

    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }

    
    //extraer el email y password
    const { email, password } = req.body;

    try {
        //Revisar usuario registrado
        let usuario = await Usuario.findOne({ email });

        if(!usuario){
            return res.status(400).json({ msg: 'El usuario NO existe'});
        }
        
        //Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg:'Password Incorrecto'});
        }

        //Si todo es correcto. Crear y firmar JsonWebToken
        const payload = {
            usuario:{
                id: usuario.id
            }
        };
        //Firmar el TOKEN
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // una hora de expiracion
        }, (error, token) => {
            if(error) throw error;
            //MSJ de confirmacion
            res.json({ token: token});
        } );
    } catch (error) {
        console.log(error);
    }

}

//Obtiene que el usuario esta autenticado
exports.usuarioAutenticado = async (req,res) =>{
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}


