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
    const [user] = await db(query.GET_FOOD, foodId)
    return user
}

export default {
    getFoods,
    getFood
}