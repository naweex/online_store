const express = require('express')
const {default : mongoose} = require('mongoose')
const path = require('path')
const createError = require('http-errors')
const swaggerUI = require('swagger-ui-express')
const morgan = require('morgan')
mongoose.set('strictQuery', true);
const { AllRoutes } = require('./router/router')
const swaggerJSDoc = require('swagger-jsdoc')
const cors = require('cors')
const { url } = require('inspector')

module.exports = class application {
    #app = express()
    #DB_URI
    #PORT
    constructor(PORT , DB_URI){
        this.#PORT = PORT
        this.#DB_URI =DB_URI
        this.configApplication();
        this.initRedis();
        this.connectToMongoDB();
        this.createServer();
        this.createRoutes();
        this.errorHandling();
    }
    configApplication(){
        this.#app.use(cors())
        this.#app.use(morgan("dev"))
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({extends : true}))
        this.#app.use(express.static(path.join(__dirname , '..' , 'public')))
        this.#app.use('/api-doc' , swaggerUI.serve , swaggerUI.setup(swaggerJSDoc({
            swaggerDefinition : {
                openapi : '3.0.0' ,
                info : {
                    title : 'online shop' ,
                    version : '1.0.0' ,
                    description : 'regular online shop'
                },
                servers : [
                {
                    url : 'http://localhost:3000'
                }
            ],
            components : {
                securitySchemes : {
                    BearerAuth : {
                        type : 'http' ,
                        scheme : 'bearer' ,
                        bearerFormat : 'JWT' 
                    }
                }
            },
            security : [{BearerAuth : [] }]
            }, apis : ['./app/router/*/*.js']
        }), {explorer : true}
    )
  )
}
    createServer(){
        const http = require('http')
        http.createServer(this.#app).listen(this.#PORT, () => {
            console.log('run > http://localhost:' + this.#PORT);
        })
    }
    connectToMongoDB(){
        mongoose.connect(this.#DB_URI , (error) => {
            if(!error) return console.log('connect to mongodb')
            return console.log(error.message);
            
        })
        process.on('SIGINT' , async() => {
            await mongoose.connection.close()
            process.exit(0);
        })
    } 
    initRedis(){
        require('./utils/init_redis')
    }
    createRoutes(){
        this.#app.use(AllRoutes)

    }
    errorHandling(){
        this.#app.use((req ,res , next) => {
            next(createError.NotFound('this page not found'))
            
        })
        this.#app.use((error , req , res , next) => {
            const serverError = createError.InternalServerError()
            const statusCode = error.status || serverError.status()
            const message = error.message || serverError.message;
            return res.status(statusCode).json({
                errors : {
                statusCode ,
                message ,
                serverError
            } 
        })
        })
    }
}