

module.exports = function(socket, appArrays, colors){
    appArrays.connections.push(socket);
    console.log(colors.blue('Connected: %s sockets connected'), appArrays.connections.length);

    

};