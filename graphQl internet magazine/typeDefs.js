import { gql } from 'apollo-server-express'

export default gql`
# 	Scalars
	scalar Password
	scalar Email
	scalar Contact
	scalar ProductId
	scalar OrderId
	scalar CategoryId

#   Queries
	type Query {
		# for all
		products(productId: ProductId list:Int page:Int): [Products!]!
		category(categoryId: CategoryId): [Categories!]!

		# authorized Users
		orders(token: String!, orderId: OrderId): [Orders]

		# admin
		paid(token: String!): Money!
		unpaid(token: String!): Money!
		mostSold(token: String!): MoneyInfo!
		leastSold(token: String!): MoneyInfo!
	}

# admin type
	type Money {
		money: Int!
	}

	type MoneyInfo {
		productId: ID!
		productname: String!
		count: Int!
		softMoney: Int!
		money: Int!
	}

# unauthorized users types
	type Products {
		productId: ID!
		categoryId: ID!
		categoryname: String!
		productname: String!
		price: Int!
		shortDesc: String!
		longDesc: String!
		picture: String!
	}

	type Categories {
		categoryId: ID!
		categoryname: String!
	}

# authorized users or admin Types
	type Orders {
		productId: ID!
		orderId: ID!
		userId: ID!
		username: String!
		productname: String!
		price: String!
		paid: Boolean!
		count: Int!
		date: String!
		longDesc: String!
		shortDesc: String!
		picture: String!
	}

#  Mutation
	type Mutation {
		# all users
		search(productname: String!): [Products!]

		register(username: String! contact: Contact! email: Email! password: Password!): registerResponse!
		
		login(username: String! password: String!): registerResponse!

		# authorized users Mutations
		addOrder(token: String! productId: ProductId! count: Int!): orderResponse!

		editOrder(token: String! orderId: OrderId! productId: ProductId! count: Int!): orderResponse!

		deleteOrder(token: String! orderId: OrderId!): orderResponse!
		
		payOrder(token: String! orderId: OrderId!): orderResponse!

		# admin
		addCategory(token: String! categoryname: String!): categoryResponse!

		editCategory(token: String! categoryId: CategoryId! categoryname: String!): categoryResponse!

		deleteCategory(token: String! categoryId: CategoryId!): categoryResponse!

		addProduct(token: String! productname: String! categoryId: CategoryId! price: Int! shortDesc: String! longDesc: String! picture: String!): productResponse!

		editProduct(token: String! productId: ProductId! productname: String! categoryId: CategoryId! price: Int! shortDesc: String! longDesc: String! picture: String!): productResponse!
		
		deleteProduct(token: String! productId: ProductId!): productResponse!

	}

# Authorized users Type
	type orderResponse {
		status: Int!
    	message: String!
		userId: ID! 
		productId: ID! 
		orderId: ID! 
		username: String! 
		productname: String!
		price: Int! 
		count: Int! 
		paid: Boolean!
	}

# Unauthorized User Type
	type registerResponse {
    	status: Int!
    	message: String!
    	data: User
	}

	type User {
		username: String!
		password: String!
		contact: Contact!
		email: Email!
		token: String!
	}

	# admin Types
	type categoryResponse {
		categoryId: ID!
		categoryname: String!
		message: String!
	}

	type productResponse {
		message: String!
		productId: ID!
		categoryId: ID!
		categoryname: String!
		productname: String!
		price: Int!
		shortDesc: String!
		longDesc: String!
		picture: String!
	}

`