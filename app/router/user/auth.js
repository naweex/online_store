const router = require('express').Router()
const {UserAuthController} = require('../../http/controllers/user/auth/auth.controller')
/**
 * @swagger
 *  tags:
 *      name: user-Authentication
 *      description: user-auth section
 */
/**
 * @swagger
 *  /user/get-otp:
 *      post:
 *          tags: [user-Authentication]
 *          summary: login user in user panel with phone number
 *          description: one time password(OTP) login
 *          parameters:
 *          -   name: mobile
 *              description: fa-IRI phone number
 *              in: formData
 *              required: true
 *              type: string
 *          responses: 
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 *              401:
 *                  description: Unauthorized
 *              500:
 *                  description: Internal Server Error                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
 */



router.post('/get-otp' , UserAuthController.getOtp)
/**
 * @swagger
 *  /user/check-otp:
 *      post:
 *          tags: [user-Authentication]
 *          summary: check-otp value
 *          description: check-otp with code
 *          parameters:
 *          -   name: mobile
 *              description: fa-IRI phone number
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: code
 *              description: enter code
 *              in: formData
 *              required: true
 *              type: 
 *          responses: 
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 *              401:
 *                  description: Unauthorized
 *              500:
 *                  description: Internal Server Error   
 * 
 */
router.post('/check-otp' , UserAuthController.checkOtp)
/**
 * @swagger
 *  /user/refresh-token:
 *      post:
 *          tags: [user-Authentication]
 *          summary: send refresh token for get new token and refresh token
 *          description: new token
 *          parameters: 
 *              -   in: formData
 *                  required: true
 *                  type: string
 *                  name: refreshToken
 *          responses:
 *              200:
 *                  description: success
 */

router.post('/refresh-token' , UserAuthController.refreshToken)
module.exports = {
    UserAuthRoutes : router
}