


module.exports = function(socket, appArrays, appHelpers){
    socket.on('leave room', function(roomName){
        socket.leave(roomName);

        console.log('User ' + socket.username + ' left room ' + roomName);

        appArrays.rooms[roomName].users.splice(appArrays.rooms[roomName].users.indexOf(socket.username), 1);
        socket.currentRoom = '';

        appHelpers.notifyUsers('User "' + socket.username + '" left room','', roomName);
        appHelpers.updateUsers(roomName);


    });
}