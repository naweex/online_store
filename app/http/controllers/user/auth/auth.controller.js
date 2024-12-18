const createHttpError = require("http-errors")
const {  getOtpSchema , checkOtpSchema } = require("../../../validators/user/auth.schema")
const { randomInt, SignAccessToken, verifyRefreshToken, SignRefreshToken } = require("../../../../utils/functions")
const Controller = require('../../controller')
const { UserModel } = require("../../../../models/users")
const { ROLES } = require("../../../../utils/constance")
const {StatusCodes : HttpStatus} = require('http-status-codes')
class UserAuthController extends Controller {
    async getOtp(req , res , next){
        try {
            await getOtpSchema.validateAsync(req.body)
            const {mobile} = req.body;
            const code = randomInt()
            const result = await this.saveUser(mobile , code)
            if(!result) throw new createHttpError.Unauthorized('code not send , please try again')
            return res.status(HttpStatus.OK).send({
            statusCode : HttpStatus.OK ,
             data: { 
                message : 'code sent to you successfully' ,
                code ,
                mobile
             }
        });
        } catch (error) {
            next(error)
            
        }
    }
    async checkOtp(req , res , next){
      try {
        await checkOtpSchema.validateAsync(req.body)  
        const {mobile , code} = req.body;
        const user = await UserModel.findOne({mobile})
        if(!user) throw createHttpError.NotFound('user not found')
        if (user.otp.code != code) throw createHttpError.Unauthorized('code is not acceptable')
        const now = Date.now()
        if(+user.otp.expiresIn < now) throw createHttpError.Unauthorized('yore code are expire')
        const accessToken = await SignAccessToken(user._id) 
        const refreshToken = await SignRefreshToken(user._id)
        return res.status(HttpStatus.OK).json({
            statusCode : HttpStatus.OK ,
            data :{
                accessToken ,
                refreshToken
            }
    })
        } catch (error) {
            next(error)
            
        }
    }
    async refreshToken(req , res , next){
        try {
            const {refreshToken} = req.body;
            const mobile = await verifyRefreshToken(refreshToken)
            const user = await UserModel.findOne({mobile})
            const accessToken = await SignAccessToken(user._id)
            const newRefreshToken = await SignRefreshToken(user._id)
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    accessToken ,
                    refreshToken : newRefreshToken
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async saveUser(mobile , code){
        let otp = {
            code,
            expiresIn : (new Date().getTime() + 120000) ,
        }
    const result = await this.checkExistUser(mobile)
    if(result){
        return (await this.updateUser(mobile , {otp}))
    }
    return !!(await UserModel.create({
        mobile ,
        otp ,
        role : ROLES.USER
    }))
    
    }
    async checkExistUser(mobile){
    const user = this.UserModel.findOne({mobile})
    return !!user
    }
    async updateUser(mobile , objectData = {}){
    Object.keys(objectData).forEach(key => {
        if(['',' ' ,0,null,undefined,'0',NaN].includes(objectData[key])) delete objectData[key]
    })
    const updateResult = await UserModel.updateOne({mobile},{$set : objectData})
    return !!updateResult.modifiedCount
    }

}

module.exports = {
    UserAuthController : new UserAuthController()
}
