const Joi = require('joi')
const { MongoIDPattern } = require('../../../utils/constance');
const createHttpError = require('http-errors');
const createBlogSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createHttpError.BadRequest('the title of category not accepted')) ,
    text : Joi.string().error(createHttpError.BadRequest('text you send is not accepted')) ,
    short_text : Joi.string().error(createHttpError.BadRequest('text you send is not accepted')) ,
    tags : Joi.array().min(0).max(20).error(createHttpError.BadRequest('tags should not over 20 character')) ,
    category : Joi.string().pattern(MongoIDPattern).error(createHttpError.BadRequest('category not found')) ,
    price : Joi.number().error(createHttpError.BadRequest('input price is not valid')) ,
    discount : Joi.number().error(createHttpError.BadRequest('discount is not valid')) ,
    count : Joi.number().error(createHttpError.BadRequest('number of product is not valid')) ,
    filename : Joi.string().pattern(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createHttpError.BadRequest('image you send is not accepted')) ,
    fileUploadPath : Joi.allow()
});


module.exports = {
    createBlogSchema
}