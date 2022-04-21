import { GraphQLUpload } from 'graphql-upload'

export default {
    Upload: GraphQLUpload,
    AnyType: {
        __resolveType(obj) {
            if (obj.userId) return 'User'
            return null
        },
    }
}