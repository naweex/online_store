const Joi = require('joi')

const createBlogSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('the title of category not accepted'))
})