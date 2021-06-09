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
    getListaDeseados:async(_,id)=>{
      const producto = await Usuario.findById({ id })
      if (!producto) {
          throw new Error("No existe el producto")
      }
      return producto
    }
 },
 Mutation:{
   registroUsuarioNuevo: async(_,args)=>{
      const {correo,pass}=args;
      const existeU = await Usuario.findOne({ correo })
      if(existeU){
         throw new Error("Ya existe un usuario registrado con ese email");
      }
       //Hashear Password
       const salt = await bcryptjs.genSalt(10);
       args.pass = await bcryptjs.hash(pass, salt)
       try {
         const usuario = new Usuario(args)
         usuario.save()
         return usuario;
     } catch (error) {
         console.log(error)
     }
   },
   agregarLista: async(_,args)=>{
      const {idUsuario,idProducto}=args;
      
   }

 }
}
module.exports= Resolvers;