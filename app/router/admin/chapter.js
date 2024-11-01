const { ChapterController } = require('../../http/controllers/admin/course/chapter.controller');

const router = require('express').Router()


router.put('/add', ChapterController.addChapter);
router.get('/list/:courseID', ChapterController.ChaptersOfCourse);
router.patch('/remove/:courseID', ChapterController.removeChapterById);
router.patch('/update/:courseID', ChapterController.updateChapterById);
module.exports = {
    AdminApiChapterRouter : router
}