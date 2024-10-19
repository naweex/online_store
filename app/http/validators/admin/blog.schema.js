const Joi = require('joi')

const createBlogSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('the title of category not accepted')) ,
    text : Joi.string().error(new Error('text you send is not accepted')) ,
    short_text : Joi.string().error(new Error('text you send is not accepted')) ,
    image : Joi.string().error(new Error('image you send is not accepted')) ,
    tags : Joi.array().min(0).max(20).error(new Error('tags should not over 20 character')) ,
})