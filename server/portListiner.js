
module.exports = function(portfinder, server, colors){
    portfinder.basePort = 80;	//default port
    portfinder.getPort(function (err, port) {
        server.listen(port);
        console.log(colors.green('IOChat running on port: ' + port));
    });
}; 