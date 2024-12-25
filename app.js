const express=require('express');
const passport=require('passport');
const session=require('express-session');
const path=require('path');
const userRoute=require('./router/userRouter');

const app=express();
const PORT=4000;

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({secret:"cats",resave:false,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/',userRoute);

app.listen(PORT,()=>{
    console.log(`app is running at port ${PORT}`);
});
