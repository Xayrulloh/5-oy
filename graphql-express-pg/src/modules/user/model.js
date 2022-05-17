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

async function addUser({ username, contact }) {
    const [user] = await db(query.ADD_USER, username, contact)
    return user
}

async function changeUser({ userId, username, contact }) {
    const [user] = await db(query.CHANGE_USER, userId, username, contact)
    return user
}

async function deleteUser({ userId }) {
    const [user] = await db(query.DELETE_USER, userId)
    return user
}

export default {
    deleteUser,
    changeUser,
    getUsers,
    addUser,
    getUser
}