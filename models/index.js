const {PrismaClient}=require('@prisma/client')
const prisma=new PrismaClient()


async function createUser(username,email,password) {
    try {
        const user=await prisma.user.create({
            data:{
                name:username,
                email:email,
                password:password
            }
        });
     
        console.log('User created:', user);
    } catch (err) {
        console.error('error creating user:',err)
        throw new Error('error creating user');
    }
}
async function getUserByEmail(email) {
    try {
        const user=await prisma.user.findUnique({
            where:{email:email}
        });
        return user
    } catch (err) {
        console.error("error finding user by email",err.message)
    }
}

async function getUserByUsername(username) {
    try {
        const user=await prisma.user.findFirst({
            where:{name:username}
        });
        return user;
    } catch (err) {
        console.error("error finding user by username",err.message)
    }
}

async function getUserById(id) {
    try {
        const user=await prisma.user.findFirst({
            where:{id:id}
        });
        return user;
    } catch (err) {
        console.error("error finding user by id",err.message)
    }
}

async function getFolders() {
    const folders=await prisma.folder.findMany();
    return  folders;
}

async function getFiles() {
    const files=await prisma.file.findMany({
        include:{
            folder:true
        }
    })
    return files;
}
async function deleteFolder(folderId) {
    console.log("Deleting folder with ID:", folderId); // Debugging
    if (!folderId) {
        throw new Error("Folder ID is undefined");
    }
    await prisma.folder.delete({
        where:{
            id:folderId
        }
    })
}

async function createFolder(folderName) {
    await prisma.folder.create({
        data:{
            name:folderName
        }
    })
   
    
}

async function uploadFileToDatabase(req,fileUrl,folderId) {
    try {
        //console.log('Debugging req.file:', req.file);
        await prisma.file.create({
            data:{
                name:req.file.originalname,
                size:req.file.size,
                uploadTime:new Date(),
                folderId:parseInt(folderId),
                fileUrl:fileUrl,
                
            }
        })
       
    } catch (err) {
        console.error('Error uploading file to database:', err.message); 
        throw new Error('Error uploading file to database');
    }
    
}

async function getFileById(fileId) {
    const file=await prisma.folder.findUnique({
        where:{
            id:parseInt(fileId)
        }
    })
    return file;
}



async function getFolderByFolderName(folderName) {
    try {
        const folder=await prisma.folder.findFirst({
            where:{
                name:folderName
            }
        });
        return folder;
    } catch (err) {
        console.error('error finding folder by name',err.message);
    }
    
}

async function getFolderById(folderId) {
    const folder=await prisma.folder.findFirst({
        where:{
            id:folderId
        }
    });
    return folder
}

async function deleteFileByFolderId(folderId) {
    await prisma.file.deleteMany({
        where:{
            folderId:folderId
        }
    })
}
module.exports={createUser,
              getUserByEmail,
              getUserByUsername,
              getUserById,
              getFolders,getFiles
              ,createFolder,
              uploadFileToDatabase
              ,getFileById,
              deleteFolder,
              getFolderByFolderName,
              getFolderById,
              deleteFileByFolderId};