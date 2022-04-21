import JWT from '../../utils/jwt.js'
import md5 from 'md5'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { finished } from 'stream/promises'

export default {
    Mutation: {
        login: (_, { username, password }, { model }) => {
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
                token: JWT.sign({ userId: user.userId }),
                data: user
            }
        },
        register:async (_, {input},{model}) => {
            const users = model.read('users')
            input.username = input.username.toLowerCase().trim()
            input.password = md5(input.password)
            const user = users.find(user => user.username == input.username)
            if(user){
                return {
                    status: 400,
                    message: 'The user already exists!',
                    data: null
                }
            }
            const { createReadStream, filename, mimetype } = await input.profileImg;

            if(mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/jpg'){
                return {
                    status: 400,
                    message: 'The profile image must be a jpeg or png!',
                    data: null
                }
            }

            const stream = createReadStream();
            const out = createWriteStream(join(process.cwd(), 'uploads', filename));
            stream.pipe(out);
            await finished(out);
            const userId = users.at(-1).userId + 1 || 1
            const newUser = {
                userId,
                username: input.username,
                password: input.password,
                profileImg: filename
            }
            users.push(newUser)
            model.write('users', users)
            return {
                status: 200,
                message: 'The user successfully registered!',
                token: JWT.sign({ userId: userId }),
                data: newUser
            }
        }
    },

    Query: {
        users: (_, __, { model }) => {
            return model.read('users')
        }
    },

    User: {
        userImg: (global, __, { host }) => host + global.profileImg
    }
}