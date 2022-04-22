import queryParser from './utils/queryParser.js'
import model from './utils/model.js'
import host from './utils/getHost.js'
import JWT from './utils/jwt.js'

export default ({ req, res }) => {
    try {
        const { operation, fieldName, variables } = queryParser(req.body)
        const reqAgent = req.headers['user-agent']
        const TOKEN = req.headers.token

        if (fieldName === '__schema') return
        
        if ([
            'login',
            'register'
        ].includes(fieldName)) {
            return {
                model,
                agent: reqAgent
            }
        }

        const { userId, agent } = JWT.verify(TOKEN)

        if (agent !== reqAgent) {
            throw new Error("Invalid token!")
        }

        return {
            host: `http://${host({ internal: false })}:${process.env.PORT}/`,
            userId,
            model,
        }

    } catch (error) {
        throw error
    }

}