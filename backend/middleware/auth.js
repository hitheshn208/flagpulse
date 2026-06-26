const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path: path.join(__dirname, "../../.env")});

exports.verifyUser = (req, res, next)=>{
    try{
        const token = req.cookies.token;

        if(!token)
            return res.status(401).json({
                message: "No token provided"
            })

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
        
    }catch(e){
        console.log(e);
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}