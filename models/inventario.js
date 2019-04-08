'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const InventarioSchema = Schema({
    nombre: String,
    max: {type:Number,min:0}
});

module.exports=mongoose.model('Inventario',InventarioSchema);