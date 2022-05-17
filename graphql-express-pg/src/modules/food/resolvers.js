import { UserInputError } from 'apollo-server-express'
import { NotFoundError } from '#helpers/errors'
import { FOOD_CONFIG } from '#config/index'
import model from './model.js'

export default {
    Mutation: {
        addFood: async (_, args) => {
            if (!args.foodname.trim() || !args.foodimg.trim() || !args.foodprice.trim()) {
                throw new UserInputError("The foodname and foodimg are required!")
            }

            const food = await model.addFood(args)
            
            return {
                status: 200,
                message: "The food added!",
                data: food
            }
        },

        changeFood: async (_, args) => {
            if (
                (args.foodname && !args.foodname.trim()) ||
                (args.price && !args.price.trim())
            ) {
                throw new UserInputError("The foodname or price cannot be empty!")
            }

            const food = await model.changeFood(args)
            
            return {
                status: 200,
                message: "The food changed!",
                data: food
            }
        },

        deleteFood: async (_, args) => {
            const food = await model.deleteFood(args)

            if (!food) {
                throw new NotFoundError("The food not found!") 
            }
            
            return {
                status: 200,
                message: "The food deleted!",
                data: food
            }
        },
    },

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
        foodimg: global => global.food_img,
        foodprice: global => global.food_price,
    }
}