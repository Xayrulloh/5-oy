export default {
    SortOptions: {
        toLargest: 2,
        toSmallest: 1
    },

    GlobalType: {
        __resolveType: object => {
            if (object.user_name) return 'User'
            if (object.food_name) return 'Food'
            return null
        }
    }
}