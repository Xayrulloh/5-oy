import moment from 'moment'
import { sign, verify, read, write, checkProductId, ProductIdScalar, checkOrderId, OrderIdScalar, checkCategoryId, CategoryIdScalar, password, passwordScalar, contact, contactScalar, email, emailScalar } from './utils/utils.js'

const secretKey = 'password', adminId = read('users').find(user => user.role === 'admin').userId

export default {
  Password: passwordScalar,
  Contact: contactScalar,
  Email: emailScalar,
  ProductId: ProductIdScalar,
  OrderId: OrderIdScalar,
  CategoryId: CategoryIdScalar,

  Query: {
    products: (_, { productId, page = 1, list = 10 }) => {
      let products = read('products').filter(product => productId ? product.productId == productId : true), categories = read('categories')

      for (let product of products) {
        product.categoryname = categories.find(c => c.categoryId == product.categoryId).categoryname
      }

      return products.slice(page * list - list, page * list)
    },

    category: (_, { categoryId }) => {
      return read('categories').filter(category => categoryId ? category.categoryId == categoryId : true)
    },

    // authorized user query
    orders: (_, { token, orderId }) => {
      try {
        const userId = verify(token), orders = read('orders'), products = read('products'), users = read('users'), outputOrders = []
        let userOrders = null


        if (users.find(user => user.userId == userId).role == 'admin') {
          for (let order of orders) {
            let product = products.find(product => product.productId == order.productId);
            let user = users.find(user => user.userId == userId)
            outputOrders.push({userId:userId, username: user.username, productId: order.productId, orderId: order.orderId, productname: product.productname, count:order.count,  price: product.price * order.count, paid: order.isPaid, date:order.date, longDesc: product.longDesc, shortDesc: product.shortDesc, picture: product.picture})
          }
          
          if (orderId) {
            return outputOrders.filter(order => order.orderId == orderId)
          }

          return outputOrders
        }

        for (let order of orders) {
          if (order.userId == userId) {
            let product = products.find(product => product.productId == order.productId);
            let user = users.find(user => user.userId == userId)
            outputOrders.push({userId:userId, username: user.username, productId: order.productId, orderId: order.orderId, productname: product.productname, count:order.count,  price: product.price * order.count, paid: order.isPaid, date:order.date, longDesc: product.longDesc, shortDesc: product.shortDesc, picture: product.picture})
          }
        }
        
        if (orderId) {
          return outputOrders.filter(order => order.orderId == orderId)
        }

        return outputOrders

      } catch (error) {
        return new Error('Invalid token')
      }
    },

    // admin query 
    paid: (_, { token }) => {
      try {
        const userId = verify(token), users = read('users'), orders = read('orders'), products = read('products')
        
        if (users.find(user => user.userId == userId).role == 'admin') {
          let money = 0

          for (let order of orders) {
            if (order.isPaid) {
                money += products.find(product => product.productId == order.productId).price * order.count
            }
          }

          return {money}
        } 

        return new Error('You are not Admin. You can\'t hack me understand')
        
      } catch (error) {
        return new Error('Invalid token')
      }
    },

    unpaid: (_, { token }) => {
      try {
        const userId = verify(token), users = read('users'), orders = read('orders'), products = read('products')
        
        if (users.find(user => user.userId == userId).role == 'admin') {
          let money = 0

          for (let order of orders) {
            if (!order.isPaid) {
                money += products.find(product => product.productId == order.productId).price * order.count
            }
          }

          return {money}
        } 

        return new Error('You are not Admin. You can\'t hack me understand')
        
      } catch (error) {
        return new Error('Invalid token')
      }
    },

    mostSold: (_, { token }) => {
      try {
        const userId = verify(token), users = read('users'), orders = read('orders'), products = read('products'), info = {}
        
        if (users.find(user => user.userId == userId).role == 'admin') {
          let productId = 0, count = 0

          for (let order of orders) {
            if (order.isPaid) {
              info[order.productId] ? info[order.productId] += order.count : info[order.productId] = order.count
            }
          }
          
          for (let key in info) {
            if (info[key] > count) {
              productId = key, count = info[key]
            }
          }

          let product = products.find(product => product.productId == productId)
          let mostSold = { productId, productname: product.productname, softMoney: product.price, money: product.price * count, count}
          
          return mostSold
        } 

        return new Error('You are not Admin. You can\'t hack me understand')
        
      } catch (error) {
        return new Error('Invalid token')
      }
    },

    leastSold: (_, { token }) => {
      try {
        const userId = verify(token), users = read('users'), orders = read('orders'), products = read('products'), info = {}
        
        if (users.find(user => user.userId == userId).role == 'admin') {
          let productId = orders[0].productId, count = orders[0].count

          for (let order of orders) {
            if (order.isPaid) {
              info[order.productId] ? info[order.productId] += order.count : info[order.productId] = order.count
            }
          }

          
          for (let key in info) {
            if (info[key] < count) {
              productId = key, count = info[key]
            }
          }

          let product = products.find(product => product.productId == productId)
          let leastSold = { productId, productname: product.productname, softMoney: product.price, money: product.price * count, count}
          
          return leastSold
        } 

        return new Error('You are not Admin. You can\'t hack me understand')
        
      } catch (error) {
        return new Error('Invalid token')
      }
    },
  },

  Mutation: {
    search: (_, { productname }) => {
      let products = read('products'), categories = read('categories')

      for (let product of products) {
        product.categoryname = categories.find(c => c.categoryId == product.categoryId).categoryname
      }

      products = products.filter(product => product.productname.toLowerCase().includes(productname.toLowerCase()))

      return products
    },

    register: (_, { username, contact, email, password }) => {
      const users = read('users')

      const newUser = {
          userId: +users.at(-1).userId + 1 || 1,
          username, password, contact, email, role:"user"
      }

      users.push(newUser)
      write('users', users)

      const User = {username, password, contact, email, token: sign(newUser.userId)}

      return {
          status: 201,
          message: 'The user added!',
          data: User
      }
    },

    login: (_, { username, password }) => {
      const users = read('users')
      const existUser = users.find(user => user.username.toLowerCase() == username.toLowerCase() && user.password == password)

      if (existUser) {
        const User = {username, password: existUser.password, contact: existUser.contact, email: existUser.email, token: sign(existUser.userId)}
  
        return {
            status: 201,
            message: 'The user logged in!',
            data: User
        }
      }

      return {
        status: 201,
        message: 'The user not found!',
    }
    },

    // Authorized user mutation

    addOrder: (_, { token, productId, count }) => {
      try {
        const userId = verify(token), users = read('users'), products = read('products'), product = products.find(product => product.productId == productId), orders = read('orders'), user = users.find(user => user.userId == userId)
        
        if (userId != adminId) {
          orders.push({ userId: +userId, orderId:orders.at(-1).orderId + 1 || 1, productId: +productId, isPaid: false, count, date: moment().format().slice(0, 10) })
          write('orders', orders)
  
          return { status: 200, message: "Order added successfully", orderId: orders.at(-1).orderId, username: user.username,  userId, productId,  productname: product.productname, price: product.price * count, count,  paid: false }
        }

        return new Error('You can\'t add order')

      } catch (error) {
        return new Error('Invalid token')
      }
    },

    editOrder: (_, { token, orderId, productId, count }) => {
      try {
        const userId = verify(token), users = read('users'), products = read('products'), product = products.find(product => product.productId == productId), orders = read('orders'), order = orders.find(order => order.orderId == orderId), user = users.find(user => user.userId == userId)
        
        if (order.userId == userId && userId != adminId) {
          order.productId = +productId, order.count = count 
          write('orders', orders)

          return { status: 200, message: "Order edited successfully", orderId, username: user.username,  userId, productId,  productname: product.productname, price: product.price * count, count,  paid: false }
        }

        return new Error('You didn\'t order this item or you can\'t')

      } catch (error) {
        return new Error('Invalid token')
      }
    },

    deleteOrder: (_, { token, orderId }) => {
      try {
        const userId = verify(token), users = read('users'), orders = read('orders'), products = read('products'), order = orders.find(order => order.orderId == orderId), user = users.find(user => user.userId == userId)
        
        if (order.userId == userId && !order.isPaid && userId != adminId) {
          const ordersCopy = orders.filter(order => order.orderId != orderId), product = products.find(product => product.productId == order.productId)

          write('orders', ordersCopy)

          return { status: 200, message: "Order deleted successfully", orderId: +orderId, username: user.username,  userId, productId: order.productId,  productname: product.productname, price: product.price * order.count, count: order.count,  paid: false }
        }

        return new Error('You can\'t delete this order')

      } catch (error) {
        return new Error('Invalid token')
      }
    },

    payOrder: (_, { token, orderId }) => {
      try {
        const userId = verify(token), users = read('users'), orders = read('orders'), products = read('products'), order = orders.find(order => order.orderId == orderId), user = users.find(user => user.userId == userId)
        
        if (order.userId == userId && !order.isPaid  && userId != adminId) {
          const product = products.find(product => product.productId == order.productId)

          order.isPaid = true;
          write('orders', orders)

          return { status: 200, message: "payed successfully", orderId: +orderId, username: user.username,  userId, productId: order.productId,  productname: product.productname, price: product.price * order.count, count: order.count,  paid: true }
        }

        return new Error('You can\'t pay for this order')

      } catch (error) {
        return new Error('Invalid token')
      }
    },

    // Admin mutation
    addCategory: (_, { token, categoryname }) => {
      try {
        const userId = verify(token), categories = read('categories')

        if (userId == adminId && !categories.find(category => category.categoryname.toLowerCase() == categoryname.toLowerCase())) {
          const newCategory = { "categoryId":categories.at(-1).categoryId + 1 || 1, "categoryname":categoryname }

          categories.push(newCategory)
          write('categories', categories)

          newCategory.message = "added succesfully"

          return newCategory
        }

        return new Error('You are not Admin. You can\'t hack me understand')

      } catch (error) {
        return new Error('Invalid token')
      }
    },

    editCategory: (_, { token, categoryId, categoryname }) => {
      try {
        const userId = verify(token), categories = read('categories')

        if (userId == adminId) {
          const categor = categories.find(c => c.categoryId == categoryId)

          categor.categoryname = categoryname
          write('categories', categories)

          categor.message = "edited succesfully"
          return categor
        }

        return new Error('You are not Admin. You can\'t hack me understand')

      } catch (error) {
        return new Error('Invalid token')
      }
    },

    deleteCategory: (_, { token, categoryId }) => {
      try {
        let userId = verify(token), categories = read('categories'), products = read('products')

        if (userId == adminId) {
          const categor = categories.find(c => c.categoryId == categoryId)

          const canIDelete = products.find(p => p.categoryId == categoryId)

          if (!canIDelete) {
            categories = categories.filter(c => c.categoryId != categoryId)
  
            write('categories', categories)
  
            categor.message = "deleted succesfully"
            return categor
          } else {
            return {categoryId:'', categoryname:'', message:'You can\'t delete this category because its still in use'}
          }

        }

        return {categoryId:'', categoryname:'', message:'You are not Admin. You can\'t hack me understand'}

      } catch (error) {
        return new Error('Invalid token')
      }
    },

    addProduct: (_, { token, productname, categoryId, price, shortDesc, longDesc, picture }) => {
      try {
        const userId = verify(token), categories = read('categories'), products = read('products')

        if (userId == adminId) {
          const newProduct = { productId:products.at(-1).productId || 1, categoryId: +categoryId, productname, price, shortDesc, longDesc, picture }

          if (products.find(product => JSON.stringify(product) == JSON.stringify(newProduct))) return new Error('This product has already been added')
          
          newProduct.productId = products.at(-1).productId + 1 || 1
          products.push(newProduct)
          write('products', products)

          newProduct.message = 'Product added successfully', newProduct.categoryname = categories.find(c => c.categoryId == categoryId).categoryname

          return newProduct
        }

        return new Error('You are not Admin. You can\'t hack me understand')

      } catch (error) {
        return new Error('Invalid token')
      }
    }, 

    editProduct: (_, { token, productId, productname, categoryId, price, shortDesc, longDesc, picture }) => {
      try {
        const userId = verify(token), categories = read('categories'), products = read('products')

        if (userId == adminId) {
          const newProduct = products.find(product => product.productId == productId)
          newProduct.categories = categoryId, newProduct.productname = productname, newProduct.price = price, newProduct.shortDesc = shortDesc, newProduct.longDesc = longDesc, newProduct.picture = picture

          write('products', products)

          newProduct.message = 'Product edited successfully', newProduct.categoryname = categories.find(c => c.categoryId == categoryId).categoryname

          return newProduct
        }

        return new Error('You are not Admin. You can\'t hack me understand')

      } catch (error) {
        return new Error('Invalid token')
      }
    }, 

    deleteProduct: (_, { token, productId }) => {
      try {
        let userId = verify(token), categories = read('categories'), products = read('products'), orders = read('orders')

        if (userId == adminId) {
          const deletingProduct = products.find(product => product.productId == productId), canIDelete = orders.find(order => order.productId == productId)

          if (!canIDelete) {
            products = products.filter(product => product.productId != productId)

            write('products', products)

            deletingProduct.message = 'Product deleted successfully', deletingProduct.categoryname = categories.find(c => c.categoryId == deletingProduct.categoryId).categoryname
            
            return deletingProduct
          }

          return new Error('You can\'t delete this product because its still in use')

          // newProduct.message = 'Product edited successfully', newProduct.categoryname = categories.find(c => c.categoryId == categoryId).categoryname

          // return newProduct
        }

        return new Error('You are not Admin. You can\'t hack me understand')

      } catch (error) {
        return new Error('Invalid token')
      }
    }, 
  }
}