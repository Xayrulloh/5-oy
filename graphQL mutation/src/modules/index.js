import { makeExecutableSchema } from '@graphql-tools/schema'

import userModule from './user/index.js'
import foodModule from './food/index.js'
import orderModule from './order/index.js'

export const schema = makeExecutableSchema({
    typeDefs: [
        userModule.typeDefs,
        orderModule.typeDefs,
        foodModule.typeDefs
    ],
    resolvers: [
        userModule.resolvers,
        orderModule.resolvers,
        foodModule.resolvers
    ]
})