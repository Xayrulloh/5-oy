import { ApolloServer } from 'apollo-server-express'
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import express from 'express'
import http from 'http'
import path from 'path'
import './config.js'

import renderMiddleware from './middlewares/render.js'
import controllers from './controllers/controller.js'
import schema from './modules/index.js'
import context from './context.js'

async function startApolloServer() {
    const app = express()
    const httpServer = http.createServer(app)

    app.use(express.static(path.join(process.cwd(), 'src', 'public')))
    app.use(express.static(path.join(process.cwd(), 'uploads')))
    app.use(renderMiddleware(app))
    app.use(controllers)

    const server = new ApolloServer({
        schema,
        context,
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground()
        ],
    })

    await server.start()
    server.applyMiddleware({ app })
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve))
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
}

startApolloServer()