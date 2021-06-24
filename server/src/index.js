const { ApolloServer } = require('apollo-server');
require("dotenv").config({path: 'variables.env'});
const JWT = require("jsonwebtoken");
const typeDefs = require('./schema');
const resolvers = require('./resolvers/resolver');
//para que permita accesos
var cors = require('cors')
//https://buddy.works/tutorials/how-to-connect-mongodb-to-graphql-server
//usuario: hector    password: contraseña
const conectarDB = require("../src/config/db");
conectarDB();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({ req }) => {
      const token = req.headers['authorization'] || "";
        if (token) {
            try {
                const verificar = JWT.verify(token, process.env.SECRETA)
                return verificar
            } catch (error) {
                console.log(error)
            }
        }
    }
});

//inicio el servidor (quité express por pedos con el deploy)
server.listen({port: process.env.PORT || 4000}).then(({ url }) => {
  console.log(`servidor listo ${url}`)
})
