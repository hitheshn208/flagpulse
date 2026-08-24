const {createClient} = require('redis');

const redisClient = createClient({
    url: "redis://redis:6379"
})

redisClient.on('error', (err)=>{
    console.log("Redis error : ", err);
})

module.exports = redisClient;