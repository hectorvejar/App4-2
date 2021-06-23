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
   leerUsuarios:async(_,args)=>{
      const usuarios = Usuario.find({})
      return usuarios
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
         const productos = Producto.find({});
         console.log (productos);
         return productos;
      }catch(error){         
         console.log(error)
      }   
   }
 },
 Mutation:{
   updatePrecioProducto :async(_,args)=>{
      const {id,precios}=args;
      const existeProducto = await Producto.findById(id.toString());
      if(!existeProducto){
         throw new Error("El producto no ha sido registrado en la base de datos");
      }
      producto = await Producto.findOneAndUpdate({ _id: id },{precio:precios}, { new: true });
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
   },
   //usuarios
   nuevoUsuario: async(_, { input }) => {
      const { correo,password } = input;
      //Revisar si usuario ya ha sido registrado
      const existeU = await Usuario.findOne({ correo })
      if (existeU) {
         throw new Error("Ya existe un usuario registrado con ese email")
      }
      //Hashear Password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt)
      //Guardar en DB
      try {
         const usuario = new Usuario(input)
         usuario.save()
         return usuario;
      } catch (error) {
         console.log(error)
      }
   },
   autenticarUsuario: async(_, { input }) => {
      const { correo, password } = input
      //Verificar si el usuario existe 
      const existe = await Usuario.findOne({ correo })
      if (!existe) {
          throw new Error("El usuario no existe")
      }
      const PasswordCorrecto = await bcryptjs.compare(password, existe.password)
      if (!PasswordCorrecto) {
          throw new Error("La contraseña es incorrecta");
      }
      //Creacción del token
      return {
         //mandamos el token para consevarlo en el header
          token: CrearToken(existe, process.env.SECRETA, '24h')
      }
  }
 }
}
module.exports= Resolvers;