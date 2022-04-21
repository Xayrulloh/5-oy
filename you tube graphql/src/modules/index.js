import { makeExecutableSchema } from '@graphql-tools/schema'

import TypeModule from './type/index.js'
import UserModule from './user/index.js'

export default makeExecutableSchema({
    typeDefs: [
        UserModule.typeDefs,
        TypeModule.typeDefs,
    ],
    resolvers: [
        UserModule.resolvers,
        TypeModule.resolvers,
    ],
})