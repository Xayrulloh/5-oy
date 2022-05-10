import query from './sql.js'
import db from '#pg'

async function getUsers({ page, limit, search, sortKey, sortValue }) {
    return await db(
        query.GET_USERS,
        (page - 1) * limit,
        limit,
        search,
        sortKey,
        sortValue
    )
}

async function getUser({ userId }) {
    const [user] = await db(query.GET_USER, userId)
    return user
}

export default {
    getUsers,
    getUser
}