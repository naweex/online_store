const { CategoryController } = require('../../http/controllers/admin/category.controller')
const router = require('express').Router()

/**
 * @swagger
 *  /admin/category/add:
 *      post:
 *          tags: [Admin-Panel]
 *          summary: create new category title
 *          parameters:
 *              -   in: formData
 *                  type: string
 *                  required: true
 *                  name: title
 *              -   in: formData
 *                  type: string
 *                  required: false
 *                  name: parent
 *          responses:
 *              201:
 *                  description: success
 */

router.post('/add' , CategoryController.addCategory)
/**
 * @swagger
 *  /admin/category/parents:
 *      get:
 *          tags: [Admin-Panel]
 *          summary: get all parents of Category
 *          responses:
 *              200:
 *                  description: success 
 */


router.get('/parents' ,)
module.exports = {
    CategoryRoutes : router
}