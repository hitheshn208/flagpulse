const path = require('path');
const app = require("./app");
const redisClient = require("./config/redis");
const db = require('./config/postgres');
require('dotenv').config({path: path.join(__dirname, "../.env")});

const port = process.env.PORT;
const serverStart = async ()=>{
    await redisClient.connect();
    app.listen(port, ()=>{
        console.log(`Server is online: http://localhost:${port}`)
    })
}
serverStart();

process.on('SIGINT', async ()=>{
    await redisClient.quit();
    await db.end()
    console.log("Server shutting down");
    process.exit(0);    
})