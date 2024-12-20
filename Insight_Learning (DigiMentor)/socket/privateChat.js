module.exports = function(io) {

    io.on('connection', (socket) => {

        socket.on('Join PM', (dm) => {
            socket.join(dm.room1);
            socket.join(dm.room2);
        });

        socket.on('privateMessage', (msg, cb) => {
            io.to(msg.room).emit('new message', {
                text: msg.text,
                sender: msg.sender
            });
            io.emit('messageDisplay', {});
            cb();
        });
        socket.on('refresh', function() {
            io.emit('new refresh', {});
        });

    });

}