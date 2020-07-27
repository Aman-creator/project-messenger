const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const {userjoin,
      getCurrentUser,
      userLeave,
      getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public' ))); 
const botname = 'chat-on bot';

io.on('connection', socket => {
    console.log('new ws connection...');

    socket.on('joinroom', ({username, room}) => {

        const user = userjoin(socket.id, username, room);

        socket.join(user.room);

        //welcome current user
        socket.emit('message', formatMessage(botname,`Hey ${user.username} welcome to chat-on`));
    
        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('notice', formatMessage(botname, `${user.username} has joined the chat`));
        
        // send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //listen for chat message
    socket.on('chatmessage', msg => {
        const user = getCurrentUser(socket.id);

        socket.broadcast.to(user.room).emit('message',formatMessage(user.username, msg));
    });

    //broadcast when a user disconnects
    socket.on('disconnect', () => {
        var user = userLeave(socket.id);
        
        if(user){
            io.to(user.room).emit('notice', formatMessage(botname,`${user.username} has left the chat`));
            // send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        };
        //var specific = user.room;
        
         
        

    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
