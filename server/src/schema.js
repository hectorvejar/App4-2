const { gql } = require("apollo-server");

const typeDefs = gql `
    
    type Token {
        token: String
    }

    type Producto {
        id: ID
        nombre: String
        existencia: Int
        precio: Float
        creado: String
        familia: familiaProducto
        categoria: ID
        departamento: String
        talla: Int
        uso: String
        marca: String
        imagen: [Imagenes]
        oferta: Float
    }
    input ProductoInput {
        nombre: String!
        existencia: Int!
        precio: Float!    
        familia: familiaProducto!
        categoria: ID!
        departamento: String!
        talla: Int
        uso: String!
        marca:String!
        imagen: [ImagenesInput]
        oferta: Float
    }
    type Imagenes{
        nombre:String              
        direccion: String
    }
    input ImagenesInput{
        nombre:String
        direccion: String
    }
    input BuscarProducto {
        nombre: String!
    }
    input ProductoFiltros {
        categoria: ID        
        marca:String
        uso: String
        talla: Int
        precioMin:Float
        precioMax:Float
        oferta:Float
        familia: familiaProducto
        departamento:String
    }    
    input AutenticarInput {
        email: String!
        password: String!
    }
    input CategoriaInput {
        id: ID
        nombre: String
    }
    type Categoria {
        id: ID
        nombre:String
    }
    enum familiaProducto {
        Calzado
        Ropa
        Accesorios
    } 

    type Usuario{
        id: ID
        nombre : String!
        apellido : String!
        telefono : String
        password: String!
        direccion : Direccion
        fechaAlta : String
        email:String
    }
    input UsuarioInput{
        nombre : String!
        apellido : String!
        email: String!
        password: String!
        direccion : DireccionInput,
        telefono:String!    
    }    
    type Direccion {
        id : ID
        cp: String
        calle : String
        numero: String
        ciudad: String
        estado : String
        pais : String
    }
    input DireccionInput {
        cp: String
        calle : String
        numero: String
        ciudad: String
        estado : String
        pais : String
    }
    
    type Pedido {
        id: ID
        pedido : [PedidoGrupo]
        total : Float
        cliente : ID        
        estado : EstadoPedido
        creado : String
        pago: ID
    }
    type PedidoGrupo {
        id: ID!
        cantidad : Int        
    }

    
    input PedidoProductoInput {
        id: ID!
        cantidad: Int        
    }
    input PedidoInput {
        pedido: [PedidoProductoInput]
        total : Float        
        estado : EstadoPedido!
        pago: ID     
    }
    enum EstadoPedido {
        PENDIENTE
        COMPLETADO
        CANCELADO
    }
    
    type Query {        
        
        #Usuario
        obtenerUsuario(token: String!) : Usuario
        
        #Producto
        obtenerProducto(id: ID!): Producto        
        obtenerProductosNombre(input: String): [Producto]
        filtrarProductoCategoria(input : CategoriaInput) : [Producto]
        obtenerProductosMultiple(input : ProductoFiltros) : [Producto]
        #Categorias
        obtenerCategorias:[Categoria]

        #Pedidos
        obtenerPedidos:[Pedido]
        obtenerPedidosCliente:[Pedido]
    }
    type Mutation {
        # Usuarios
        nuevoUsuario (input: UsuarioInput): Usuario 
        autenticarUsuario (input: AutenticarInput ): Token

        #Productos
        nuevoProducto (input: ProductoInput!): Producto
        ActualizarProducto (id: ID!,input: ProductoInput!): Producto
        EliminarProducto (id: ID!): String

        #Pedidos
        nuevoPedido(input: PedidoInput): Pedido
        ActualizarPedido(id : ID!, input: PedidoInput): Pedido
        EliminarPedido(id:ID!): String
        
        #Categoria
        nuevaCategoria(input: CategoriaInput): Categoria
    }
`;
module.exports = typeDefs;