const express = require("express");
const { addClient, removeClient, addDashboardClient, removeDashboardClient } = require("../services/sse");
const { verifyUser } = require("../middleware/auth");
const sseRouter = express.Router();

sseRouter.get("/", async (req, res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader("X-Accel-Buffering", "no");
    
    const sdkKey = req.query.sdkKey;
    const envId = await addClient(sdkKey, res);
    req.on('close', () => {
        removeClient(envId, res);
        res.end();
    })
})


sseRouter.get("/dashboard", verifyUser, async (req, res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader("X-Accel-Buffering", "no");

    const environmentId = req.query.environment_id;
    addDashboardClient(res, environmentId);
    req.on('close', () => {
        removeDashboardClient(environmentId, res);
        res.end();
    })
})

module.exports = sseRouter;
