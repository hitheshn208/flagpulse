const express = require("express");
const { getEnvId } = require("../model/sdkModel");
const sseRouter = express.Router();

const connections = new Map();

sseRouter.get("/", async (req, res)=>{
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    console.log("Connection recieved");

    const sdkKey = req.get("x-sdk-key");
    const envId = await addClient(sdkKey, res);

    req.on('close', () => {
        console.log("Connection closed");
        removeClient(envId, res);
        res.end();
    })
})

module.exports = sseRouter;


const addClient = async (sdkKey, res)=>{
    const envId = await getEnvId(sdkKey);

    if(!connections.has(envId))
        connections.set(envId, []);
    connections.get(envId).push(res);                                                                                                                                          
    console.log("Connection set");
    return envId;
}

const removeClient = async (envId, res)=>{
    const envClients = connections.get(envId);
    if(envClients){
        const updated = envClients.filter(client => client !== res);
        connections.set(envId, updated);
        console.log("Removed a client");
    }
}

exports.sendClient = async (envId, data) => {
    const envClients = connections.get(envId);
    if(!envClients)
        return;
    envClients.forEach(res => {
        res.write(`data: ${JSON.stringify(data)}\n\n`)
    });
}