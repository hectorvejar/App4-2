const mongoose = require("mongoose");
const Producto = mongoose.Schema({ 
    nombre:{
        type:String,
        required:true,
        unique:true
    },
    descripcion:{
        type:String,
        unique:true
    },
    precio:{
        type:Number,//Mongoose no maneja Float (?)
        required:true,
    },
    imagen:{
        type:String,
        required:true,
        unique:true
    }
});
module.exports = new mongoose.model("CatProducto",Producto);