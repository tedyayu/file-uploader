const express=require('express');
const passport=require('passport');
const session=require('express-session');
const path=require('path');
const userRoute=require('./router/userRouter');
const {PrismaSessionStore}=require('@quixo3/prisma-session-store');
const {PrismaClient}=require('@prisma/client')

const app=express();
const PORT=4000;

app.use(express.urlencoded({extended:false}));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.json());
app.use(
    session({
        cookie:{
            maxAge:7 * 24 * 60 * 60 * 1000
        },
        secret:'a santa at nasa',
        resave:true,
        saveUninitialized:true,
        store:new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod:2 * 60 * 1000,
                dbRecordIdIsSessionId:true,
                dbRecordIdFunction:undefined,
            }
        )
    })
)
app.use(passport.initialize());
app.use(passport.session());
app.use('/',userRoute);

app.listen(PORT,()=>{
    console.log(`app is running at port ${PORT}`);
});
