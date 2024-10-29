const createHttpError = require("http-errors");
const { CourseModel } = require("../../../models/course");
const { createCourseSchema } = require("../../validators/admin/course.schema");
const Controller = require("../controller");
const { StatusCodes : HttpStatus } = require('http-status-codes')
const path = require('path')
class CourseController extends Controller{
    async getListOfCourse(req , res , next){
        try {
            const {search} = req.query;
            let courses;
            if(search) courses = await CourseModel.find({$text : {$search : search}}).sort({_id : -1})
            else courses = await CourseModel.find({}).sort({_id : -1})
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK ,
                courses
            })
        } catch (error) {
            next(error)
        }
    }
    async addCourse(req , res , next){
        try {
            await createCourseSchema.validateAsync(req.body)
            const {fileUploadPath,filename} = req.body;
            const image = path.join(fileUploadPath , filename).replace(/\\/g,'/')
            const {title ,short_text,text,tags,category,price,discount,type} = req.body;
            const teacher = req.user._id
            if(Number(price) > 0 && type === 'free') throw createHttpError.BadRequest('for free courses do not need any price')
            const course = CourseModel.create({
                title,
                short_text,
                text,
                tags,
                category,
                price,
                discount,
                type,
                image : '00:00:00',
                status : 'notStarted',
                teacher
            })
            if(!course) throw createHttpError.InternalServerError('course not registered')
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED ,
                message : 'course created successfully'
            })
        } catch (error) {
            next(error)
        }
    }
    async getCourseById(req , res , next){
        try {
            const {id} = req.params;
            const course = await CourseModel.findById(id)
            if(!course) throw createHttpError.NotFound('not found any course')
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK ,
                    course
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    CourseController : new CourseController()
}