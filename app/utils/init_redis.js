const redisDB = require('redis');
const redisClient = redisDB.createClient();
redisClient.connect();
redisClient.on('connect' , () => console.log('connect to redis'))
redisClient.on('ready' , () => console.log('connected to redis and ready to use'))
redisClient.on('error' , (err) => console.log('redis error: ' , err.message))
redisClient.on('END' , () => console.log('redis disconnected'))

module.exports = redisClient