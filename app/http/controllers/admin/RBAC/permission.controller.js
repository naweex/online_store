const { PermissionModel } = require("../../../../models/permissions");
const { addPermissionSchema } = require("../../../validators/admin/RBAC.schema");
const Controller = require("../../controller");
const { StatusCodes: HttpStatus } = require('http-status-codes');
const createHttpError = require("http-errors");
class PermissionController extends Controller{
    async getAllPermissions(req , res , next){
        try {
            const permissions = await PermissionModel.find({})
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    permissions
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async removePermission(req , res , next){
        try {
            const {id} = req.params;
            await this.findPermissionWithID(id)
            const removePermissionResult = await PermissionModel.deleteOne({_id : id})
            if(!removePermissionResult.deletedCount) throw createHttpError.InternalServerError('permission not deleted')
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    message : 'permission deleted successfully'
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async createNewPermission(req , res , next){
        try {
            const {name , description} = await addPermissionSchema.validateAsync(req.body);
            await this.findPermissionWithName(name)
            const permission = await PermissionModel.create({name , description})
            if(!permission) throw createHttpError.InternalServerError('permission not created')
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED ,
                data : {
                    message : 'permission created successfully'
                }
            })
        } catch (error) {
            next(error)
        }
    } 
    async updatePermissionByID(req , res ,next){
        try {
            const {id} = req.params;
            await this.findPermissionWithID(id)
            const data = copyObject(req.body)
            deleteInvalidPropertyInObject(data , [])
            const updatePermissionResult = await PermissionModel.updateOne({_id : id} ,{$set : data})
            if(!updatePermissionResult.modifiedCount) throw createHttpError.InternalServerError('permission is not updated')
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    message : 'permission updated successfully'
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async findPermissionWithName(name){
        const permission = await PermissionModel.findOne({name})
        if(permission) throw createHttpError.BadRequest('permission already registered')
    }
    async findPermissionWithID(_id){
        const permission = await PermissionModel.findOne({_id})
        if(!permission) throw createHttpError.NotFound('permission  not found')
            return permission
    }
}
module.exports = {
    PermissionController : new PermissionController()
}