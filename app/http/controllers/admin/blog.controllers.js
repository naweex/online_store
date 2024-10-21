const { BlogModel } = require('../../../models/blogs')
const { createBlogSchema } = require('../../validators/admin/blog.schema')
const Controller = require('./../controller')
const path = require('path')
const { deleteFileInPublic } = require('../../../utils/functions')
const createHttpError = require('http-errors')
class BlogController extends Controller {
    async createBlog(req , res , next){
        try {
            const blogDataBody = await createBlogSchema.validateAsync(req.body);
            req.body.image = path.join(blogDataBody.fileUploadPath , blogDataBody.filename)
            req.body.image = req.body.image.replace(/\\/g , '/')
            const {title , text , short_text , category , tags} = blogDataBody;
            const image  = req.body.image
            const author = req.user._id
            const blog = await BlogModel.create({title , image , text , short_text , category , tags , author})
            return res.status(201).json({
                data : {
                    statusCode : 201 ,
                    message : 'blog created successfully'
                }
            })
        } catch (error) {
            deleteFileInPublic(req.body.image)
            next(error)
        }
    }
    async getOneBlogById(req , res , next){
        try {
            const {id} = req.params;
            const blog = await this.findBlog({_id : id})
            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    blog
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getListOfBlogs(req , res , next){
        try {
            const blog = await BlogModel.aggregate([
                {$match : {}} ,
                {
                    $lookup : {
                    from : 'users' ,
                    foreignField : '_id' ,
                    localField : 'author' ,
                    as : 'author'          
                }   
            } ,
            {
                $unwind : '$author'
            },
            {
                $lookup : {
                from : 'categories' ,
                foreignField : '_id' ,
                localField : 'category' ,
                as : 'category'          
            }   
        } ,
        {
            $unwind : '$category'
        },
            {
                $project : {
                    'author.__v' :  0 ,
                    'category.__v' : 0 ,
                    'author.otp' :  0 ,
                    'author.roles' :  0 ,
                    'author.discount' :  0 ,
                    'author.bills' :  0 , 
                }
            }
            ])
            return res.status(200).json({
                data : {
                    statusCode : 200 ,
                    blogs
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getCommentsOfBlog(req , res , next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async deleteBlogById(req , res , next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async updateBlogById(req , res , next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async findBlog(query = {}){
        const blog = await BlogModel.findOne(query).populate([{path : 'category' , select : {'children' : 0}} , {path : 'user'}]);
        if(!blog) throw createHttpError.NotFound('blog not found')
            return blog
    }
}

module.exports = {
   AdminBlogController : new BlogController()
}