const createHttpError = require('http-errors');
const { CourseModel } = require('../../../../models/course');
const Controller = require('../../controller');
const { CourseController } = require('./course.controller');
const { StatusCodes: HttpStatus } = require('http-status-codes');

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
      const {id} = req.params;
      const chapters = await this.getChaptersOfCourse(id)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          chapters
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getChaptersOfCourse(id){
    const chapters = await CourseModel.findOne({_id : id} , {chapters : 1})
    if(!chapters) throw createHttpError.NotFound('not found any course with this id')
  }
}
module.exports = {
    ChapterController : new ChapterController()
}
