const app = require("./app");
const redisClient = require("./config/redis");
const db = require('./config/postgres');
const syncCorsOrigins = require('./utils/syncCorsOrigins');

const serverStart = async ()=>{
    await redisClient.connect();
    await syncCorsOrigins();
    app.listen(3000, "0.0.0.0",()=>{
        console.log(`Server is online`)
    })
}
serverStart().catch(err => {
    console.error("Server startup failed:", err);
    process.exit(1);
});

process.on('SIGINT', async ()=>{
    await redisClient.del("cors:origin"); //^Removing the origins used for CORS
    await redisClient.quit();
    await db.end()
    console.log("Server shutting down");
    process.exit(0);    
})