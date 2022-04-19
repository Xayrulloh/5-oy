import { GraphQLScalarType, Kind } from 'graphql';
import path from 'path'
import fs from 'fs'
import JWT from 'jsonwebtoken'

// functions 
function sign(playload) {
    return JWT.sign(playload, secretKey)
}

function verify(token) {
    return JWT.verify(token, secretKey)
}

function read(fileName) {
    const data = fs.readFileSync(path.join(process.cwd(), 'database', fileName + '.json'), 'UTF-8')
    return JSON.parse(data) || []
}

function write(fileName, data) {
    fs.writeFileSync(path.join(process.cwd(), 'database', fileName + '.json'), JSON.stringify(data, null, 4))
}

// Scalars
function checkProductId(value) {
    const products = read('products')
    
    if (value <= products.at(-1).productId) return value
    throw new Error('This Id is not exist')
}

const ProductIdScalar = new GraphQLScalarType({
    name: 'ProductId',
    description: 'Cheking Id that exist in products',
    serialize: checkProductId,
    parseValue: checkProductId,
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return checkProductId(ast.value)
        }
        return null;
    }
})

function checkOrderId(value) {
    const orders = read('orders')
    
    if (value <= orders.at(-1).orderId) return value
    throw new Error('This Id is not exist')
}

const OrderIdScalar = new GraphQLScalarType({
    name: 'OrderId',
    description: 'Cheking Id that exist in orders',
    serialize: checkOrderId,
    parseValue: checkOrderId,
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return checkOrderId(ast.value)
        }
        return null;
    }
})

function checkCategoryId(value) {
    const categories = read('categories')
    
    if (value <= categories.at(-1).categoryId) return value
    throw new Error('This Id is not exist')
}

const CategoryIdScalar = new GraphQLScalarType({
    name: 'CategoryId',
    description: 'Cheking Id that exist in category',
    serialize: checkCategoryId,
    parseValue: checkCategoryId,
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return checkCategoryId(ast.value)
        }
        return null;
    }
})

function password(value) {
    const users = read('users')
    
    if (users.find(user => user.password === value) || value.length < 4) {
        throw new Error('This password is not required')
    }
    return value
}

const passwordScalar = new GraphQLScalarType({
    name: 'Password',
    description: 'Checking password that not exist in others',
    serialize: password,
    parseValue: password,
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return password(ast.value)
        }
        return null;
    }
})

function contact(value) {
    if (!/(?:[9]{2}[8][0-9]{2}[0-9]{3}[0-9]{2}[0-9]{2})/.test(value) || isNaN(+value)) {
        throw new Error('This contact is not required')
    }
    return value
}

const contactScalar = new GraphQLScalarType({
    name: 'Contact',
    description: 'Checking phone number',
    serialize: contact,
    parseValue: contact,
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return contact(ast.value)
        }
        return null;
    }
})

function email(value) {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
        throw new Error('This email is not required')
    }
    return value
}

const emailScalar = new GraphQLScalarType({
    name: 'Email',
    description: 'Checking phone number',
    serialize: email,
    parseValue: email,
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return email(ast.value)
        }
        return null;
    }
})

export { sign, verify, read, write, checkProductId, ProductIdScalar, checkOrderId, OrderIdScalar, checkCategoryId, CategoryIdScalar, password, passwordScalar, contact, contactScalar, email, emailScalar }