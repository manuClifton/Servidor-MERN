const express = require('express');//importa express
const conectarDB = require('./config/db');
const cors = require('cors');


// crear el servidor
const app = express();

//Conectar a la DataBase
conectarDB();

//Habilitar corse ( unir front y back en la url)
app.use(cors());

/*
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "domain"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
  });
  */

 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//Habilitar express.json
app.use(express.json({ extended: true }));

//crear un puerto al servidor
const port = process.env.port || 4000;

//Importar Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

/*
//definir pagina principal
app.get('/', (req, res) =>{
    res.send("Hola mundo")
});
*/

//Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});