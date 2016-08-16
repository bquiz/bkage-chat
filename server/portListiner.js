
module.exports = function(portfinder, server, colors){
    portfinder.basePort = 80;	//default port
    portfinder.getPort(function (err, port) {
        server.listen(80);
        console.log(colors.green('IOChat running on port:80 ' + port));
    });
};