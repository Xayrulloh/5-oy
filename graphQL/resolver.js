import { users, foods, orders } from './data.js'

export const resolvers = {
    Query: {
        users: () => users,
        orders: () => orders,
        foods: () => foods
    },

    User: {
        userId:     parent => parent.user_id,
    },

    Food: {
        foodId:     parent => parent.food_id,
        foodName:   parent => parent.food_name,
        foodImg:    parent => parent.food_img,
    },

    Order: {
        orderId:   parent => parent.order_id,
        food:      parent => foods.find(food => parent.food_id == food.food_id),
        user:      parent => users.find(user => parent.user_id == user.user_id)
    },
}