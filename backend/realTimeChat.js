const { storeNewChats } = require('./controllers/careController');
const adminIds = {};
const userIds = {};
const imageUrls = {};
const socketIds = {};


const chatSystem = (socket)=>{
    socket.on('careUser chat', async({name, userId, text})=>{ 
        //console.log(userId, text, name);
        await storeNewChats({adminId: -1,userId, text});
        for(let socketids of Object.values(adminIds)){
            for(let socketid of socketids){
                //console.log('sending to...', socketid, imageUrls[userId]);
                socket.to(socketid).emit('careUser chat',{name, userId, imageUrl: imageUrls[userId], text});
            }
        }
    })

    socket.on('careAdmin chat', async({adminId, userId,text})=>{
        //console.log(userId,text)
        await storeNewChats({adminId, userId, text});
        const socketIds = userIds[userId];
        if(socketIds===undefined) return;
        socketIds.forEach((socketid)=>{
            //console.log(socketid);
            socket.to(socketid).emit('unread chat',{count: 1});
            socket.to(socketid).emit('careAdmin chat',{adminId, text});
        })
    })

    socket.on('admins active', ({userId})=>{
        if(adminIds[userId] && socketIds[socket.id]) return;
        console.log('active admin',userId);
        if (!adminIds[userId]) {
            adminIds[userId] = [];
        }
        adminIds[userId].push(socket.id);
        socketIds[socket.id]= userId;
    })

    socket.on('users active', ({userId, imageUrl})=>{
        if(userIds[userId] && socketIds[socket.id]) return;
        console.log('active user',userId);
        if (!userIds[userId]) {
            userIds[userId] = [];
        }
        userIds[userId].push(socket.id);
        socketIds[socket.id]= userId;
        imageUrls[userId] = imageUrl;
    })

    socket.on('disconnect',()=>{
        if(userIds[socketIds[socket.id]] && userIds[socketIds[socket.id]].length>0) {
            userIds[socketIds[socket.id]]= userIds[socketIds[socket.id]].filter(socketid=>socketid!==socket.id);
            if(userIds[socketIds[socket.id]]) delete userIds[socketIds[socket.id]];
            console.log('user removed...');
        }
        console.log(socketIds[socket.id],adminIds[socketIds[socket.id]]);
        if(adminIds[socketIds[socket.id]] && adminIds[socketIds[socket.id]].length>0) {
            adminIds[socketIds[socket.id]]= adminIds[socketIds[socket.id]].filter(socketid=>socketid!==socket.id);
            if(adminIds[socketIds[socket.id]]) delete adminIds[socketIds[socket.id]];
            console.log('admin removed...');
        }
        delete imageUrls[socketIds[socket.id]];
        delete socketIds[socket.id];
        console.log('deactivated...', socket.id);
    })
}



module.exports = {chatSystem};