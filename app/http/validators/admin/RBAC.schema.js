const Joi = require('joi');

const addRoleSchema= Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('role title is not correct')) ,
})


module.exports = {
   addRoleSchema
}