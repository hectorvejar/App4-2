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
   getPrecioProducto: async(_,args)=>{
      const {id}=args;
      const producto = await Producto.findById( id.toString() )
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
   obtenerProductos: async(_,args)=>{
      const productos = await Producto.find({})
      return productos
   }
 },
 Mutation:{
   updatePrecioProducto :async(_,args)=>{
      const {id,nuevoPrecio}=args; //awanta no se si esta bien
      const existeProducto = await Producto.findById({id});
      if(!existeProducto){
         throw new Error("El producto no ha sido registrado en la base de datos");
      }
      producto = await Producto.findOneAndUpdate({ _id: id }, nuevoPrecio, { new: true })
      return producto;
   },
   crearProducto:async(_,args)=>{      
      const {nombre}= args;
      const exist = await Producto.findOne({nombre});
      if(exist){
         throw new Error("Este producto ya fue registrado");
      }      
      try{
         const producto = new Producto(args.producto)           
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