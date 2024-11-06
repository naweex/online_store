const Joi = require('joi');
const { MongoIDPattern } = require('../../../utils/constance');
const addRoleSchema= Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('role title is not correct')) ,
    description : Joi.string().min(3).max(100).error(new Error('role description is not correct')) ,
    permissions : Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(new Error('permissions are not correct'))
})
const addPermissionSchema= Joi.object({
    name : Joi.string().min(3).max(30).error(new Error('permission name is not correct')) ,
    description : Joi.string().min(3).max(100).error(new Error('permission description is not correct')) ,
})

module.exports = {
   addRoleSchema ,
   addPermissionSchema
}