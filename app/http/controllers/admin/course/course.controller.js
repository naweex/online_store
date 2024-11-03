const createHttpError = require('http-errors');
const { CourseModel } = require('../../../../models/course');
const {
  createCourseSchema,
} = require('../../../validators/admin/course.schema');
const Controller = require('../../controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const path = require('path');
const { default: mongoose } = require('mongoose');
const { copyObject, deleteInvalidPropertyInObject, deleteFileInPublic } = require('../../../../utils/functions');
class CourseController extends Controller {
  async getListOfCourse(req, res, next) {
    try {
      const { search } = req.query;
      let courses;
      if (search)
        courses = await CourseModel
      .find({ $text: { $search: search } })
      .populate([
        {path : 'category' , select : {children : 0 , parent : 0}} ,
        {path : 'teacher' , select : {first_name : 1 , last_name : 1 , mobile : 1 , email : 1}}
      ])
      .sort({
          _id: -1,
        });
      else courses = await CourseModel
      .find({})
      .populate([
        {path : 'category' , select : {children : 0 , parent : 0}} ,
        {path : 'teacher' , select : {first_name : 1 , last_name : 1 , mobile : 1 , email : 1}}
      ])
      .sort({ _id: -1 });
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          courses,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async addCourse(req, res, next) {
    try {
      await createCourseSchema.validateAsync(req.body);
      const { fileUploadPath, filename } = req.body;
      const image = path.join(fileUploadPath, filename).replace(/\\/g, '/');
      const { title, short_text, text, tags, category, price, discount, type } =
        req.body;
      const teacher = req.user._id;
      if (Number(price) > 0 && type === 'free')
        throw createHttpError.BadRequest(
          'for free courses do not need any price'
        );
      const course = CourseModel.create({
        title,
        short_text,
        text,
        tags,
        category,
        price,
        discount,
        type,
        image: '00:00:00',
        status: 'notStarted',
        teacher,
      });
      if (!course)
        throw createHttpError.InternalServerError('course not registered');
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: 'course created successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const course = await CourseModel.findById(id);
      if (!course) throw createHttpError.NotFound('not found any course');
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          course,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateCourseById(req , res , next) {
    try {
      const {id} = req.params;
      const course = await this.findCourseById(id)
      const data = copyObject(req.body)
      const {filename , fileUploadPath} = req.body;
      let blackListFields = ['time' , 'chapters' , 'episodes' , 'students' , 'bookmarks' , 'likes' , 'dislikes' , 'comments']
      deleteInvalidPropertyInObject(data , blackListFields  )
      if(req.file){
        data.image = path.join(filename , fileUploadPath)
        deleteFileInPublic(course.image)
      }
      const updateCourseResult = await CourseModel.updateOne({_id : id} , {
        $set : data
      })
      if(!updateCourseResult.modifiedCount) throw new createHttpError.InternalServerError('course not updated')
      return res.status(HttpStatus.OK).json({
        statusCode : HttpStatus.OK ,
        data : {
          message : 'course updated successfully'
        }
      })
    } catch (error) {
      next(error)
    }
  }
  async findCourseById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest('id is not valid');
    const course = await CourseModel.findById(id);
    if (!course) throw createHttpError.NotFound('course not found');
    return course;
  }
}

module.exports = {
  CourseController: new CourseController(),
};
