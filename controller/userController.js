const model=require('../models/index')

const getLogin= (req,res)=>{
    res.render('login')
}
const getSignUp=(req,res)=>{
    res.render('signup')
}
const registerUser=async (req,res)=>{
    const{username,email,password}=req.body;
    await model.createUser(username,email,password);
    
}

module.exports={getLogin,getSignUp,registerUser};