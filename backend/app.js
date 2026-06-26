const path = require('path');

const express = require('express');
const cookieParser = require("cookie-parser") ;
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, "../.env")});


const redisClient = require("./config/redis");
const db = require('./config/postgres');
const sdkRouter = require('./routes/sdk');
const authRouter = require("./routes/auth");
const projectRouter = require("./routes/projects");
const envRouter = require("./routes/environments");
const {verifyUser} = require("./middleware/auth")

const app = express();
app.use(express.json());
app.use(cookieParser())

//Test
app.get("/protected", verifyUser, (req, res)=>{
    return res.json({ message: "Protected Route", user: req.user})
})

//Routers
app.use("/api/v1",sdkRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", verifyUser, projectRouter);
app.use("/api/environments", verifyUser, envRouter);

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