const express = require("express");
const { addClient, removeClient } = require("../services/sse");
const sseRouter = express.Router();

sseRouter.get("/", async (req, res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    console.log("Connection recieved");
    
    const sdkKey = req.query.sdkKey;
    const envId = await addClient(sdkKey, res);
    console.log("Client connected for env:", envId)
    
    
    req.on('close', () => {
        console.log("Connection closing for ", envId, res);
        removeClient(envId, res);
        res.end();
    })
})

module.exports = sseRouter;
