const createHttpError = require('http-errors');
const { CourseModel } = require('../../../../models/course');
const Controller = require('../../controller');
const { CourseController } = require('./course.controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const { deleteInvalidPropertyInObject } = require('../../../../utils/functions');

class ChapterController extends Controller {
  async addChapter(req, res, next) {
    try {
      const { id, title, text } = req.body;
      await CourseController.findCourseById(id);
      const saveChapterResult = await CourseModel.updateOne(
        { _id: id },
        {
          $push: {
            chapters: { title, text, episodes: [] },
          },
        }
      );
      if (saveChapterResult.modifiedCount == 0)
        throw createHttpError.InternalServerError('chapter is not added');
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: 'chapter added successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async ChaptersOfCourse(req, res, next) {
    try {
      const {courseID} = req.params;
      const course = await this.getChaptersOfCourse(courseID)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          course
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeChapterById(req , res , next){
    try {
    const {chapterID} = req.params;
    const chapter = await this.getOneChapter(chapterID)
    const removeChapterResult = await CourseModel.updateOne({'chapters._id' : chapterID} , {
    $pull : {
      chapters :{
        _id : chapterID
      } 
    }
  })
    if(removeChapterResult.modifiedCount == 0) throw createHttpError.InternalServerError('chapter not deleted')
      res.status(HttpStatus.OK).json({
        statusCode : HttpStatus.OK ,
        data : {
          message : 'chapter deleted successfully'
        }
      })
    } catch (error) {
      next(error)
    }
  }
  async updateChapterById(req , res , next){
    try {
      const {chapterID} = req.params;
      await this.getOneChapter(chapterID);
      const data = req.body;
      deleteInvalidPropertyInObject(data , ['_id'])
      const updateChapterResult = await CourseModel.updateOne(
        {'chapters.id' : chapterID} ,
        {$set : {'chapters.$' : data}}
      )
      if(updateChapterResult.modifiedCount == 0) 
          throw createHttpError.InternalServerError('chapter update is failed')
        return res.status(HttpStatus.OK).json({
          statusCode : HttpStatus.OK ,
          data : {
            message : 'updated successfully'
          }
        })
    } catch (error) {
      next(error)
    }
  }
  async getChaptersOfCourse(id){
    const chapters = await CourseModel.findOne({_id : id} , {chapters : 1 , title : 1})
    if(!chapters) throw createHttpError.NotFound('not found any course with this id')
      return chapters
  }
  async getOneChapter(id){
    const chapter = await CourseModel.findOne({'chapters._id' : id} , {'chapters.$' : 1})
    if(!chapter) throw createHttpError.NotFound('not found any chapter')
      return chapter
  }
}



module.exports = {
    ChapterController : new ChapterController()
}
