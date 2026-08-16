const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({path: path.join(__dirname, "../../.env")});
const {findUserByEmail, createUser} = require("../model/authModel")
const AppError = require("../utils/AppError");

exports.registerUser = async (req, res)=>{
    const {name, email, password, confirmPassword} = req.body;
    
    if(!email || !password || !confirmPassword || !name)
        throw new AppError("Invalid credentials", 404);


    const isRegistered = await findUserByEmail(email);
    if(isRegistered)
        throw new AppError("User Already registererd", 400)

    if(password !== confirmPassword)
        throw new AppError("Passwords don't match", 400);

    const hashedpassword = await bcrypt.hash(password, 10);
    
    await createUser(name, email, hashedpassword);

    return res.status(201).json({
        message: "User registered successfully"
    })
}

exports.loginUser = async (req, res) => {

    const {email, password} = req.body;
    
    if(!email || !password)
        throw new AppError("Invalid credentials", 400)

    const user = await findUserByEmail(email);
    if(!user)
        throw new AppError("User doesn't exists", 404);


    const isMatched = await bcrypt.compare(password, user.password_hash)
    if(!isMatched)
        throw new AppError("Invalid password", 404);

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
        name: user.name,
        email: user.email,
        message: "Login successful",
    })
}