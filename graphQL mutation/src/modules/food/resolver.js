export default {
    Query: {
        foods: (_, { foodId }, { read }) => {
            return read('foods').filter(food => foodId ? food.foodId == foodId : true)
        }
    },

    Mutation: {
        addFood: (_, { foodname, foodImg }, { read, write }) => {
            const foods = read('foods')

            const newFood = {
                foodId: +foods.at(-1).foodId + 1 || 1,
                foodname, foodImg
            }

            if (foods.find(food => food.foodname === foodname)) {
                return {
                    status: 201,
                    message: 'This foodname is already exist!',
                }
            }

            foods.push(newFood)
            write('foods', foods)

            return {
                status: 201,
                message: 'The food added!',
                data: newFood
            }
        },

        deleteFood: (_, { foodId }, { read, write }) => {
            let foods = read('foods')
            let orders = read('orders')

            const deletedFood = foods.filter(food => food.foodId == foodId)

            if (deletedFood.length) {
                foods = foods.filter(food => food.foodId != foodId)
                orders = orders.filter(order => order.foodId != foodId)

                write('foods', foods) 
                write('orders', orders) 

                return {
                    status: 201,
                    message: 'The food deleted!',
                    data: deletedFood[0]
                }
            }

            return {
                status: 201,
                message: 'The food not found!',
            }
        },

        editFood: (_, { foodId, foodname, foodImg }, {read, write}) => {
            let foods = read('foods')

            let editedFood = foods.find(food => food.foodId == foodId)

            if (editedFood) {
                editedFood.foodname = foodname, editedFood.foodImg = foodImg

                write('foods', foods)
                return {
                    status: 201,
                    message: 'The food edited!',
                    data: editedFood
                }
            }

            return {
                status: 201,
                message: 'The food not found!',
            }
        }
        
    }
}