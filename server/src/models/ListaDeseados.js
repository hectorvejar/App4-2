const mongoose = require("mongoose");
const ListaDeseados = mongoose.Schema({ 
    id:{
        type:String,
        required:true
    },
    productos:{
        type:String,
        required:true
    }
});
module.exports = new mongoose.model("CatProducto",ListaDeseados);