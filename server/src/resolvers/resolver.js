const ListaDeseados= require('../models/ListaDeseados');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const JWT = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const CrearToken = (usuario, palabraSecreta, expiresIn) => {
   const { id, correo, pass } = usuario; 
   return JWT.sign({ id, correo, pass}, palabraSecreta, { expiresIn })
}

const Resolvers={
 Query:{
   getPrecioProducto: async(_,args)=>{ //incompleto
      const {nombre}=args;
      const producto = await Producto.find({nombre})
      if (!producto) {
          throw new Error("No existe el producto")
      }
      return producto
   },
   leerProducto: async(_,args)=>{
      const {id}=args;
      const producto = await Producto.findById( id.toString() )
      if (!producto) {
          throw new Error("No existe el producto")
      }
      return producto
   },
   obtenerProductos: async() =>{
      try{
         const productos = Producto.find();
         console.log (productos);
         return productos;
      }catch(error){         
         console.log(error)
      }   
   }
 },
 Mutation:{
   updatePrecioProducto :async(_,{id,nuevoPrecio})=>{
      const existeProducto = await Producto.findById(id.toString());
      if(!existeProducto){
         throw new Error("El producto no ha sido registrado en la base de datos");
      }
      producto = await Producto.findOneAndUpdate({ _id: id }, nuevoPrecio, { new: true });
      return producto;
   },
   crearProducto:async(_,args)=>{      //ver lo de los permisos de la db
      const {nombre}= args;
      const exist = await Producto.findOne({nombre});
      if(exist){
         throw new Error("Este producto ya fue registrado");
      }      
      try{
         const producto = new Producto(args.producto)
         console.log(producto)
         // console.log(args)
         producto.save()
         return producto;
      }catch(error){         
         console.log(error)
      }      
      
   },
   eliminarProducto:async(_,{id})=>{
      const existeProducto = await Producto.findById(id);
      if (!existeProducto) {
          throw new Error("El producto no ha sido registrado en la base de datos");
      }
      producto = await Producto.findOneAndDelete({ _id: id })
      return "El producto se ha eliminado con éxito";
   }
 }
}
module.exports= Resolvers;