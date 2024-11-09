const { graphql } = require('graphql')
const { createHandler ,createClient } =require('graphql-http')
const { verifyAccessToken, checkRole } = require('../http/middlewares/verifyAccessToken')
const { AdminRoutes } = require('./admin/admin.routes')
const { homeRoutes } = require('./api')
const { DeveloperRoutes } = require('./DEVELOPER.ROUTES.JS')
const { UserAuthRoutes } = require('./user/auth')
const router = require('express').Router()

router.use('/user' , UserAuthRoutes)
router.use('/admin' , verifyAccessToken , AdminRoutes)
router.use('/developer' , DeveloperRoutes)
router.use('/graphql' , )
router.use('/' , homeRoutes)
module.exports = {
    AllRoutes : router
}
