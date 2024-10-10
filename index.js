const application = require('./app/server')
new application(3000 , 'mongodb://localhost:27017/storeDB')
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017"

const connectToMongo = async () => {
try {
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI) 
    console.log('Mongo connected')
}
catch(error) {
    console.log(error)
    process.exit()
}
}
module.exports = connectToMongo;