import { UserInputError } from 'apollo-server-express'
import { USER_CONFIG } from '#config/index'
import model from './model.js'

export default {
    Query: {
        users: async (_, { pagination, search, sort }) => {
            const sortKey = Object.keys(sort || {})[0]

            return await model.getUsers({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
            })
        },

        user: async (_, args) => {
            return await model.getUser(args)
        }
    },

    User: {
        userId: global => global.user_id,
        username: global => global.user_name,
        contact: global => global.user_contact,
    }
}