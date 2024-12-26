const fs=require('fs');
const path=require('path');
const multer=require('multer');
const os=require('os');


const baseDir = path.join(os.homedir(), 'Desktop', 'tedyFolder');

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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

function getHome(req, res) {
    const folders = fs.readdirSync(baseDir).filter((folder) => {
      return fs.statSync(path.join(baseDir, folder)).isDirectory();
    });
  
    const files = {};
    folders.forEach((folder) => {
      files[folder] = fs.readdirSync(path.join(baseDir, folder));
    });
  
    res.render('index', { folders, files });
}

function createFolder(req, res) {
    const folderName = req.body.folderName;
    const folderPath = path.join(baseDir, folderName);
  
    if (fs.existsSync(folderPath)) {
      return res.status(400).send(`Folder "${folderName}" already exists.`);
    }
  
    fs.mkdirSync(folderPath);
}

const uploadFile = [
    upload.single('file'),
    (req, res) => {
      res.redirect('/login');
    },
  ];

module.exports = {
    getHome,
    createFolder,
    uploadFile
};