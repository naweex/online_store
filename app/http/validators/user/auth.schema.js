const Joi = require('joi');

const authSchema = Joi.object({
    mobile : Joi.string().length(11).pattern(/^09[0-9]{9}$/), 
    //password : Joi.string().min(6).max(16).trim().required(),
})

module.exports = {
    authSchema
}