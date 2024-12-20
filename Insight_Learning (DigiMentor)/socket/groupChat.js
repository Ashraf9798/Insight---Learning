const { onlineUsers } = require('../helpers/userClass');

module.exports = function(io) {

    const users = new onlineUsers();

    io.on('connection', (socket) => { 

        socket.on('join', (params, cb) => {

            socket.join(params.room);

            users.addUserData(socket.id, params.name, params.room);

            io.to(params.room).emit('userList', users.getUserList(params.room));

            cb();
        });

        socket.on('createMessage', (msg, cb) => {
            io.to(msg.room).emit('newMessage', {
                text: msg.text,
                room: msg.room,
                from: msg.sender
            });
            cb();
        });

        socket.on('disconnect', () => {
            var user = users.removeUser(socket.id);
            if(user) {
                io.to(user.room).emit('userList', users.getUserList(user.room));
            }
        });
    });

}