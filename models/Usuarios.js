const mongoose = require('mongoose');

//crear esquema de usuarios
const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true, 
    },
    registro: {
        type: Date,
        default: Date.now()
    }
});

//Le decimos a mongoose que registre el modelo de usuario con el esquema
module.exports = mongoose.model('Usuario', UsuariosSchema);