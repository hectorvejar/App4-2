const { gql } = require('apollo-server-express'); //GraphQL para Apollo y Express 

//Alexander: Hay un error con las "ñ" al ejecutar el modulo de GraphQL, no sé como arreglarlo
//por mientras cambio "contraseña" por "pass"
const typeDefs = gql `
 type Usuario{
     id:ID!
     correo:String
     pass:String
     listaDeseados:[ID]
 }
input listaInput{
    idProducto:ID
}
 type Producto{
     id:ID!
     nombre:String
     descripcion:String
     precio:Float
     imagen:String!
 }

type Query{
   getListaDeseados(id:ID!):Usuario
   getPrecioProducto(id:ID!):Producto
   getInfoUsuario(id:ID):Usuario
 }

 type Mutation{
     updatePrecioProducto(productoID:ID!,nuevoPrecio:Float!): Producto                                                                          
     registroUsuarioNuevo(correo:String!,pass:String): Usuario
     agregarLista(idUsuario:ID!,idProducto:ID!):Usuario
 }
 `;
     //Mutation:modifica datos en la base de datos y los retorna lo modificado/eliminado/insertado
     //sintaxis: nombre(loQueOcupe:Tipo):LoQueRegresa , eso ultimo que regresa suele ser algo ya definido en el schema
module.exports = typeDefs;
