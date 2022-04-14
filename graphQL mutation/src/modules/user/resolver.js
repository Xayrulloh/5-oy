export default {
    Query: {
        users: (_, { userId }, { read }) => {
            return read('users').filter(user => userId ? user.userId == userId : true)
        }
    },

    Mutation: {
        addUser: (_, { username, contact }, { read, write }) => {
            const users = read('users')

            const newUser = {
                userId: +users.at(-1).userId + 1 || 1,
                username, contact
            }

            users.push(newUser)
            write('users', users)

            return {
                status: 201,
                message: 'The user added!',
                data: newUser
            }
        },

        deleteUser: (_, { userId }, { read, write }) => {
            let users = read('users')
            let orders = read('orders')

            const deletedUser = users.filter(user => user.userId == userId)

            if (deletedUser.length) {
                users = users.filter(user => user.userId != userId)
                orders = orders.filter(order => order.userId != userId)

                write('users', users) 
                write('orders', orders) 

                return {
                    status: 201,
                    message: 'The user deleted!',
                    data: deletedUser[0]
                }
            }

            return {
                status: 201,
                message: 'The user not found!',
            }
        },

        editUser: (_, { userId, username, contact }, {read, write}) => {
            let users = read('users')

            let editedUser = users.find(user => user.userId == userId)

            if (editedUser) {
                editedUser.username = username, editedUser.contact = contact

                write('users', users)
                return {
                    status: 201,
                    message: 'The user edited!',
                    data: editedUser
                }
            }

            return {
                status: 201,
                message: 'The user not found!',
            }
        }
        
    }
}