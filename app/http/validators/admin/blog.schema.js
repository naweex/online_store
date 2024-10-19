const Joi = require('joi')

const createBlogSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(new Error('the title of category not accepted')) ,
    text : Joi.string().error(new Error('text you send is not accepted')) ,
    short_text : Joi.string().error(new Error('text you send is not accepted')) ,
    image : Joi.string().error(new Error('image you send is not accepted')) ,
})