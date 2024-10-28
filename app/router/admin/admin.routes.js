const { verifyAccessToken } = require('../../http/middlewares/verifyAccessToken')
const { AdminApiBlogRouter } = require('./blog')
const { AdminApiCategoryRouter } = require('./category')
const { AdminApiCourseRouter } = require('./course')
const { AdminApiProductRouter } = require('./product')
const router = require('express').Router()
/**
 * @swagger
 *  tags:
 *      -   name: Admin-Panel
 *          description: action of Admin includes(add,delete,update,etc...)
 *      -   name: Course(AdminPanel)
 *          description: management course section like manage episode , chapter and courses
 *      -   name: Product(AdminPanel)
 *          description: management product routes 
 *      -   name: Category(AdminPanel)
 *          description: all method and routes about category section
 *      -   name: Blog(AdminPanel)
 *          description: make blog management admin panel
 *      
 */

router.use('/category' , AdminApiCategoryRouter)
router.use('/blogs' ,AdminApiBlogRouter )
router.use('/products' , AdminApiProductRouter)
router.use('/courses' , AdminApiCourseRouter)
module.exports = {
    AdminRoutes : router
}