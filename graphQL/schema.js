import { gql } from 'apollo-server'

export const schema = gql`
    type Query {
        users: [User!]!
        foods: [Food!]!
        orders: [Order!]!
    }

    type User {
        userId: ID!
        username: String!
        contact: String!
    }

    type Food {
        foodId: ID!
        foodName: String!
        foodImg: String!
    }

    type Order {
        orderId: ID!
        user: User!
        food: Food!
        count: Int!
    }
`
