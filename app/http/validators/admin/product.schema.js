const Joi = require('joi')
const { MongoIDPattern } = require('../../../utils/constance');
const createHttpError = require('http-errors');
const createBlogSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createHttpError.BadRequest('the title of category not accepted')) ,
    text : Joi.string().error(createHttpError.BadRequest('text you send is not accepted')) ,
    short_text : Joi.string().error(createHttpError.BadRequest('text you send is not accepted')) ,
    tags : Joi.array().min(0).max(20).error(createHttpError.BadRequest('tags should not over 20 character')) ,
    category : Joi.string().pattern(MongoIDPattern).error(createHttpError.BadRequest('category not found')) ,
    price : Joi.string().error(createHttpError.BadRequest('input price is not valid')) ,
    category : Joi.string().pattern(MongoIDPattern).error(createHttpError.BadRequest('category not found')) ,
    category : Joi.string().pattern(MongoIDPattern).error(createHttpError.BadRequest('category not found')) ,
    filename : Joi.string().pattern(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createHttpError.BadRequest('image you send is not accepted')) ,
    fileUploadPath : Joi.allow()
});


module.exports = {
    createBlogSchema
}