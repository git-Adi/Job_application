// error middleware || Next function
const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    const defaultErrors = {
        statusCode: 500,
        message: err
    }
    // res.status(500).send({
    //     success: false,
    //     message: "Something went wrong",
    //     err,
    // });
    if(err.name=='ValidationError'){
        defaultErrors.statusCode = 400
        defaultErrors.message = Object.values(err.errors).map(item => item.message).join(',')
    }
    // if(err.code && err.code == 11000){
    //     defaultErrors.statusCode = 400;
    //     defaultErrors.message = `${Object.keys(err.keyValue)} field has to be unique`
    // } we can do this for express-async-error but we have to comment out the fiel existinguser in the authController.js and same message will be displayed 
    res.status(defaultErrors.statusCode).json({message: defaultErrors.message});
};

export default errorMiddleware;