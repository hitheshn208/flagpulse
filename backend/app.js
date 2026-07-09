const path = require('path');

const express = require('express');
const cookieParser = require("cookie-parser") ;
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, "../.env")});
const cors = require("cors");


const redisClient = require("./config/redis");
const db = require('./config/postgres');
const sdkRouter = require('./routes/sdk');
const authRouter = require("./routes/auth");
const projectRouter = require("./routes/projects");
const envRouter = require("./routes/environments");
const flagRouter = require("./routes/flags");
const sseRouter = require("./routes/sse");

const {verifyUser} = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler")

const app = express();
app.use(express.json());
app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true }));
app.use(cookieParser());
app.use((req, res, next)=>{
    console.log(req.method, req.path);
    next();
})

//Test
app.get("/protected", verifyUser, (req, res)=>{
    return res.json({ message: "Protected Route", user: req.user})
})

//Routers
app.use("/api/v1/stream", sseRouter);
app.use("/api/v1",sdkRouter);
app.use("/api/auth", authRouter);
app.use("/api/projects", verifyUser, projectRouter);
app.use("/api/environments", verifyUser, envRouter);
app.use("/api/flags", verifyUser, flagRouter);

app.use(errorHandler);

app.use((req, res)=>{
    return res.status(404).json({
        message: `Page not found for route ${req.path}`
    })
})

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