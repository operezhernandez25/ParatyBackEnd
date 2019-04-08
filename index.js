var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//models
const Servicio = require('./models/servicio');
const Inventario = require('./models/inventario');


var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())


/*
 * 
 * 
 * Inventario Rutas
 * 
 *
*/

//Guardar Inventario
app.post('/api/saveInventario',function(req,res){
 
   let inventario = new Inventario();
   inventario.nombre=req.body.nombre;
   inventario.max=req.body.max;
    inventario.save((err,invenSave)=>{
        if(err) res.status(500).send({message:"Error: "+err});

        res.status(200).send({inventrario:invenSave})
    })

});

//Mostrar Inventario
app.get('/api/inventario',function(req,res){
    Inventario.find((err,inven)=>{
        if(err) res.status(500).send({message:"Error: "+err});
        if(!inven) res.status(500).send({message:"No existe ese inventario"});

        res.status(200).send({inventrario:inven});
    });
});

//Mostrar especifico Inventario
app.get('/api/inventario/:idinv',function(req,res){
    Inventario.findById(req.params.idinv,(err,inven)=>{
        if(err) res.status(500).send({message:"Error: "+err});
        if(!inven) res.status(500).send({message:"No existe ese inventario"});

        res.status(200).send({inventrario:inven});
    })
});


/*
 * 
 * 
 * Servicio Rutas
 * 
 *
*/
app.post('/api/saveServicio',function(req,res){

    let requerido=JSON.parse(req.body.requerido);
    let detalles = JSON.parse(req.body.detalles);
    
    let servicio = new Servicio();
    servicio.nombre=req.body.nombre;
    servicio.descripcion=req.body.descripcion;
    servicio.requerido=requerido;
    servicio.detalles=detalles;
    servicio.save((err,serviSave)=>{
         if(err) res.status(500).send({message:"Error: "+err});
         res.status(200).send({servicio:serviSave})
     });
 });

 //Mostrar servicios
app.get('/api/servicios',function(req,res){
    Servicio.find((err,servicio)=>{
        if(err) res.status(500).send({message:"Error: "+err});
        if(!servicio) res.status(500).send({message:"No existe ese servicio"});

        res.status(200).send({servicio:servicio});
    });
});

 //Mostrar servicio
 app.get('/api/servicios/:idserv',function(req,res){
     let id=req.params.idserv;
    Servicio.findById(id,(err,servicio)=>{
        if(err) res.status(500).send({message:"Error: "+err});
        if(!servicio) res.status(500).send({message:"No existe ese servicio"});

        res.status(200).send({servicio:servicio});
    });
});

//mostrar Requerimientos de un servicio
app.get('/api/servicios/requerimientos/:idserv',function(req,res){
    let id=req.params.idserv;
   Servicio.find({'_id':id},{"requerido":1,'_id':0},(err,serv)=>{
    if(err) res.status(500).send({message:"Error: "+err});
   var requerimientos = serv[0].requerido;//Requerimientos de los servicios

    //Obteniendo ids de los requerimientos y convirtiendolos en ObjectIds
    let ids = requerimientos.map( a => new mongoose.Types.ObjectId(a.referencia));

    //obteniendo del inventario los requerimientos
    Inventario.find({
        '_id':{$in:ids}
    },(err,itemInventario)=>{
        if(err) res.status(500).send({message:"Error: "+err});

        var InventarioEnviar = itemInventario.map(function(item) {
            var itemtemporal = item.toObject();
            requerimientos.forEach(element => {
                if(element.referencia.equals(itemtemporal._id)){
                    // Añadiendo la cantidad que utiliza el servicio
                    itemtemporal.cantidad = element.cantidad;
                    itemtemporal.idServicio=id; 
                }
            });
            return itemtemporal;
          });
        res.status(200).send({Inventario:InventarioEnviar});
    })
 })
});

//mostrar Requerimientos de todos los servicios
app.get('/api/servicio/requerimientosAll',function(req,res){
    let id=22;
    Servicio.find({},{"requerido":1,'_id':0},(err,serv)=>{
     if(err) res.status(500).send({message:"Error: "+err});
    var requerimientos = serv[0].requerido;//Requerimientos de los servicios
    res.status(200).send({Inventario:serv});
     //Obteniendo ids de los requerimientos y convirtiendolos en ObjectIds
     let ids = requerimientos.map( a => new mongoose.Types.ObjectId(a.referencia));
 
     //obteniendo del inventario los requerimientos
    //  Inventario.find({
    //      '_id':{$in:ids}
    //  },(err,itemInventario)=>{
    //      if(err) res.status(500).send({message:"Error: "+err});
 
    //      var InventarioEnviar = itemInventario.map(function(item) {
    //          var itemtemporal = item.toObject();
    //          requerimientos.forEach(element => {
    //              if(element.referencia.equals(itemtemporal._id)){
    //                  // Añadiendo la cantidad que utiliza el servicio
    //                  itemtemporal.cantidad = element.cantidad;
    //                  itemtemporal.idServicio=id; 
    //              }
    //          });
    //          return itemtemporal;
    //        });
    //      res.status(200).send({Inventario:InventarioEnviar});
    //  })
  })
})











mongoose.connect('mongodb://localhost:27017/Paraty',{useNewUrlParser:true},(err,res)=>{
    if(err) throw err
    console.log('Conexion a la base de datos establecida');
    app.listen(3000,function(){
        console.log("Servidor corriendo en puerto 3000")
    })
})
mongoose.set('useCreateIndex', true);

