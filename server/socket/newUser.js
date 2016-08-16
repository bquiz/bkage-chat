

module.exports = function(socket, appArrays, appHelpers){
    socket.on('new user', function(data, callback){

        usernameExist = appHelpers.checkIfUsernameExist(data.username);
        callback(!usernameExist);
        if(usernameExist === false){
            //put username in socket and push to global array
            socket.username = data.username;
            appArrays.rooms[data.selectedRoom].users.push(data.username);

            //for some reason this emit is not working
            socket.emit('join room', data.selectedRoom);
            socket.join(data.selectedRoom);
            socket.currentRoom = data.selectedRoom;

            //clear chat
            socket.emit('clear chat');

            //update user list
            appHelpers.updateUsers(socket.currentRoom);

            //get all posts 
            socket.emit('connected', appArrays.rooms[data.selectedRoom].messages);
            appHelpers.notifyUsers('User "' + data.username + '" joined room ' + socket.currentRoom, 'info', socket.currentRoom);
        }

    });
};