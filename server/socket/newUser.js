

module.exports = function(socket, appArrays, appHelpers){
    socket.on('new user', function(data, callback){
        callback(true);

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

        //get all messages
        console.log('showing messages from ' + data.selectedRoom);

        var printHTML = '',
            currentRoomArray = appArrays.rooms[data.selectedRoom].messages;

        for(var i = 0; i < currentRoomArray.length; i++){
            if(currentRoomArray[i].type === 'info'){
                printHTML += '<li class="alert alert-info" role="alert"><strong>' + currentRoomArray[i].author + ':</strong>' + currentRoomArray[i].msg + '</li>';
            }
            else{
                printHTML += '<li class="single-message well"><strong>' + currentRoomArray[i].author + ':</strong>' + currentRoomArray[i].msg + '</li>';
            }

        }
        socket.emit('connected', printHTML);
        appHelpers.notifyUsers('User "' + data.username + '" joined room ' + socket.currentRoom, 'info', socket.currentRoom);
    });
};