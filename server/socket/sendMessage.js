

module.exports = function(appArrays, socket, namespace){
    socket.on('send message', function(data){
        appArrays.rooms[socket.currentRoom].messages.push({msg:data, author: socket.username, type:'message'});
        namespace.to(socket.currentRoom).emit('new message', {msg: data, author: socket.username, type: 'message'});
        console.log(appArrays.rooms);
    });
}