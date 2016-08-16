
module.exports = function(portfinder, server, colors){
    portfinder.basePort = 80;	//default port
    app.set('port', (process.env.PORT || 5000))
    server.listen(app.get('port'), function(){
       console.log('app is running');
    });
    // portfinder.getPort(function (err, port) {
    //     server.listen(80);
    //     console.log(colors.green('IOChat running on port:80 ' + port));
    // });
};