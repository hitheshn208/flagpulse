const express = require('express');
const cookieParser = require("cookie-parser") ;
const cors = require("cors");

const sdkRouter = require('./routes/sdk');
const authRouter = require("./routes/auth");
const projectRouter = require("./routes/projects");
const envRouter = require("./routes/environments");
const flagRouter = require("./routes/flags");
const sseRouter = require("./routes/sse");

const {verifyUser} = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const { testQuery } = require('./model/projectModel');

const app = express();
app.use(express.json());
app.use(cors({ 
    origin: ["http://localhost:5173", "http://127.0.0.1:5500", "http://127.0.0.1:5501", "http://localhost:5174"],
    credentials: true }));
app.use(cookieParser());

app.use((req, res, next)=>{
    console.log(req.method, req.path);
    // setTimeout(()=>{
    //     next();
    // }, 5000);
    next();
})


app.get("/protected", verifyUser, (req, res)=>{
    return res.json({ message: "Protected Route", user: req.user})
})

// app.get("/testQuery", async (req, res)=>{
//     const response = await testQuery();
//     return res.json(response)
// })

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

module.exports = app;