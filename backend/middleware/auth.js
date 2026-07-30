const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const AppError = require("../utils/AppError");
dotenv.config({path: path.join(__dirname, "../../.env")});

exports.verifyUser = (req, res, next)=>{
    const token = req.cookies.token;

    if(!token)
        throw new AppError("No token provided", 401);
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(e){
        throw new AppError("Unauthorized", 401);
    }
}