const { gql } = require('apollo-server-express'); //GraphQL para Apollo y Express 

const typeDefs = gql `
 type Usuario{
     id:ID!
     email:String
     password:String
     apellido:String
     nombre:String
 }
 type Producto{
     id:ID!
     usuario:ID
     nombre:String
     precio:Float
     imagen:String
     url:String
 }

input productoInput{
    usuario:ID
    nombre:String
    precio:Float
    imagen:String
    url:String
}
input usuarioInput{    
    email:String
    password:String
    apellido:String
    nombre:String
}
input AutenticarInput {
    email: String!
    password: String!
}
type Token {
    token: String
}

type Query{ 
    #-- Productos -- 
   leerProducto(id:ID):Producto
   obtenerProductos: [Producto!]

    #-- Lista de deseados --
    #solo para pruebas
    leerUsuarios:[Usuario]
 }
 type Mutation{
     #--- Productos --
     updatePrecioProducto(id:ID,input:productoInput!): Producto 
     crearProducto(producto:productoInput!):Producto          
     eliminarProducto(id:ID!):String                                                          

     #-- Lista de deseados --
     #elimProducList():String
     #Usuarios
     nuevoUsuario(input:usuarioInput!):Usuario
     autenticarUsuario (input: AutenticarInput ): Token
 }  
 `;
module.exports = typeDefs;
