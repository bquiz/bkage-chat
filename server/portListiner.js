
module.exports = function(portfinder, server, colors){
    portfinder.basePort = 3000;	//default port
    portfinder.getPort(function (err, port) {
        server.listen(port);
        console.log(colors.green('IOChat running on port: ' + port));
    });
};