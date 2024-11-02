const { default: getVideoDurationInSeconds } = require('get-video-duration');
const {
  createEpisodeSchema,
} = require('../../../validators/admin/course.schema');
const Controller = require('../../controller');
const path = require('path');
const { getTime } = require('../../../../utils/functions');
const { CourseModel } = require('../../../../models/course');
const createHttpError = require('http-errors');
const { StatusCodes: HttpStatus } = require('http-status-codes');
const { objectIdValidators } = require('../../../validators/public.validator')
class EpisodeController extends Controller {
  async addNewEpisode(req, res, next) {
    try {
      const { title , text , type , chapterID , courseID , filename , fileUploadPath } =
        await createEpisodeSchema.validateAsync(req.body);
      const videoAddress = path
        .join(fileUploadPath, filename)
        .replace(/\\/g, '/');
      const videoURL = `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${videoAddress}`;
      const seconds = await getVideoDurationInSeconds(videoURL);
      const time = getTime(seconds);
      const episode = {
        title,
        text,
        type,
        time,
        videoAddress


      }
      const createEpisodeResult = await CourseModel.updateOne({_id : courseID,'chapters._id' : chapterID} , {
        $push : {
          'chapters.$.episodes' : episode
        }
      });
      if(createEpisodeResult.modifiedCount == 0) throw new createHttpError.InternalServerError('adding episode failed')
      return res.status(HttpStatus.CREATED).json({
          statusCode : HttpStatus.CREATED ,
          data : {
            message : 'episode added successfully'
          }
      });
    } catch (error) {
      next(error);
    }
  }
  async removeEpisode(req, res, next) {
    try {
      const {id : episodeID} = await objectIdValidators.validateAsync({id : req.param.episodeID});
      const removeEpisodeResult = await CourseModel.updateOne({'chapters.episodes._id': episodeID} , {
        $pull : {
          'chapters.$.episodes' : {
            _id : episodeID
          }
        }
      });
      if(removeEpisodeResult.modifiedCount == 0) throw new createHttpError.InternalServerError('deleting episode failed')
      return res.status(HttpStatus.OK).json({
          statusCode : HttpStatus.OK ,
          data : {
            message : 'episode, deleted successfully'
          }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  EpisodeController: new EpisodeController(),
};
