const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path: path.join(__dirname, "../../.env")});
const {findUserByEmail, createUser} = require("../model/authModel")

exports.registerUser = async (req, res)=>{
    try{
        const {email, password} = req.body;
        
        if(!email || !password)
            return res.status(400).json({
            message: "Email and password required"
        })

        const isRegistered = await findUserByEmail(email);
        if(isRegistered)
            return res.status(400).json({
                message: "User already registered"
        })

        const hashedpassword = await bcrypt.hash(password, 10);
        
        await createUser(email, hashedpassword);

        return res.status(201).json({
            message: "User registered successfully"
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

exports.loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        
        if(!email || !password)
            return res.status(401).json({
            message: "Invalid Credentials"
        })

        const user = await findUserByEmail(email);
        if(!user)
            return res.status(401).json({
                message: "User doesn't exists"
            })

        const isMatched = await bcrypt.compare(password, user.password_hash)
        if(!isMatched)
            return res.status(401).json({
                message: "Invalid Credentials"
            })

        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000
        })
        
        return res.status(200).json({
            message: "Login successful",
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        })
    } 
}