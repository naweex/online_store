const express = require('express')
const {default : mongoose} = require('mongoose')
const path = require('path')
const createError = require('http-errors')
const { AllRoutes } = require('./router/router')
const morgan = require('morgan')
mongoose.set('strictQuery', true);

module.exports = class application {
    #app = express()
    #DB_URI
    #PORT
    constructor(PORT , DB_URI){
        this.#PORT = PORT
        this.#DB_URI =DB_URI
        this.configApplication();
        this.connectToMongoDB();
        this.createServer();
        this.createRoutes();
        this.errorHandling();
    }
    configApplication(){
        this.#app.use(morgan("dev"))
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({extends : true}))
        this.#app.use(express.static(path.join(__dirname , '..' , 'public')))

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
                message
            } 
        })
        })
    }
}