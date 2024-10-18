const createHttpError = require('http-errors');
const JWT = require('jsonwebtoken');
const { token } = require('morgan');
const { UserModel } = require('../models/users');
const { SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require('./constance');
const redisClient = require('./init_redis')
function randomInt(){
    return Math.floor((Math.random() * 90000) + 10000)
}
function SignAccessToken(userId){
    return new Promise(async(resolve , reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile
        };
        const options = {
            expireIn : '1h'
        };
        JWT.sign(payload , SECRET_KEY , options ,(err,token) => {
            if (err) (createHttpError.InternalServerError('Internal Server Error'));
            resolve(token)
        })
    })
}
function SignRefreshToken(userId){
    return new Promise(async(resolve , reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile : user.mobile
        };
        const options = {
            expireIn : '1y'
        };
        JWT.sign(payload , REFRESH_TOKEN_SECRET_KEY , options , async(err,token) => {
            if (err) (createHttpError.InternalServerError('Internal Server Error'));
            await redisClient.setEx(userId , (365*24*60*60) , token) 
            resolve(token)
        })
    })
}
function verifyRefreshToken(token){
        return new Promise((resolve , reject) => {
            JWT.verify(token , REFRESH_TOKEN_SECRET_KEY ,async (err , payload) => {
                if(err) reject(createHttpError.Unauthorized('try again to access yore account'))
                const {mobile} = payload || {};
                const user = await UserModel.findOne({mobile} , {password : 0 , otp : 0})
                if(!user) reject(createHttpError.Unauthorized('not found any account'))
                const refreshToken = await redisClient.get(user._id);
                if (token === refreshToken) return resolve(mobile);
                reject(createHttpError.Unauthorized('cant access to yore account'))
                
            })
        })
    }
    

module.exports = {
    randomInt ,
    SignAccessToken ,
    SignRefreshToken ,
    verifyRefreshToken
}