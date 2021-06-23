const http = require('http');
const { ApolloServer } = require('apollo-server-express');
require("dotenv").config({path: 'variables.env'});
const typeDefs = require('./schema');
//const server = new ApolloServer({ typeDefs ,mocks:true});
const express = require('express');
const mongose = require('mongoose');
const graphqlHTTP= require('express-graphql')
const typeDef = require('../src/schema'); //el schema
const resolvers = require('./resolvers/resolver');
//https://buddy.works/tutorials/how-to-connect-mongodb-to-graphql-server
//usuario: hector    password: contraseña

const app = express()
const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
        endpoint: 'http://localhost:3000/graphql'
    }
});
server.applyMiddleware({ app });
  
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

mongose//No deja conectar por la "ñ" en contraseña
  .connect(process.env.DB_MONGOO
  , { useNewUrlParser: true, useUnifiedTopology: true })
  .then( () => {
    app.listen({ port: 3000 }, () => {
      console.log('Your Apollo Server is running on port 3000')
    })
  }, (err) => {
    console.log(err);
});

