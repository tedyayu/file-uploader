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

module.exports={createUser};