export default {
    Mutation: {
        addTodo: (_, { todoBody }, { model, userId }) => {
            const todos = model.read('todos')

            const todo = {
                todoId: todos.at(-1)?.todoId + 1 || 1,
                todoBody, userId
            }

            todos.push(todo)
            model.write('todos', todos)

            return {
                status: 200,
                message: "A new todo added!",
                data: todo
            }
        },

        changeTodo: (_, { todoId, todoBody }, { model, userId }) => {
            const todos = model.read('todos')

            const todo = todos.find(todo => todo.todoId == todoId && todo.userId == userId)

            if (!todo) {
                return {
                    status: 400,
                    message: "There is no such todo!"
                }
            }

            todo.todoBody = todoBody
            model.write('todos', todos)

            return {
                status: 200,
                message: "The todo updated!",
                data: todo
            }
        },

        deleteTodo: (_, { todoId }, { model, userId }) => {
            const todos = model.read('todos')

            const todoIndex = todos.findIndex(todo => todo.todoId == todoId && todo.userId == userId)

            if (todoIndex == -1) {
                return {
                    status: 400,
                    message: "There is no such todo!"
                }
            }

            const todo = todos.splice(todoIndex, 1)
            model.write('todos', todos)

            return {
                status: 200,
                message: "The todo deleted!",
                data: todo
            }
        },
    },

    Query: {
        todos: (_, __, { model, userId }) => {
            return model.read('todos').filter(todo => todo.userId == userId)
        }
    },

    Todo: {
        user: (global, _, { model }) => {
            return model.read('users').find(user => user.userId == global.userId)
        }
    }
}