import query from './sql.js'
import db from '#pg'

async function getFoods({ page, limit, search, sortKey, sortValue }) {
    return await db(
        query.GET_FOODS,
        (page - 1) * limit,
        limit,
        search,
        sortKey,
        sortValue
    )
}

async function getFood({ foodId }) {
    const [food] = await db(query.GET_FOOD, foodId)
    return food
}

async function addFood({ foodname, foodimg, foodprice }) {
    const [food] = await db(query.ADD_FOOD, foodname, foodimg, foodprice)
    return food
}

async function changeFood({ foodId, foodname, foodimg, foodprice }) {
    const [food] = await db(query.CHANGE_FOOD, foodId, foodname, foodimg, foodprice)
    return food
}

async function deleteFood({ foodId }) {
    const [food] = await db(query.DELETE_FOOD, foodId)
    return food
}

export default {
    getFoods,
    getFood,
    addFood,
    changeFood,
    deleteFood
}