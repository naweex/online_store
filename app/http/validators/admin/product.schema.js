const Joi = require('joi')
const { MongoIDPattern } = require('../../../utils/constance');
const createHttpError = require('http-errors');
const createProductSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createHttpError.BadRequest('the title of product not accepted')) ,
    text : Joi.string().error(createHttpError.BadRequest('text you send is not accepted')) ,
    short_text : Joi.string().error(createHttpError.BadRequest('text you send is not accepted')) ,
    tags : Joi.array().min(0).max(20).error(createHttpError.BadRequest('tags should not over 20 character')) ,
    colors : Joi.array().min(0).max(20).error(createHttpError.BadRequest('tags should not over 20 character')) ,
    category : Joi.string().regex(MongoIDPattern).error(createHttpError.BadRequest('product not found')) ,
    price : Joi.number().error(createHttpError.BadRequest('input price is not valid')) ,
    discount : Joi.number().error(createHttpError.BadRequest('discount is not valid')) ,
    count : Joi.number().error(createHttpError.BadRequest('number of product is not valid')) ,
    weight : Joi.number().allow(null , 0 , '0').error(createHttpError.BadRequest('weight of product is not valid')) ,
    length : Joi.number().allow(null , 0 , '0').error(createHttpError.BadRequest('length of product is not valid')) ,
    height : Joi.number().allow(null , 0 , '0').error(createHttpError.BadRequest('height of product is not valid')) ,
    width : Joi.number().allow(null , 0 , '0').error(createHttpError.BadRequest('width of product is not valid')) ,
    type : Joi.string().regex(/(virtual|physical)/i) ,
    filename : Joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createHttpError.BadRequest('image you send is not accepted')) ,
    fileUploadPath : Joi.allow()
});


module.exports = {
    createProductSchema
}