const bcryptjs = require("bcryptjs")
require("dotenv").config({ path: 'variables.env' });
const JWT = require("jsonwebtoken");
const Usuario = require("../models/Usuario")
const Producto = require("../models/Producto")
const Pedido = require("../models/Pedido")
const Categorias = require("../models/categoria")
const filtros = require("../models/filtros")
//Resolvers
const CrearToken = (usuario, palabraSecreta, expiresIn) => {
    const { id, email, nombre, apellido } = usuario;
    return JWT.sign({ id, email, nombre, apellido }, palabraSecreta, { expiresIn })
}

const resolvers = {
    Query : {
        obtenerUsuario: async(_, { token }) => {
            //verificar el token
            const usuarioId = await JWT.verify(token, process.env.SECRETA)
            console.log(token)
            return usuarioId
        },
        obtenerProductosNombre: async(_,{input}) => {// esta funcion busca por el nombre, pueden ser varios productos
            try {               
                productos = await Producto.find({nombre: input});
                return productos;
            } catch (error) {
                console.log(error)
            }
        },
        obtenerProducto: async(_, { id }) => {//esta funcion busca por id de producto
            const producto = await Producto.findById({ id })
            if (!producto) {
                throw new Error("No existe el producto")
            }
            return producto
        },
        filtrarProductoCategoria: async(_,{input})=>{
            //Esta funcion busca por el id de la categoría
            const {id} = input
            const productos = await Producto.find({ categoria : id})
            if(!productos){
                throw new Error("No se encontraron productos en esta categoría")
            }            
            return productos
        },
        obtenerCategorias:async(_,{})=>{
            try {
                categorias = await Categorias.find({ });
                return categorias;
            } catch (error) {
                console.log(error)
            }        
        },
        //Oferta	Precio	Marca	Departamento	Talla	Uso			Tallas (Calzado)	Marcas (Calzado)
        obtenerProductosMultiple: async(_,{input})=>{       
            const filtro = await new filtros(input)
            // Se creó una clase para que al crear el objeto, nos arroje los valores default en aquellos que no ingresó el usuario
            // verificamos si se asignaron valores default para evitar incluirlos en el query y que sea un problema en la consulta            
            var query=  { precio: {$gt: filtro.precioMin, $lte: filtro.precioMax}, talla:{$gte:filtro.talla}}
            filtro.marca !=''?query= Object.assign({marca: filtro.marca},query) : null ;              
            filtro.categoria != ''?  query= Object.assign({categoria: filtro.categoria},query) : null
            filtro.uso != ''?  query= Object.assign({uso: filtro.uso},query) : null
            filtro.familia != ''?  query= Object.assign({familia: filtro.familia},query) : null
            filtro.departamento!= ''?  query= Object.assign({departamento: filtro.departamento},query) : null            
            try {
                const productos = await Producto.find(query);
                // console.log(query)
                return productos
            } catch (error) {
                console.log(error)
            }            
        },
        obtenerPedidos: async (_)=>{
            try {
                pedidos = await Pedido.find();
                return pedidos;
            } catch (error) {
                console.log(error)
            }
        },
        obtenerPedidosCliente: async (_,{},ctx)=>{
            try {
                pedidos = await Pedido.find({cliente: ctx.id });
                return pedidos;
            } catch (error) {
                console.log(error)
            } 
        }
    },
    Mutation : {
        nuevoUsuario: async(_, { input }) => {            
            const { email, password } = input;
            //Revisar si usuario ya ha sido registrado
            const existeU = await Usuario.findOne({ email })
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
            const { email, password } = input
            //Verificar si el usuario existe 
            const existe = await Usuario.findOne({ email })
            if (!existe) {
                throw new Error("El usuario no existe")
            }
            const PasswordCorrecto = await bcryptjs.compare(password, existe.password)
            if (!PasswordCorrecto) {
                throw new Error("La contraseña es incorrecta");
            }

            //Creacción del token
            return {
                token: CrearToken(existe, process.env.SECRETA, '24h')
            }
        },
        nuevoProducto: async(_, { input }) => {            
            console.log(input)
            const { nombre, existencia, precio } = input;
            const existeC = await Producto.findOne({ nombre })
            if (existeC) {
                throw new Error("Ya existe un producto registrado con ese nombre")
            }
            try {
                const producto = new Producto(input)
                producto.save()
                console.log(input)
                return producto;
            } catch (error) {
                console.log(error)
            }
        },
        ActualizarProducto: async(_, { id, input }) => {
            const existeProducto = await Producto.findById(id);
            if (!existeProducto) {
                throw new Error("El producto no ha sido registrado en la base de datos");
            }
            //(producto a buscar, el nuevo , para que registre el nuevo objeto (actualizado))
            producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true })
            return producto;
        },
        EliminarProducto: async(_, { id }) => {
            const existeProducto = await Producto.findById(id);
            if (!existeProducto) {
                throw new Error("El producto no ha sido registrado en la base de datos");
            }
            producto = await Producto.findOneAndDelete({ _id: id })
            return "El producto se ha eliminado con éxito";
        },
        nuevoPedido: async(_, { input }, ctx) => {
            const { pedido } = input            
            for await (const item of pedido) {
                const producto = await Producto.findById(item.id)
                if (producto.existencia >= item.cantidad) { // verificamos si se puede vender esa cantidad verificando el inventario
                    producto.existencia = producto.existencia - item.cantidad //en caso de tener suficiantes, se actualiza la existencia
                    producto.save()
                        // nuevoItem = await Producto.findOneAndUpdate({ _id: item.id }, producto, { new: true });
                } else {
                    throw new Error(`El artículo: ${producto.nombre} excede la cantidad (${producto.existencia}) disponible`)
                }
            }
            crearPedido = await new Pedido(input)            
            crearPedido.cliente = ctx.id
            return crearPedido.save() //guardamos el pedido
        },
        ActualizarPedido: async(_, { id, input }, ctx) => {
            const { cliente } = input;
            const pedido = await Pedido.findById(id)
            if (!pedido) {
                throw Error("No se encontró el pedido")
            }
            const Existe = cliente.findById(cliente);
            if (!Existe) {
                throw Error("El cliente no existe")
            }
            if (Existe.vendedor.toString() !== ctx.id) {
                throw Error("El pedido o el cliente es de otro vendedor")
            }
            for await (const item of pedido) {
                const producto = await Producto.findById(item.id)
                if (producto.existencia >= item.cantidad) {
                    producto.existencia = producto.existencia - item.cantidad
                    producto.save()
                        // nuevoItem = await Producto.findOneAndUpdate({ _id: item.id }, producto, { new: true });
                } else {
                    throw new Error(`El artículo: ${producto.nombre} excede la cantidad (${producto.existencia}) disponible`)
                }
            }
            const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true })
            return resultado;
        },
        EliminarPedido: async(_, { id }, ctx) => {
            const pedido = await Pedido.findById(id)
            if (!pedido) {
                throw Error("No se encontró el pedido")
            }
            if (pedido.vendedor.toString() !== ctx.id) {
                throw Error("El pedido es de otro vendedor")
            }
            Pedido.findByIdAndDelete({ _id: id })
            return "El pedido se ha eliminado"
        },
        nuevaCategoria:async(_,{input})=>{
            const {nombre} = input
            const existeC = await Categorias.findOne({ nombre })
            if (existeC) {
                throw new Error("Ya existe una categoría registrada con ese nombre")
            }
            try {
                resultado = new Categorias(input)
                resultado.save()
                return resultado                
            } catch (error) {
                console.log(error)
            }
        }
    }

}
module.exports = resolvers;