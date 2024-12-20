class onlineUsers {
    constructor() {
        this.user = [];
    }
    addUserData(id, name, room) {
        var user = { id, name, room };
        this.user.push(user);
        return user;
    }

    getUserId(id) {
        var getId = this.user.filter((userId) => {
            return userId.id === id;
        })[0];
        return getId;
    }

    removeUser(id) {
        var removedUser = this.getUserId(id);
        if(removedUser) {
            this.user = this.user.filter((u) => {
                return u.id !== id
            });
        }
        return removedUser; 
    }

    getUserList(room) {
        var users = this.user.filter((u) => {
            return u.room === room;
        });
        var nameArr = users.map((u) => {
            return u.name;
        });
        return nameArr;
    }
}

module.exports = { onlineUsers };