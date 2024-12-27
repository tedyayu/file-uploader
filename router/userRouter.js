const express=require('express');
const router=express.Router()
const userController=require('../controller/userController');
const fileFolderCreate=require('../controller/fileFolderCreate');
const testController=require('../models/index')

router.get('/login',userController.getLogin);
router.get('/signup',userController.getSignUp);
router.post('/signup',userController.registerUser);
router.post('/login',userController.loginUser);
router.get('/index',fileFolderCreate.getHome);
router.post('/create-folder',fileFolderCreate.createFolder);
router.post('/upload-file',fileFolderCreate.uploadFile);
router.post('/delete-folder/:id',fileFolderCreate.deleteFolder);
router.get('/text',testController.testCreate);


module.exports=router;