const Controller = require('../../controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const { UserModel } = require('../../../../models/users');
const { deleteInvalidPropertyInObject } = require('../../../../utils/functions');
const createHttpError = require('http-errors');
class UserController extends Controller{
    async getAllUsers(req , res , next){
        try {
            const {search} = req.query;
            const databaseQuery = {};
            if(search) databaseQuery['$text'] = {$search : search} 
            const users = await UserModel.find(databaseQuery)
            return res.status(HttpStatus.OK),json({
                statusCode : HttpStatus.OK ,
                data : {
                    users
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateUserProfile(req , res , next){
        try {
            const userID = req.user._id
            const data = req.body
            const blackListFields = ['mobile' , 'otp' , 'bills', 'discount' ,'roles' , 'courses'] //users cannot change this fields
            deleteInvalidPropertyInObject(data , blackListFields)
            const profileUpdateResult = await UserModel.updateOne({_id : userID} , {$set : data})
            if(!profileUpdateResult.modifiedCount) throw new createHttpError.InternalServerError('update failed')
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    message : 'profile updated successfully'
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async userProfile(req , res , next){
        try {
            const user = req.user;
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    user
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { 
UserController : new UserController()
}