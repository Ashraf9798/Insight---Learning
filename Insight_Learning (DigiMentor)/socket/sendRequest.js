
module.exports = function(io) {

    io.on('connection', (socket) => {

        socket.on('joinRequest', (myReq, cb) => {
            // console.log(myReq);
            socket.join(myReq.sender); 
            cb();
        });

        socket.on('friendReq', (frnd, cb) => {
            // console.log(frnd.receiver);
            io.to(frnd.receiver).emit('newFriendReq', {
                from: frnd.sender,
                to: frnd.receiver
            });
            cb();
        });

    });

}