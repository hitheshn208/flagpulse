const {createClient} = require('redis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname, "../../.env")});

const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on('error', (err)=>{
    console.log("Redis error : ", err);
})

module.exports = redisClient;