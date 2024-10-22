const createHttpError = require("http-errors");
const { UserModel } = require("../../models/users");
const {SECRET_KEY} = require('../../utils/constance')
const JWT = require('jsonwebtoken')
function getToken(headers){
    const [bearer , token]= headers?.['access-token']?.split(' ') || []
    if(token && ['Bearer' , 'bearer'].includes(bearer)) return token
}
function verifyAccessToken(req , res , next){
try {
    const headers = req.headers;
    const [bearer , token]= headers?.['access-token']?.split(' ') || []
    if(token && ['Bearer' , 'bearer'].includes(bearer)){
       JWT.verify(token , SECRET_KEY ,async (err , payload) => {
            if(err) return next(createHttpError.Unauthorized('try again to access yore account'))
            const {mobile} = payload || {};
            const user = await UserModel.findOne({mobile} , {password : 0 , otp : 0})
            if(!user) return next(createHttpError.Unauthorized('not found any account')) 
            req.user = user
            return next()
        })
    }
    else throw createHttpError.Unauthorized('try again to access yore account')
} catch (error) {
    next(error)
}
}
function checkRole(role){

}
module.exports = {
    verifyAccessToken
}