const Usuario = require('../models/Usuarios');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) =>{

    //revisar si hay erres
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }

    //extraer Email y Pass
    const {email, password} = req.body;

    try {
        //Revisar que el usuario se unico
        let usuario = await Usuario.findOne({ email });
            if(usuario){
                return res.status(400).json({ msg: 'Ya existe el usuario'});
            }

        //crea nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar usuario en BD
        await usuario.save();
        
        //Crear y firmar JsonWebToken
        const payload = {
            usuario:{
                id: usuario.id
            }
        };
        //Firmar el TOKEN
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 36000 // una hora de expiracion
        }, (error, token) => {
            if(error) throw error;
            //MSJ de confirmacion
            res.json({ token: token});
        } );
        
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un Error');
    }
}