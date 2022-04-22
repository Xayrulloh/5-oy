import { GraphQLUpload } from 'graphql-upload'

export default {
    Upload: GraphQLUpload,
    AnyType: {
        __resolveType(obj) {
            if (obj.username) return 'User'
            if (obj.todoBody) return 'Todo'
            return null
        },
    }
}