
module.exports = function(app, express, baseDirectory){

    app.get('/', function(req, res){
        res.sendFile(baseDirectory + '/index.html');
    });
    //serve external files
    app.use('/static', express.static(baseDirectory + '/public'));


};