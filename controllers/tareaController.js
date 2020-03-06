const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req,res) =>{
    
    //Revisare si hay errores de validacion
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() })
    }

    

    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }
    // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

    //Crear la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
            
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un eror');
    }
}

//Obtiene las tareas por Proyecto
exports.obtenerTareas = async (req, res) =>{

   try {
    //Extraer el proyecto y comprobar si existe
       const { proyecto } = req.query;

      // console.log(req.query);

       const existeProyecto = await Proyecto.findById(proyecto);
       if(!existeProyecto){
           return res.status(404).json({msg:'Proyecto no encontrado'});
       }
   // Revisar si el proyecto actual pertenece al usuario autenticado
       if(existeProyecto.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg: 'No autorizado'})
       }
    // Obtener las tareas x proyecto
       const tareas = await Tarea.find({proyecto}).sort({ creado: -1});
       res.json({tareas});
   } catch (error) {
       console.log(error);
       res.status(500).send('Hubo un error');
   }
}

//Actualizar tareras
exports.actualizarTarea = async (req,res) =>{

    try {
        //Extraer el proyecto y tarea, comprobar si existen
           const { proyecto, nombre, estado } = req.body;
    
        // Revisar si la tarea existe
            let tareaExiste = await Tarea.findById(req.params.id);
            if(!tareaExiste){
            return res.status(404).json({msg:'Tarea no encontrada'});
            }
        // Revisar si el proyecto existe
           const existeProyecto = await Proyecto.findById(proyecto);
           if(!existeProyecto){
               return res.status(404).json({msg:'Proyecto no encontrado'});
           }
       // Revisar si el proyecto actual pertenece al usuario autenticado
           if(existeProyecto.creador.toString() !== req.usuario.id){
               return res.status(401).json({msg: 'No autorizado'})
           }


        //Crear un objeto con la nueva info
            const nuevaTarea = {}
            
            nuevaTarea.nombre = nombre;
           
            nuevaTarea.estado = estado;
        

        //Guardar la tarea
        tareaExiste = await Tarea.findOneAndUpdate({ _id: req.params.id}, nuevaTarea, {new: true});
        res.json({tareaExiste});


       } catch (error) {
           console.log(error);
           res.status(500).send('Hubo un error');
       }
}


//Elimina un tarea x su ID
exports.eliminarTarea = async (req,res) =>{

    //Obtener el tarea

    try {
        //Extraer el proyecto y tarea, comprobar si existen
        const { proyecto } = req.query;
    
        // Revisar si la tarea existe
            let tareaExiste = await Tarea.findById(req.params.id);
            if(!tareaExiste){
            return res.status(404).json({msg:'Tarea no encontrada'});
            }
        // Revisar si el proyecto existe
           const existeProyecto = await Proyecto.findById(proyecto);
           if(!existeProyecto){
               return res.status(404).json({msg:'Proyecto no encontrado'});
           }
       // Revisar si el proyecto actual pertenece al usuario autenticado
           if(existeProyecto.creador.toString() !== req.usuario.id){
               return res.status(401).json({msg: 'No autorizado'})
           }

        //Eliminar Tarea
        tareaExiste = await Tarea.findOneAndRemove({ _id: req.params.id});
        res.json({msg: 'Tarea eliminada'});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}


