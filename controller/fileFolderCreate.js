const fs=require('fs');
const path=require('path');
const multer=require('multer');
const os=require('os');
const model=require('../models/index');


const baseDir = path.join(os.homedir(), 'Desktop', 'tedyFolder');

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('req.body.folderName:', req.body.folderName);
      const folderPath = path.join(baseDir, req.body.folderName);
      if (!fs.existsSync(folderPath)) {
        return cb(new Error(`Folder "${req.body.folderName}" does not exist`));
      }
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

const upload = multer({ storage });

async function getHome(req, res) {
    // const folders = fs.readdirSync(baseDir).filter((folder) => {
    //   return fs.statSync(path.join(baseDir, folder)).isDirectory();
    // });
  
    // const files = {};
    // folders.forEach((folder) => {
    //   files[folder] = fs.readdirSync(path.join(baseDir, folder));
    // });
    try {
        const folders=await model.getFolders();
        const files=await model.getFiles();
        res.render('index',{folders,files})
    } catch (err) {
        res.status(400).send('error fetching folder and file');
        console.error('Error occurred while fetching folders and files:', err.message);
    }

  
    //res.render('index', { folders, files });
}

async function createFolder(req, res) {
    const folderName = req.body.folderName;
    const folderPath = path.join(baseDir, folderName);
    
    try {
        if (fs.existsSync(folderPath)) {
            return res.status(400).send(`Folder "${folderName}" already exists.`);
          }
        
          fs.mkdirSync(folderPath);
      
          await model.createFolder(folderName);
      
          res.redirect('/index')
    } catch (err) {
        res.status(500).send('Error creating folder');
        console.log('error creating folder')
    }
    
}

async function deleteFolder(req,res) {
    const {folderId}=req.params.id;
    try {
        const folder=model.deleteFolder(folderId)
        const folderPath=path.join(baseDir,folder.name);
        fs.rmdirSync(folderPath,{recursive:true});
        res.redirect('/')
    } catch (err) {
        res.status(500).send('Error deleting folder');
        console.log('Error deleting folder');
    }
}

const uploadFile = [
    upload.single('file'),
    async (req, res) => {

        try {
            const fileUrl=await uploadFileToSupabase(req.file);
            await model.uploadFileToDatabase(req,fileUrl)
            res.redirect('/index');
        } catch (err) {
            res.status(500).send('Error uploading file');
            console.error('Error uploading file',err.stack)
        }
      
    },
  ];

async function uploadFileToSupabase(file) {
    const{createClient}=require('@supabase/supabase-js');
    const SUPABASE_URL="https://ctiadhokdntaijgvpibr.supabase.co"
    const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWFkaG9rZG50YWlqZ3ZwaWJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTIyNDI3NSwiZXhwIjoyMDUwODAwMjc1fQ.pgxSfulUYjPE93h3FNkcDUPrqJQMFVJ7mW42GNYoS6g"

    const supabase=createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const {data,error}=await supabase.storage
        .from('files')
        .upload(`public/${file.filename}`,file.path,{
            cacheControl: '3600',
            upsert: false
        })

    if (error){
        throw new Error(error.message);
    }
    const fileUrl=`${SUPABASE_URL}/storage/v1/object/public/files/public/${file.filename}`
    return fileUrl;
}

async function viewFileDetails(req,res) {
    const {fileId}=req.params;
    try {
        const file=model.getFileById(fileId)
        res.render('fileDetal',{file});
    } catch (error) {
        res.status(500).send('Error fetching file detail')
    }
}

module.exports = {
    getHome,
    createFolder,
    uploadFile,
    deleteFolder,
    viewFileDetails
};