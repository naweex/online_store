const createHttpError = require("http-errors");
const { RoleModel } = require("../../../../models/role");
const Controller = require("../../controller");
const { StatusCodes: HttpStatus } = require('http-status-codes');
const { addRoleSchema } = require("../../../validators/admin/RBAC.schema");
const { default: mongoose } = require("mongoose");
const { copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/functions");
class RoleController extends Controller{
    async getAllRoles(req , res , next){
        try {
            const roles = await RoleModel.find({})
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    roles
                }
            })
        } catch (error) {
            next(error)
        }
    } 
    async createNewRole(req , res , next){
        try {
            const {title , permissions} = await addRoleSchema.validateAsync(req.body);
            await this.findRoleWithTitle(title)
            const role = await RoleModel.create({title , permissions})
            if(!role) throw createHttpError.InternalServerError('role not created')
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED ,
                data : {
                    message : 'role created successfully'
                }
            })
        } catch (error) {
            next(error)
        }
    } 
    async removeRole(req , res ,next){
        try {
            const {field} = req.params;
            const role = await this.findRoleWithIdOrTitle(field)
            const removeRoleResult = await RoleModel.deleteOne({_id : role._id})
            if(!removeRoleResult.deletedCount) throw createHttpError.InternalServerError('role is not deleted')
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    message : 'role deleted successfully'
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateRoleByID(req , res ,next){
        try {
            const {id} = req.params;
            const role = await this.findRoleWithIdOrTitle(id)
            const data = copyObject(req.body)
            deleteInvalidPropertyInObject(data , [])
            const updateRoleResult = await RoleModel.updateOne({_id : role._id} ,{$set : data})
            if(!updateRoleResult.modifiedCount) throw createHttpError.InternalServerError('role is not updated')
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                data : {
                    message : 'role updated successfully'
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async findRoleWithTitle(title){
        const role = await RoleModel.findOne({title})
        if(role) throw createHttpError.BadRequest('role already registered')
    }
    async findRoleWithIdOrTitle(field){
        let findQuery = mongoose.isValidObjectId(field)? {_id : field} : {title : field}
        const role = await RoleModel.findOne(findQuery)
        if(!role) throw createHttpError.NotFound('role not found')
            return role
    } 
}
module.exports = {
    RoleController : new RoleController()
}