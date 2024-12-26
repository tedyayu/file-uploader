const express=require('express');
const router=express.Router()
const userController=require('../controller/userController');
const fileFolderCreate=require('../controller/fileFolderCreate')

router.get('/login',userController.getLogin);
router.get('/signup',userController.getSignUp);
router.post('/signup',userController.registerUser);
router.post('/login',userController.loginUser);
router.get('/index',fileFolderCreate.getHome);
router.post('/create-folder',fileFolderCreate.createFolder);
router.post('/upload-file',fileFolderCreate.uploadFile);

module.exports=router;