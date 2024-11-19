const Joi = require('joi')
const { MongoIDPattern } = require('../../../utils/constance');
const createHttpError = require('http-errors');
const createCourseSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createHttpError.BadRequest('the title of course not accepted')) ,
    text : Joi.string().error(createHttpError.BadRequest('text you send is not accepted')) ,
    short_text : Joi.string().error(createHttpError.BadRequest('text you send is not accepted')) ,
    tags : Joi.array().min(0).max(20).error(createHttpError.BadRequest('tags should not over 20 character')) ,
    category : Joi.string().regex(MongoIDPattern).error(createHttpError.BadRequest('course not found')) ,
    price : Joi.number().error(createHttpError.BadRequest('input price is not valid')) ,
    discount : Joi.number().error(createHttpError.BadRequest('discount is not valid')) ,
    type : Joi.string().RegExp(/(free|cash|special)/i) ,
    filename : Joi.string().regex(/(\.mp4|\.mov|\.avi|\.mkv|\.mpg)$/).error(createHttpError.BadRequest('your uploaded video is not accepted')) ,
    fileUploadPath : Joi.allow()
});
const createEpisodeSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createHttpError.BadRequest('the title of course not accepted')) ,
    text : Joi.string().error(createHttpError.BadRequest('text you send is not accepted')) ,
    type : Joi.string().RegExp(/(lock|unlock)/i) ,
    chapterID : Joi.string().RegExp(MongoIDPattern).error(createHttpError.BadRequest('chapter ID is invalid')) ,
    courseID : Joi.string().RegExp(MongoIDPattern).error(createHttpError.BadRequest('course ID is invalid')) ,
    filename : Joi.string().RegExp(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createHttpError.BadRequest('image you send is not accepted')) ,
    fileUploadPath : Joi.allow()
});


module.exports = {
    createCourseSchema ,
    createEpisodeSchema
}