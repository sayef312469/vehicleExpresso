const { storeNewChats } = require('./controllers/careController');
const adminIds = {};
const userIds = {};
const imageUrls = {};


const chatSystem = (socket)=>{
    socket.on('careUser chat', async({name, userId, text})=>{ 
        console.log(userId, text, name);
        await storeNewChats({adminId: -1,userId, text});
        for(let socketid of Object.values(adminIds)){
            console.log('sending to...', socketid);
            socket.to(socketid).emit('careUser chat',{name, userId, imageUrl: imageUrls[userId], text});
        }
    })

    socket.on('careAdmin chat', async({adminId, userId, imageUrl, text})=>{
        console.log(userId, imageUrl, text)
        await storeNewChats({adminId, userId, text});
        socket.to(userIds[userId]).emit('unread chat',{count: 1});
        socket.to(userIds[userId]).emit('careAdmin chat',{adminId, imageUrl, text});
    })

    socket.on('admins active', (userId)=>{
        console.log('admin',userId);
        adminIds[userId] = socket.id;
    })

    socket.on('users active', ({userId, imageUrl})=>{
        console.log('user',userId);
        userIds[userId] = socket.id;
        imageUrls[userId] = imageUrl;
    })
}



module.exports = {chatSystem};