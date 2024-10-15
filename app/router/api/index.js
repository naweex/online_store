const homeController = require('../../http/controllers/api/home.controller');
const { verifyAccessToken } = require('../../http/middlewares/verifyAccessToken');
const router = require('express').Router();
/**
 * @swagger
 * tags:
 *  name: Index Page
 *  description: main web apis
 * 
 */
/**
 * @swagger
 * /:
 *  get:
 *      summary: base of routes
 *      tags: [Index Page]
 *      description: get all basic data for index
 *      parameters:
 *          -   in: header
 *              name: access-token
 *              example: bearer yore token
 *      responses:
 *          200:
 *              description: success
 *              schema:
 *                  type: string
 *                  example: index page store
 *          404:
 *              description: not found
 *
 */








router.get('/' , verifyAccessToken ,homeController.indexPage)
module.exports = {
    homeRoutes : router
}