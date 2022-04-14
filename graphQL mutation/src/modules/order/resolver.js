export default {
    Query: {
        orders: (_, { orderId }, { read }) => {
            const foods = read('foods')
            const users = read('users')
            const orders =  read('orders').filter(order => orderId ? order.orderId == orderId : true)
            const Orders = []
            
            for (let el of orders) {
                Orders.push({orderId: el.orderId, food: foods.find(food => food.foodId == el.foodId), user: users.find(user => user.userId == el.userId), count: el.count})
            }
            return Orders
        }
    },

    Mutation: {
        addOrder: (_, { foodId, userId, count }, { read, write }) => {
            const orders = read('orders')
            const foods = read('foods')
            const users = read('users')

            let newOrder = {
                orderId: +orders.at(-1).orderId + 1 || 1,
                foodId, userId, count
            }

            let checkFoodId = foods.find(food => food.foodId == foodId)
            let checkUserId = users.find(user => user.userId == userId)

            if (!checkFoodId || !checkUserId || count > 10) {
                return {
                    status: 201,
                    message: 'The invalid input!',
                }
            }
            orders.push(newOrder)
            write('orders', orders)

            newOrder = {
                orderId: +orders.at(-1).orderId,
                food: foods.find(food => food.foodId == foodId), 
                user: users.find(user => user.userId == userId),
                count
            }

            return {
                status: 201,
                message: 'The order added!',
                data: newOrder
            }
        },

        deleteOrder: (_, { orderId }, { read, write }) => {
            let orders = read('orders')
            const foods = read('foods')
            const users = read('users')

            let deletedOrder = orders.filter(order => order.orderId == orderId)

            if (deletedOrder.length) {


                orders = orders.filter(order => order.orderId != orderId)
                write('orders', orders) 

                deletedOrder = deletedOrder[0]

                deletedOrder = {
                    orderId: orderId,
                    food: foods.find(food => food.foodId == deletedOrder.foodId), 
                    user: users.find(user => user.userId == deletedOrder.userId),
                    count: deletedOrder.count
                }

                return {
                    status: 201,
                    message: 'The order deleted!',
                    data: deletedOrder
                }
            }

            return {
                status: 201,
                message: 'The order not found!',
            }
        },

        editOrder: (_, { orderId, foodId, userId, count }, {read, write}) => {
            let orders = read('orders')
            const foods = read('foods')
            const users = read('users')


            let editedOrder = orders.find(order => order.orderId == orderId)

            if (count > 10) {
                return {
                    status: 201,
                    message: 'The count of food must be less then 10',
                }
            }

            if (editedOrder) {
                editedOrder.foodId = foodId, editedOrder.userId = userId, editedOrder.count = count
                write('orders', orders)

                editedOrder = {
                    orderId: orderId,
                    food: foods.find(food => food.foodId == editedOrder.foodId), 
                    user: users.find(user => user.userId == editedOrder.userId),
                    count: editedOrder.count
                }

                return {
                    status: 201,
                    message: 'The order edited!',
                    data: editedOrder
                }
            }

            return {
                status: 201,
                message: 'The order not found!',
            }
        }
        
    }
}