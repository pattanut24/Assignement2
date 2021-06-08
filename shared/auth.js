const jwt = require('jsonwebtoken');

async function authenticateToken(req, res, next) {
    try{const authHeader = req.headers['cookie']
    const token = authHeader && authHeader.split('=')[1]
    if (token == null) return res.sendStatus(401)

    const user = await jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = user 
    next() 
    }catch(e){
        res.status(400).json({
            error : e.message
        })
    }
}

module.exports = { authenticateToken }