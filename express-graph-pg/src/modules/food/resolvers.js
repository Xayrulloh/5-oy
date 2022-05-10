import { UserInputError } from 'apollo-server-express'
import { FOOD_CONFIG } from '#config/index'
import model from './model.js'

export default {
    Query: {
        foods: async (_, { pagination, search, sort }) => {
            const sortKey = Object.keys(sort || {})[0]

            return await model.getFoods({
                page: pagination?.page || FOOD_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || FOOD_CONFIG.PAGINATION.LIMIT,
                sortValue: sort ? sort[sortKey] : null,
                sortKey,
                search,
            })
        },

        food: async (_, args) => {
            return await model.getFood(args)
        }
    },

    Food: {
        foodId: global => global.food_id,
        foodname: global => global.food_name,
        foodImg: global => 'http://localhost:4000/' + global.food_img,
        foodPrice: global => global.food_price
    }
}