const createHttpError = require("http-errors");
const { UserModel } = require("../../../models/users");
const Controller = require("../controller");
const { default: axios, HttpStatusCode } = require("axios");
const { getBasketOfUser, invoiceNumberGenerator } = require("../../../utils/functions");
const payment = require("../../../router/api/payment");
const { PaymentModel } = require("../../../models/payments");
const moment = require('moment-jalali')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {StatusCodes : HttpStatusCode} = require('http-status-codes');

class PaymentController extends Controller{
    async PaymentGateway(req , res , next){
        try {
            const user = req.user
            if(user.basket.courses.length == 0 && user.basket.products.length == 0) throw new createHttpError.BadRequest('youre basket is empty')
            const basket = (await getBasketOfUser(user._id))?.[0]
            if(!basket?.payDetail?.paymentAmount) throw new createHttpError.BadRequest('there is nothing for buy')
            const zarinpal_request_url = 'https://payment.zarinpal.com/pg/v4/payment/request.json'
        const zarinpalGatewayURL = 'https://payment.zarinpal.com/pg/StartPay' 
        const description = 'for buying course or product'
        const amount = basket?.payDetail?.paymentAmount
            const zarinpal_options = {
                merchant_id : process.env.ZARINPAL_MERCHANTID ,
                amount  ,
                description ,
                metadata : {
                    email : user?.email || 'example@domain.com' ,
                    mobile : user.mobile
                },
                callback_url : 'http://localhost:3000/verify'
            } 
            const requestResult = await axios.post(zarinpal_request_url , zarinpal_options).then(result => result.data);
            const {authority , code} = requestResult.data
            await PaymentModel.create({
                invoiceNumber : invoiceNumberGenerator() , 
                paymentDate : moment().format("jYYYYjMMjDDHHmmssSSS") ,
                amount  ,
                user : user._id ,
                description ,
                authority ,
                verify : false ,
                basket
            })
            if(code == 100 && authority){
            return res.status(HttpStatusCode.Ok).json({
             statusCode : HttpStatusCode.Ok ,
             data : {
                code ,
                gatewayURL : `${zarinpalGatewayURL}/${authority}`
             }
            })
        }
            throw new createHttpError.BadRequest('the parameters you send not acceptable')
        } catch (error) {
            next(error)
        }
    }
    async verifyPayment(req , res , next){
        try {
            const {Authority : authority} = req.query;
            const verifyURL = 'https://api.zarinpal.com/pg/v4/payment/verify.json';
            const payment = await PaymentModel.findOne({authority})
            if(!payment) throw new createHttpError.NotFound('not found any bill for pay')
            if(payment.verify) throw createHttpError.BadRequest('this transaction already existed')
            const verifyBody = JSON.stringify({
                authority,
                amount : payment.amount ,
                merchant_id : process.env.ZARINPAL_MERCHANTID
            })
            const verifyResult = await fetch(verifyURL , {
                method : 'POST' ,
                headers : {
                    'Content-Type' : 'application/json'
                } ,
                body : verifyBody
            }).then(result => result.json()) 
            if(verifyResult.data.code == 100){
                await PaymentModel.updateOne({authority} , {
                    $set : {
                        refID : verifyResult.data.ref_id ,
                        cardHash : verifyResult.data.card_hash ,
                        verify : true
                    } 
                })
                const user = await UserModel.findById(payment.user)
                await UserModel.updateOne({_id : payment.user} , {
                    $set : {
                        courses : [...payment?.basket?.payDetail?.courseIds || [] , ...user.Courses] ,
                        products :[...payment?.basket?.payDetail?.productIds || [] , ...user.products] ,
                        basket : {
                            courses : [] ,
                            products : []
                        }
                    }
                })
                return res.status(HttpStatusCode.Ok).json({
                    statusCode : HttpStatusCode.Ok ,
                    data : {
                        message : 'your payment successfully done'
                    }
                })
            }
            throw createHttpError.BadRequest('your payment action not completed')
        } catch (error) {
            next(error)
        }   
    }
}
module.exports = {
    PaymentController : new PaymentController()
}