const createHttpError = require("http-errors");
const { UserModel } = require("../../models/users");
const {SECRET_KEY} = require('../../utils/constance')
const JWT = require('jsonwebtoken')
function getToken(headers){
    const [bearer , token]= headers?.authorization?.split(' ') || []
    if(token && ['Bearer' , 'bearer'].includes(bearer)) return token;
    throw createHttpError.Unauthorized('unauthorized user account for login')
}
function verifyAccessToken(req , res , next){
try {
    const token = getToken(req.headers)
       JWT.verify(token , SECRET_KEY ,async (err , payload) => {
        try {
            if(err) throw createHttpError.Unauthorized('try again to access yore account')
            const {mobile} = payload || {};
            const user = await UserModel.findOne({mobile} , {password : 0 , otp : 0})
            if(!user) throw createHttpError.Unauthorized('not found any account') 
            req.user = user
            return next()
        } catch (error) {
            next(error)
        }
        }) 
}   catch (error) {
        next(error)
}
}

module.exports = {
    verifyAccessToken 
}