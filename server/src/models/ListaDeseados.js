<<<<<<< HEAD
const mongoose = require("mongoose");
const ListaDeseados = mongoose.Schema({ 
    id:{
        type:String,
        required:true
    },
    productos:{
        type:Array,
        required:true
    }
});
module.exports = new mongoose.model("CatLista",ListaDeseados);
=======
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
>>>>>>> 4dd3b53ab2d31803227744c49cb5316f691772c5
