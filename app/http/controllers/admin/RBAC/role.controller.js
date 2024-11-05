const createHttpError = require("http-errors");
const { RoleModel } = require("../../../../models/role");
const Controller = require("../../controller");
const { StatusCodes: HttpStatus } = require('http-status-codes');
const { addRoleSchema } = require("../../../validators/admin/RBAC.schema");
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
            const {title} = await addRoleSchema.validateAsync(req.body);
            await this.findRoleWithTitle(title)
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
    async findRoleWithTitle(title){
        const role = await RoleModel.findOne({title})
        if(role) throw createHttpError.BadRequest('role already registered')
    }
}
module.exports = {
    RoleController : new RoleController()
}