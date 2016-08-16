//global config
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	portfinder = require('portfinder'),
	colors = require('colors'),
	io = require('socket.io').listen(server),
    baseDirectory = __dirname;


//port listiner
var portListiner = require('./server/portListiner')(portfinder, server, colors, app);

//express node config
var expressConfig = require('./server/expressConfig')(app, express, baseDirectory);


//global arrays
var appArrays = {
    connections: [],
    messages: [],
    rooms: {
        public: {
            users: [],
            messages: []
        },
        private: {
            users: [],
            messages: []
        },
    },
};

var appHelpers = {
    updateUsers: function(roomName){
        roomName = roomName || 'public';
        vipNamespace.to(roomName).emit('update users', appArrays.rooms[roomName].users);
    },
    notifyUsers: function(message, type, roomName){
        type = type || 'info';
        roomName = roomName || 'public';
        appArrays.rooms[roomName].messages.push({msg:message, author: 'System', type: type});
        vipNamespace.to(roomName).emit('new message', {msg: message, author: 'System', type: type});
    },
    checkIfUsernameExist: function(testName){
        var checker = false;
        
        for(var room in appArrays.rooms){
          if(appArrays.rooms.hasOwnProperty(room)){
              if(appArrays.rooms[room].users.indexOf(testName) > -1){
                  checker = true
              }
          }
            //forbid System name
            if(testName === 'System'){
                checker = true;
            }
}
        return checker;
    },
}


//create room
var vipNamespace = io.of('/vip');
vipNamespace.on('connection', function(socket){
    console.log('connected to vip namespace');
    require('./server/socket/connected')(socket, appArrays, colors);

    require('./server/socket/disconnect')(socket, appArrays, appHelpers, colors);

    require('./server/socket/sendMessage')(appArrays, socket, vipNamespace);

    require('./server/socket/newUser')(socket, appArrays, appHelpers);

    require('./server/socket/joinRoom')(socket);

    require('./server/socket/leaveRoom')(socket, appArrays, appHelpers);


});