

const getLogin= (req,res)=>{
    res.render('login')
}
const getSignUp=(req,res)=>{
    res.render('signup')
}

module.exports={getLogin,getSignUp};