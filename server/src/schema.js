const { gql } = require('apollo-server-express'); //GraphQL para Apollo y Express 

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
     precio:[precios]
     imagen:String
     url:[urls]
 }
 type urls{
     calzapato:String
     amazon:String
 }
type precios{
    calzapato:Float
    amazon:Float
}
 type ListaDeseados{
     id:ID
     productos:[Producto]
 }
type respuestaGetPrecio{
    precio:Float
}

input crearInput{
    nombre:String!
    precio:preciosInput!
    imagen:String
    url:urlsInput
}
input preciosInput{
    calzapato:Float
    amazon:Float
}
input urlsInput{
    calzapato:String
     amazon:String
}

type Query{
   #getListaDeseados(id:ID!):ListaDeseados
   getPrecioProducto(id:ID!):respuestaGetPrecio #pendiente
   leerProducto(id:ID):Producto
   obtenerProductos: [Producto!]!  #pendiente
 }
 type Mutation{
     updatePrecioProducto(id:ID,nuevoPrecio:preciosInput!): Producto  #pendiente 
     crearProducto(producto:crearInput!):Producto          
     eliminarProducto(id:ID!):String                                                          

    
     #agregarLista(idUsuario:ID!,producto:Producto):ListaDeseados
     
     #registroUsuarioNuevo(correo:String!,pass:String): Usuario 
     #eliminarCuenta(id:ID!):Usuario
     #cambiarCorreo(id:ID!,nuevoCorreo:String!):Usuario
     #cambiarPass(id:ID!,nuevaPass:String!):Usuario
 }  
 `;
module.exports = typeDefs;
