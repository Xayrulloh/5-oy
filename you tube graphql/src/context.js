import model from './utils/model.js'
import host from './utils/getHost.js'

export default ({ req, res }) => {
    
    return {
        host: `http://${host({ internal: false })}:${process.env.PORT}/`,
        model
    }
}