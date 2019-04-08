'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//SubDocumento
const RequerimientoSchema = Schema({
    referencia: Schema.Types.ObjectId,
    cantidad: {type:Number,min:0}
},{ _id : false });

//SubDocumento
const DetallesSchema=Schema({
    titulo:String,
    cantidad:{type:Number,min:0}
},{ _id : false })

const ServicioSchema = Schema({
    nombre:String,
    descripcion:String,
    precio:Number,
    requerido:[RequerimientoSchema],
    detalles:[DetallesSchema]
});

ServicioSchema.index({requerido:1,type:1});
ServicioSchema.index({detalles:1,type:1});

module.exports=mongoose.model('Servicio',ServicioSchema);
