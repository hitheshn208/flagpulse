const errorHandler = (err, req, res, next)=>{
    console.log(err);
    const statusCode = err.statusCode || 500;
    const message = (`${statusCode}`.startsWith("5") ? "Internal server Error" : err.message) || "Internal server error";

    res.status(statusCode).json({
        success: false,
        message
    })
};

module.exports = errorHandler;