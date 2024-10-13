const createHttpError = require("http-errors")
const { authSchema } = require("../../../validators/user/auth.schema")
const { randomInt } = require("../../../../utils/functions")
const Controller = require('../../controller')
const { UserModel } = require("../../../../models/users")
const { EXPIRES_IN, USER_ROLE } = require("../../../../utils/constance")
class UserAuthController extends Controller {
    async getOtp(req , res , next){
        try {
            await authSchema.validateAsync(req.body)
            const {mobile} = req.body;
            const code = randomInt()
            const result = await this.saveUser(mobile , code)
            if(!result) throw new createHttpError.Unauthorized('code not send , please try again')
            return res.status(200).send({
             data: {
                statusCode : 200 ,
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
            
        } catch (error) {
            
        }
    }
    async saveUser(mobile , code){
        let otp = {
            code,
            expiresIn : EXPIRES_IN
        }
    const result = await this.checkExistUser(mobile)
    if(result){
        return (await this.updateUser(mobile , {otp}))
    }
    return !!(await UserModel.create({
        mobile ,
        otp ,
        roles : [USER_ROLE]
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
