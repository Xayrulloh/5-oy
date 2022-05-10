import { makeExecutableSchema } from '@graphql-tools/schema'

import TypesModule from './types/index.js'
import UserModule from './user/index.js'
import FoodModule from './food/index.js'

export default makeExecutableSchema({
    typeDefs: [
        TypesModule.typeDefs,
        UserModule.typeDefs,
        FoodModule.typeDefs
    ],
    resolvers: [
        TypesModule.resolvers,
        UserModule.resolvers,
        FoodModule.resolvers
    ]
})