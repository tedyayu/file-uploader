const model=require('../models/index');
const{body,validationResult}=require('express-validator')
const bcrypt=require('bcrypt')


const getSignUp=(req,res)=>{
    res.render('signup')
}

const alphabeterror="must contan only letters";
const lengtherror="must be between 1 and 20 character";
const validateUser=[
    body('username').trim()
        .isAlpha().withMessage(`username ${alphabeterror}`)
        .isLength({min:1,max:20}).withMessage(`username ${lengtherror}`),
    body('email').trim()
        .isEmail().withMessage("email must be valid email address")
        .isLength({min:1,max:20}).withMessage(`email ${lengtherror}`)
        .custom(async (value)=>{
            const user=await model.getUserByEmail(value);
            if(user){
                throw new Error("email is already registered")
            }
        }),
    body('password').trim()
        .isLength({min:1,max:20}).withMessage(`password ${lengtherror}`),
    body('confirm_password').trim()
        .isLength({min:1,max:20}).withMessage(`password ${lengtherror}`)
        .custom( (value,{req})=>{
            if(value!==req.body.password){
                throw new Error ("Password do not match");
            }
            return true;
        })
]


const registerUser=[
    validateUser,
    (req,res,next)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            console.log("Validation errors:", errors.array());
            return res.status(400).render('signup',{errors:errors.array()})
            
        }
        const{username,email,password}=req.body;

        bcrypt.hash(password,10,async(err,hashedPassword)=>{
            if(err){
                console.error("error hashing password",err.stack)
                return next(err);
            }
            try{
                await model.createUser(username,email,hashedPassword);
                console.log("user created succssesfully");
                res.redirect('/login')
            }catch(err){
                console.error("error creating user: ",err.message);
                return next(err)
            }
        })
        
        
    }
    
]

const getLogin= (req,res)=>{
    res.render('login')
}


module.exports={getLogin,getSignUp,registerUser};