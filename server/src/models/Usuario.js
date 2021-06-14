const mongoose = require("mongoose");
const Usuario = new mongoose.Schema({ 
    correo:{
        type:String,
        required:true,
        trim: true,
        unique:true
    },
    contraseña:{
        type:String,
        required:true,
        trim: true,
        unique:true
    },
    listaDeseados:{
        type:Array
    }
});
module.exports = new mongoose.model("CatUsuario",Usuario);