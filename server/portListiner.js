
module.exports = function(portfinder, server, colors, app){

    // app.set('port', (process.env.PORT || 3000 || 3003))
    // server.listen(app.get('port'), function(){
    //    console.log('Chat running on port: ' + app.get('port'));
    // });

    portfinder.basePort = process.env.PORT || 3000;	//default port
    portfinder.getPort(function (err, port) {
        server.listen(port);
        console.log(colors.green('IOChat running on port: ' + port));
    });
};