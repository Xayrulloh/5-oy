import { UserInputError } from 'apollo-server-express'
import { NotFoundError } from '#helpers/errors'
import { USER_CONFIG } from '#config/index'
import model from './model.js'

export default {
    Mutation: {
        addUser: async (_, args) => {
            if (!args.username.trim() || !args.contact.trim()) {
                throw new UserInputError("The username and contact are required!")
            }

            const user = await model.addUser(args)
            
            return {
                status: 200,
                message: "The user created!",
                data: user
            }
        },

        changeUser: async (_, args) => {
            if (
                (args.username && !args.username.trim()) ||
                (args.contact && !args.contact.trim())
            ) {
                throw new UserInputError("The username or contact cannot be empty!")
            }

            const user = await model.changeUser(args)
            
            return {
                status: 200,
                message: "The user changed!",
                data: user
            }
        },

        deleteUser: async (_, args) => {
            const user = await model.deleteUser(args)

            if (!user) {
                throw new NotFoundError("The user not found!") 
            }
            
            return {
                status: 200,
                message: "The user deleted!",
                data: user
            }
        },
    },

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