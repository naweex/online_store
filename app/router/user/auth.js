const router = require('express').Router()
const {UserAuthController} = require('../../http/controllers/user/auth/auth.controller')

/**
 * @swagger
 *  components:
 *      schemas:
 *          GetOtp:
 *              type: object
 *              required:
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: user mobile for sign up and sign in
 *          CheckOtp:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   code
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: user mobile for sign up and sign in
 *                  code:
 *                      type: integer
 *                      description: received code from GetOtp
 *           RefreshToken:
 *               type: object
 *               required:
 *                   -   refreshToken
 *               properties:
 *                   refreshToken:
 *                       type: string
 *                       description: enter refresh_token to get new token
 */



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
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/GetOtp'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetOtp'
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
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/CheckOTP'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CheckOTP'
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
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/RefreshToken'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RefreshToken'
 *          responses:
 *              200:
 *                  description: success
 */

router.post('/refresh-token' , UserAuthController.refreshToken)
module.exports = {
    UserAuthRoutes : router
}