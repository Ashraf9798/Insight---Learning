class Global {
    constructor() {
        this.globalRoom = [];
    }

    enterRoom(id, name, room, img) {
        var user = { id, name, room, img };
        this.globalRoom.push(user);
        return user;
    }

    getRoomList(room) {
        var users = this.globalRoom.filter((u) => {
            return u.room === room;
        });
        var nameArr = this.globalRoom.map((user) => {
            return { name: user.name, image: user.img };
        });
        return nameArr;
    }

    getUserId(id) {
        var getId = this.globalRoom.filter((userId) => {
            return userId.id === id;
        })[0];
        return getId;
    }

    removeUser(id) {
        var removedUser = this.getUserId(id);
        if(removedUser) {
            this.user = this.globalRoom.filter((u) => {
                return u.id !== id
            });
        }
        return removedUser; 
    }
}

module.exports = { Global };