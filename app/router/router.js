const { verifyAccessToken, checkRole } = require('../http/middlewares/verifyAccessToken')
const { AdminRoutes } = require('./admin/admin.routes')
const { homeRoutes } = require('./api')
const { DeveloperRoutes } = require('./DEVELOPER.ROUTES.JS')
const { UserAuthRoutes } = require('./user/auth')
const router = require('express').Router()

router.use('/user' , UserAuthRoutes)
router.use('/admin' , verifyAccessToken , checkRole('ADMIN') , AdminRoutes)
router.use('/developer' , DeveloperRoutes)
router.use('/' , homeRoutes)
module.exports = {
    AllRoutes : router
}
