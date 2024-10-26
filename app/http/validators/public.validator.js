const Joi = require('joi')
const { MongoIdPattern } = require('../../utils/constance')
const createHttpError = require('http-errors')
const objectIdValidators = Joi.object({
    id : Joi.string().pattern(MongoIdPattern).error(new Error(createHttpError.BadRequest('id is not valid')))
})

module.exports = {
    objectIdValidators
}