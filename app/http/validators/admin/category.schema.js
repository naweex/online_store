const Joi = require('joi');

const addCategorySchema= Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('category title is not correct')) ,
    parent : Joi.string().allow('').pattern(MongoIdPattern).allow('').error(new Error('parent of chosen category not found'))
})

module.exports = {
    addCategorySchema
}