const createHttpError = require('http-errors');
const JWT = require('jsonwebtoken');
const { token } = require('morgan');
const { UserModel } = require('../models/users');
const fs = require('fs')
const { SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require('./constance');
const redisClient = require('./init_redis');
const path = require('path');
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
                const refreshToken = await redisClient.get(user?._id || 'default_key');
                if (!refreshToken) reject(createHttpError.Unauthorized('cant access to yore account'))
                if (token === refreshToken) return resolve(mobile);
                reject(createHttpError.Unauthorized('cant access to yore account'))
                
            })
        })
    }
function deleteFileInPublic (fileAddress){
    if(fileAddress){
    const pathFile = path.join(__dirname , '..' , '..' , 'public' , fileAddress)
    if(fs.existsSync(pathFile)) fs.unlinkSync(pathFile)
    }
    
} 
function listOfImagesFromRequest(files , fileUploadPath){
    if(files?.length > 0){
        return ((files.map(file => path.join(fileUploadPath , file.filename))).map(item => item.replace(/\\/g, '/')))
    }else{
        return []
    }

}
function setFeatures(){
    const {colors , width ,height , length , weight} = body;
    let features = {};
    features.colors = colors;
    if (
      !isNaN(+width) ||
      !isNaN(+height) ||
      !isNaN(+length) ||
      !isNaN(+weight)
    ) {
      if (!width) features.width = 0;
      else features.width = +width;
      if (!height) features.height = 0;
      else features.height = +height;
      if (!length) features.length = 0;
      else features.length = +length;
      if (!weight) features.weight = 0;
      else features.weight = +weight;
    }
        return features
}
function copyObject(object){
    return JSON.parse(JSON.stringify(object))
}
function deleteInvalidPropertyInObject(data = {} , blackListFields = []){
    let nullishData = ['',' ' ,'0',0,null,undefined]
    Object.keys(data).forEach(key => {
        if(blackListFields.includes(key)) delete data[key]
        if(typeof data[key] == 'string') data[key] = data[key].trim();
        if(Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].map(item => item.trim())
          if(Array.isArray(data[key]) && data[key].length == 0) delete data[key]
        if(nullishData.includes(data[key])) delete data[key];
    })
}


module.exports = {
    randomInt ,
    SignAccessToken ,
    SignRefreshToken ,
    verifyRefreshToken ,
    deleteFileInPublic ,
    listOfImagesFromRequest ,
    copyObject ,
    setFeatures ,
    deleteInvalidPropertyInObject
}