var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http, {'pingInterval': 2000, 'pingTimeout': 5000});

var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var https = require('https').Server(credentials,app);

app.use(express.static('public'));
app.get('/gameserver', function(req, res){
  res.sendFile(__dirname + '/gameserver.html');
});
app.get('/controller', function(req, res){
  res.sendFile(__dirname + '/controller.html');
});
var game = {
	id : '',
	status : 0
};

var players = [];

io.on('connection', function(socket){
  console.log('a user connected');
	socket.on('game_server_is_ready', function(msg){
		game.status = 1;
		game.id = socket.id;
    	console.log('message: ' + msg);
    	socket.to(game.id).emit('playes_list',players);
  });

	socket.on('player_join', function(msg){
		let player = {id:socket.id,x:Math.random()*832,y:Math.random()*520,rotation:Math.random()*360, speed : 1} 
		players.push(player);
    	console.log('message: ' + msg);
    	console.log(players);
    	socket.to(game.id).emit('player_join',player);
  	});

  	socket.on('disconnect', function(msg){
    	players  = players.filter(function( obj ) {
		    return obj.id !== socket.id;
		});
		console.log(players)
    	socket.to(game.id).emit('player_disconnect',{id:socket.id} );
  	});

  	socket.on('update_position', function(msg){
  		console.log(socket.id,'update_position',msg);
		players.forEach((element, index) => {
	    if(element.id == socket	.id) {
	    		if(msg.speed > 30){msg.speed = 30};
	    		if(msg.speed < 0){msg.speed = 1};
	            players[index].speed = msg.speed/5;
	            players[index].rotation += msg.rotation/100;
	            socket.to(game.id).emit('player_update_position',players[index]);
	        }
	    });
		    	

  		
  	});

});

http.listen(80, function(){
  console.log('listening on *:80');
});

https.listen(8443, function(){
  console.log('https listening on *:8443');
});