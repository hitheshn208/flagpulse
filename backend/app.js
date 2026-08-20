const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const sdkRouter = require('./routes/sdk');
const authRouter = require("./routes/auth");
const projectRouter = require("./routes/projects");
const envRouter = require("./routes/environments");
const flagRouter = require("./routes/flags");
const sseRouter = require("./routes/sse");

const { verifyUser } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const { testQuery } = require('./model/projectModel');
const projectOriginCors = require('./utils/projectOriginCors');

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})

app.use("/api/v1/stream", projectOriginCors, sseRouter);
app.use("/api/v1", projectOriginCors, sdkRouter);

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
app.use("/api/auth", authRouter);
app.use("/api/projects", verifyUser, projectRouter);
app.use("/api/environments", verifyUser, envRouter);

app.use("/api/flags", verifyUser, flagRouter);

app.use(errorHandler);

app.use((req, res) => {
    return res.status(404).json({
        message: `Page not found for route ${req.path}`
    })
})

module.exports = app;