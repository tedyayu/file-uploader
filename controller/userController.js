const model=require('../models/index');
const{body,validationResult}=require('express-validator')
const bcrypt=require('bcrypt')
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy;


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

passport.use(
    new LocalStrategy(
        async (username,password,done)=>{
            console.log("LocalStrategy called with:", { username, password });
            try {
                const user=await model.getUserByUsername(username);
                if(!user){
                    console.log("no user is found in this username")
                    return done(null,false,{message:"Incorrect username"})
                }
                const matchedPassword=await bcrypt.compare(password,user.password);

                if(!matchedPassword){
                    console.log("Password does not match");
                    return done(null,false,{message:"Incorrect password"})
                }

                return done(null,user);
            } catch (err) {
                return done(err);
            }
        }
    )
)
passport.serializeUser((user,done)=>{
    done(null,user.id)
});
passport.deserializeUser(async(id,done)=>{
    try {
        const user=await model.getUserById(id)
        done(null,user)
    } catch (err) {
        done(err)
    }
})
const loginUser=(req,res)=>{
    passport.authenticate("local",{
        successRedirect:"/index",
        failureRedirect:"/signup"
    })(req,res)
}




module.exports={getLogin,getSignUp,registerUser,loginUser};