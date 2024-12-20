const lodash = require('lodash');
const { Global } = require('../helpers/globalUsers');

module.exports = function(io) {

    const users = new Global();

    io.on('connection', (socket) => {

        socket.on('global room', (global) => {
            socket.join(global.room);

            users.enterRoom(socket.id, global.name, global.room, global.image);

            var userProp = users.getRoomList(global.room);
            //get names only one time from nameProp array
            const unique = lodash.uniqBy(userProp, 'name');
                                //OR
            // let myMap = new Map();
            // const unique =  userProp.filter((u) => {
            //     const val = myMap.get(u.name);
            //     if(val) {
            //         if(u.id < val) {
            //             myMap.delete(u.name);
            //             myMap.set(u.name, u.id);
            //             return true;
            //         } else {
            //             return false;
            //         }
            //     }
            //     myMap.set(u.name, u.id);
            //     return true;
            // });
            // console.log(unique);
            io.to(global.room).emit('loggedInUser', unique);

        });

        socket.on('disconnect', () => {
            const user = users.removeUser(socket.id);
            if(user) {
                var userData = users.getRoomList(user.room);
                const unique = lodash.uniqBy(userData, 'name');
                const removeData = lodash.remove(unique, {'name': user.name});
                io.to(user.room).emit('loggedInUser', unique);
            }
        });

    });

}