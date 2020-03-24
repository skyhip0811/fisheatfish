
var game = new Phaser.Game(1760, 1008, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });


game.global = {
 players : [],
 sound : false
}

var socket = io();
socket.emit('game_server_is_ready','Game is ready message');
socket.on('player_join', (obj) => {
    obj.sprite = game.add.sprite(obj.x, obj.y, 'fish');
    obj.sprite.anchor.setTo(0.5, 0.5);
    obj.sprite.scale.setTo(2,2);
    obj.sprite.rotation = obj.rotation;
    game.global.players.push(obj);
    
    
});

socket.on('player_disconnect', (msg) => {

        game.global.players = game.global.players.filter(function( obj ) {
            if(obj.id == msg.id){
                obj.sprite.destroy();
            }
            return obj.id !== msg.id;
        });

    });

// socket.on('playes_list', (obj) => {
//      game.global.players = obj;
// });

socket.on('player_update_position', (obj) => {
    game.global.players.forEach((element, index) => {
    if(element.id == obj.id) {
        console.log('speed update')
            game.global.players[index].speed = obj.speed;
            // game.global.players[index].rotation = obj.rotation;
            // game.global.players[index].sprite.rotation = obj.rotation;
            game.global.players[index].sprite.rotation =  obj.rotation;
            game.global.players[index].rotation =  obj.rotation;

        }
    });
   
    
});



function preload() {

    game.load.tilemap('map', 'csv/map.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tiles', 'Tilesheet/fishtilesheet.png');
    game.load.image('grass1', 'PNG/Default size/fishTile_053.png');
    game.load.image('fish', 'PNG/Default size/fishTile_072.png');

}

var map;
var layer;
var cursors;

function create() {
    //BG color

    game.stage.backgroundColor = "#a1d6e6";

    
    
    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    map = game.add.tilemap('map', 64, 64);


    //  Now add in the tileset
    map.addTilesetImage('tiles');
    
    //  Create our layer
    layer = map.createLayer(0);

    //  Resize the world
    layer.resizeWorld();
     // var grass1 = game.add.sprite(80, 330, 'grass1');

    //  Allow cursors to scroll around the map
    cursors = game.input.keyboard.createCursorKeys();
    

}

function update() {
    game.global.players.forEach((obj)=>{
        obj.sprite.x += obj.speed * Math.cos(obj.rotation) *2;
        obj.sprite.y += obj.speed * Math.sin(obj.rotation) *2;
        obj.sprite.x  = obj.sprite.x > 1760 ? 0 :obj.sprite.x
        obj.sprite.x  = obj.sprite.x < 0 ? 1760 :obj.sprite.x
        obj.sprite.y  = obj.sprite.y > 1008 ? 0 :obj.sprite.y
        obj.sprite.y  = obj.sprite.y < 0 ? 1008 :obj.sprite.y
    });
    

    if(Math.random()>0.5){
        
    }

}

function render() {

}
