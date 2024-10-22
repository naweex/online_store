const Joi = require('joi');

const getOtpSchema= Joi.object({
    mobile : Joi.string().length(11).pattern(/^09[0-9]{9}$/).error(new Error('mobile number is wrong'))
})
const checkOtpSchema = Joi.object({
    mobile : Joi.string().length(11).pattern(/^09[0-9]{9}$/).error(new Error('mobile number is wrong')) ,
    code : Joi.string().min(4).max(6).error(new Error('code is wrong'))
})

module.exports = {
    getOtpSchema ,
    checkOtpSchema
}