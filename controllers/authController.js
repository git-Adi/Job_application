import userModels from "../models/userModels.js";

export const registerController = async(req, res, next) => {
    // try{  using express-asyn-error
        const {name, email, password} = req.body;
        // validate
        if(!name){
            // return res.status(400).send({success:'false',message:'please provide your name'})
            next("name is required");
        }
        if(!email){
            // return res.status(400).send({success:'false',message:'please provide your email'})
            next("please provide your email id")
        }
        if(!password){
            // return res.status(400).send({success:'false',message:'please provide your password'})
            next("please provide your password")
        }
        const existingUser = await userModels.findOne({email})
        if(existingUser){
            // return res.status(200).send({
            //     success:false,
            //     message:'email already registered pleas login'
            // })
            next("email already registered with some user")
        }
        const user = await userModels.create({name, email, password});
        // token
        const token = user.createJWT()
        res.status(200).send({
            success: true,
            message:'user registered successfully',
            user:{
                name: user.name,
                lastname: user.lastName,
                email: user.email,
                location: user.location // no password visible on postman
            },
            token,
        })
    // }
    // catch (error){
    //     // console.log(error);
    //     next(error);
    // }
};

export const loginController = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        next('Please provide all fields')
    }

    const user = await userModels.findOne({email})
    if(!user){
        next('Invalid username or password')
    }
    // compare password
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        return next('Invalid Username or Password')
    }
    const token = user.createJWT();
    res.status(200).json({
        success:true,
        message: "Login Successful",
        user,
        token,
    })
}