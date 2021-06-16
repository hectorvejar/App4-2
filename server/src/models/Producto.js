const mongoose = require("mongoose");
const Producto = mongoose.Schema({ 
    nombre:{
        type:String,
        required:true
    },
    precio:{
        type:Array
    },
    imagen:{
        type:String
    },
    url:{
        type:Array
    }
});
module.exports = new mongoose.model("CatProducto",Producto);