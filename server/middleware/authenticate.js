const User = require('../model/User');
const { verify } = require('jsonwebtoken');
const { privatekey } = process.env;

//Middleware to authenticate the user
module.exports =  async (req, res, next) => {
    try {
        token = req.headers.authorization
        if(!token) return res.status(400).json({'message' : 'token needed'})
        const isVerified = await verify(token, privatekey)
            const user = await User.findOne({_id: isVerified.id})
            req.user = user
        if(!isVerified) return res.status(400).json({'message' : 'invalid credentials'})
       next()
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server Error"})
    }
}