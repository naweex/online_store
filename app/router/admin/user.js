const { UserController } = require('../../http/controllers/admin/users/user.controller')
const { checkPermission } = require('../../http/middlewares/permission.guard')
const { PERMISSIONS } = require('../../utils/constance')


const router = require('express').Router()
router.get('/list' , checkPermission([PERMISSIONS.ADMIN]) , UserController.getAllUsers)
router.patch('/update-profile' , UserController.updateUserProfile)
router.get('/profile' , checkPermission([]) , UserController.userProfile) //everyone can access

module.exports = {
    AdminApiUserRouter : router
}