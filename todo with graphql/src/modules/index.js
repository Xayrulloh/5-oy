import { makeExecutableSchema } from '@graphql-tools/schema'

import TypeModule from './type/index.js'
import UserModule from './user/index.js'
import TodoModule from './todo/index.js'

export default makeExecutableSchema({
    typeDefs: [
        UserModule.typeDefs,
        TypeModule.typeDefs,
        TodoModule.typeDefs,
    ],
    resolvers: [
        UserModule.resolvers,
        TypeModule.resolvers,
        TodoModule.resolvers,
    ],
})