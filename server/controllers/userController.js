const User = require("../model/User");
const Course = require("../model/Courses");
const Video = require("../model/Video");
const AmountPay = require("../model/AmountPay");
const {createToken} = require('../utils/createToken')

module.exports = {
    signUp : async ( req, res )=>{
        try {
            const newUser = await User.create({...req.body})
            const token = createToken(newUser)
            if(!token) return res.status(404).json({ "message" : "server error" })
            else{
                newUser.accessToken = token
                await newUser.save()
                return res.status(201).json({
                    "message" : "user saved",
                    token : token,
                    data : newUser
                })
            }  
        } catch (error) {
            error.name == 'MongoError'
            ? res.status(401).json({message : 'this mail is already registered'})
            : res.status(404).json({code : error.code, message : error.message })
        }
    },
    signIn : async (req, res)=>{
        try {
            const {email, password} = req.body

            if(!email || !password) return res.status(400).json({statusCode:400, message: 'Invalid Credentials'});
            const user = await User.findByEmailAndPassword(email, password);

            if(!user) return res.status(400).send('inavlid credentials')
            const token = createToken(user)
            if(!token) return res.status(404).json({ "message" : "server error" })
            else{
                user.accessToken = token
                await user.save()
                return res.status(200).json({
                    message : "logged in successfully",
                    data : user,
                    token : token,
                })
            }        
        } catch (error) {
            console.log(error.message)
            res.status(404).json({'error' : 'server error'})
        }
    },
    signOut: async (req, res)=>{
        try {
            const token = req.headers.authorization 
            const foundUser = await User.findOneAndUpdate({ accessToken: token }, { accessToken : null })
            if(!foundUser) return res.status(400).json({'message' : 'invalid credentials'})
            return res.json({'message' : 'loggedOut successfully'})
        } catch (error) {
            console.log(error.message)
            res.status(404).json({'error' : 'server error'})
        }
    }
}