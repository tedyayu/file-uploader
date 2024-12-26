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

module.exports={createUser,getUserByEmail,getUserByUsername,getUserById};