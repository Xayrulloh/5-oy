import { finished } from 'stream/promises'
import JWT from '../../utils/jwt.js'
import path from 'path'
import md5 from 'md5'
import fs from 'fs'


export default {
    Mutation: {
        login: (_, { username, password }, { model, agent }) => {
            const users = model.read('users')

            const user = users.find(user => user.username == username && user.password == md5(password))

            if (!user) {
                return {
                    status: 400,
                    message: 'Wrong username or password!',
                    data: null
                }
            }

            return {
                status: 200,
                message: 'The user successfully logged in!',
                token: JWT.sign({ userId: user.userId, agent }),
                data: user
            }
        },

        register: async (_, { username, password, file }, { model, agent }) => {
            const { createReadStream, filename, mimetype } = await file

            username = username.trim()
            password = password.trim() 

            const users = model.read('users')

            if (users.find(user => user.username === username)) {
                return {
                    status: 400,
                    message: 'The user already exists!'
                }
            }

            if (!['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)) {
                return {
                    status: 400,
                    message: 'Invalid mime type for user image!'
                }    
            }

            const fileName = Date.now() + filename.replace(/\s/g, '')
            const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', fileName))
            createReadStream().pipe(out)
            await finished(out)

            const user = {
                userId: users.length ? users.at(-1).userId + 1 : 1,
                password: md5(password),
                userImg: fileName,
                username,
            }

            users.push(user)
            model.write('users', users)

            return {
                status: 200,
                message: 'The user successfully registered!',
                token: JWT.sign({ userId: user.userId, agent }),
                data: user
            }
        },
    },

    Query: {
        users: (_, __, { model }) => {
            return model.read('users')
        }
    },

    User: {
        userImg: (global, __, { host }) => host + global.userImg
    }
}