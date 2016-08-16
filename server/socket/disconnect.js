

module.exports = function(socket, appArrays, appHelpers, colors){
    socket.on('disconnect', function(){
        //disconnect
        appArrays.connections.splice(appArrays.connections.indexOf(socket), 1);

        if(socket.username){
            appArrays.rooms[socket.currentRoom].users.splice(appArrays.rooms[socket.currentRoom].users.indexOf(socket.username), 1);
            if(socket.currentRoom.length){
                appHelpers.notifyUsers('User "' + socket.username + '" left room');
            }

        }
        appHelpers.updateUsers(socket.currentRoom);
        console.log(colors.red('Disconnected: %s sockets connected'), appArrays.connections.length);
    });
};