const courseController = require('../../http/controllers/admin/course.controller');
const { CourseController } = require('../../http/controllers/admin/course.controller');
const { stringToArray } = require('../../http/middlewares/stringToArray');
const { uploadFile } = require('../../utils/multer')
const router = require('express').Router();
router.get('/list' , CourseController.getListOfProduct)
router.post('/add' , uploadFile.single('image'),stringToArray('tags'), CourseController.addCourse)
router.patch()
router.delete()
router.get()
router.put()
router.put()

module.exports = {
    AdminApiCourseRouter : router
}