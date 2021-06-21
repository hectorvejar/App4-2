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
 type respuestaPreProd{
     precio:[precios]
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
    #-- Productos -- 
   getPrecioProducto(nombre:String!):respuestaPreProd
   leerProducto(id:ID):Producto
   obtenerProductos: [Producto!]! 

    #-- Lista de deseados --

 }
 type Mutation{
     #--- Productos --
     updatePrecioProducto(id:ID,precios:preciosInput): Producto 
     crearProducto(producto:crearInput!):Producto          
     eliminarProducto(id:ID!):String                                                          

     #-- Lista de deseados --
     #agregarLista():ListaDeseados
     #getListaDeseados():ListaDeseados
     #elimProducList():String
 }  
 `;
module.exports = typeDefs;
