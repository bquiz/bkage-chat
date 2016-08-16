

module.exports = function(socket){
    socket.on('join room', function(roomName){
        socket.join(roomName);
        socket.currentRoom = roomName;
        console.log('User ' + socket.username + ' joined room ' + roomName);
    });
}
