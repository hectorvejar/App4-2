const { gql } = require('apollo-server-express'); //GraphQL para Apollo y Express 

//Alexander: Hay un error con las "ñ" al ejecutar el modulo de GraphQL, no sé como arreglarlo
//por mientras cambio "contraseña" por "pass"
const typeDefs = gql `
 type Usuario{
     id:ID!
     correo:String
     pass:String
     lista:[ListaDeseados]
 }
 type Producto{
     id:ID!
     nombre:String
     precio:Float
     imagen:String
     url:String
 }

 type ListaDeseados{
     id:ID
     productos:[Producto]
 }
type respuestaGetPrecio{
    precio:Float
}
type Query{
   #getListaDeseados(id:ID!):ListaDeseados
   getPrecioProducto(id:ID!):respuestaGetPrecio
   leerProducto(id:ID):Producto
   obtenerProductos: [Producto]
 }
 type Mutation{
     updatePrecioProducto(id:ID,nuevoPrecio:Float!): Producto  
     crearProducto(nombre:String,precio:Float,imagen:String,url:String):Producto          
     eliminarProducto(id:ID):String                                                             
    
     #agregarLista(idUsuario:ID!,producto:Producto):ListaDeseados
     
     registroUsuarioNuevo(correo:String!,pass:String): Usuario 
     eliminarCuenta(id:ID!):Usuario
     cambiarCorreo(id:ID!,nuevoCorreo:String!):Usuario
     cambiarPass(id:ID!,nuevaPass:String!):Usuario
 }  
 `;
     //Mutation:modifica datos en la base de datos y los retorna lo modificado/eliminado/insertado
     //sintaxis: nombre(loQueOcupe:Tipo):LoQueRegresa , eso ultimo que regresa suele ser algo ya definido en el schema
module.exports = typeDefs;
