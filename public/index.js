var config = {
    type: Phaser.AUTO,
    width: 2112,
    height: 1024,
    backgroundColor: '#a1d6e6',
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
             debug: false,
            gravity: { y: 0 }
        }
    },
    scene:  { preload: preload, create: create, update: update, render: render }
};


var game = new Phaser.Game(config);


game.global = {
 players : [],
 sound : false,
 stars : [],
 playersgroup: null,
 starsgroup:null,
 tailgroup:null,

}

var socket = io();
socket.emit('game_server_is_ready','Game is ready message');


socket.on('player_disconnect', (msg) => {

        game.global.players = game.global.players.filter(function( obj ) {
            if(obj.id == msg.id){
                destroy_player(obj.sprite);
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
            game.global.players[index]._rotation = game.global.players[index].rotation;
            game.global.players[index].rotation =  obj.rotation;



        }
    });
   
    
});



function preload() {

    
    this.load.image('grass1', 'PNG/Default size/fishTile_053.png');
    this.load.image('fish', 'PNG/Default size/fishTile_100.png');
    this.load.image('star', 'PNG/star.png');
    this.load.tilemapCSV('map', 'csv/map.csv');
    this.load.image('tiles', 'Tilesheet/fishtilesheet.png');

}

var map;
var layer;
var cursors;

function create() {
    //BG color

    // game.stage.backgroundColor = "#a1d6e6";
    

    game.global.playersgroup =  this.physics.add.group();
    game.global.playersgroup.enableBody = true;
    game.global.playersgroup.physicsBodyType = Phaser.Physics.ARCADE;
    // game.global.playersgroup.create(0,0,'fish').setVelocity(100, 200);
    game.global.starsgroup = this.physics.add.group();
    game.global.starsgroup .enableBody = true;
    game.global.starsgroup.physicsBodyType = Phaser.Physics.ARCADE;

    game.global.tailgroup = this.physics.add.group();
    game.global.tailgroup .enableBody = true;
    game.global.tailgroup.physicsBodyType = Phaser.Physics.ARCADE;


    
    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
    // map = game.add.tilemap('map', 64, 64);
    var map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
    var tileset = map.addTilesetImage('tiles');
     var layer = map.createStaticLayer(0, tileset, 0, 0); // layer index, tileset, x, y
     this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    //  Now add in the tileset
    // map.addTilesetImage('tiles');
    
    //  Create our layer
    // layer = map.createLayer(0);

    //  Resize the world
    // layer.resizeWorld();
     // var grass1 = game.add.sprite(80, 330, 'grass1');

    //  Allow cursors to scroll around the map
    // cursors = game.input.keyboard.createCursorKeys();
    
    //
    setInterval(()=>{
    generate_star()
    }, 1000);

    socket.on('player_join', (obj) => {

    obj.sprite = this.physics.add.sprite(obj.x, obj.y, 'fish');
    obj.sprite.objid = obj.id;
    obj.sprite.tails = [];
    game.global.players.push(obj);
    obj.sprite.score = 0;
    obj._rotation = 0;

    
    // obj.sprite = game.global.playersgroup.create(obj.x, obj.y, 'fish').setVelocity(300,0);

    //Eat star
    this.physics.add.collider(obj.sprite , game.global.starsgroup, function(_player,_star){
        
        _player.score+=1;
        console.log(_player.score);
        _star.destroy();

        tail = game.global.tailgroup.create(_player.x - 100*Math.cos(obj.rotation),_player.y - 100* Math.sin(obj.rotation),'fish');
        _player.tails.push(tail);
        tail._parent = _player;
        tail.rotation = _player.rotation;
        tail.setScale(.5,.5);



     });

    this.physics.add.collider(obj.sprite,game.global.tailgroup,function(_player,_tail){

        
            if(_tail._parent.objid !=  _player.objid){
                
                destroy_player(_player);

            }
            
        
        

    })

  


    // for (var i = 0, len = game.global.players.length; i < len; i++) {
    //     this.physics.add.collider(game.global.players[i].sprite.tailgroup,obj.sprite),function(_tail,new_player){
    //          for (var i =  0; i < game.global.players.length; i++) {
    //              if(game.global.players[i].id == new_player.objid) game.global.players.splice(i,1);
    //          };
    //          new_player.destroy();

    //     }
    // }

    obj.sprite.setCollideWorldBounds(true);
    // obj.sprite.setBounceX(1);
    // obj.sprite.setBounceY(1);
    // obj.sprite.setVelocityX( obj.speed*20 * Math.cos(obj.rotation) *2);
    // obj.sprite.setVelocity(300,0)
    // game.global.playersgroup.add(obj.sprite);
    // obj.sprite.anchor.setTo(0.5, 0.5);
    // obj.sprite.setScale(1);
    // obj.sprite.rotation = obj.rotation;
    // game.physics.enable(obj.sprite, Phaser.Physics.ARCADE);
    // obj.sprite.body.collideWorldBounds = true;
    // obj.sprite.body.bounce.x = 1;
    // obj.sprite.body.bounce.y = 1;
    // obj.sprite.body.immovable = false;
    // obj.sprite.body.collideWorldBounds = true;
    
    
    
});

}


function update() {
    game.global.players.forEach((obj)=>{
        // obj.sprite.x += obj.speed * Math.cos(obj.rotation) *2;
        // obj.sprite.y += obj.speed * Math.sin(obj.rotation) *2;
        
        // obj.sprite.velocity.x = obj.speed*20 * Math.cos(obj.rotation) *2;
        vx = obj.speed*20 * Math.cos(obj.rotation) *2;

        vy = obj.speed*20 * Math.sin(obj.rotation) *2;
        obj.sprite.setVelocityX(vx);
        if(vx < 0) obj.sprite.setFlip(false,true);
        if(vx > 0) obj.sprite.setFlip(false,false);
        obj.sprite.setVelocityY(vy );
        // obj.sprite.x  = obj.sprite.x > 1760 ? 0 :obj.sprite.x
        // obj.sprite.x  = obj.sprite.x < 0 ? 1760 :obj.sprite.x
        // obj.sprite.y  = obj.sprite.y > 1008 ? 0 :obj.sprite.y
        // obj.sprite.y  = obj.sprite.y < 0 ? 1008 :obj.sprite.y
        _rotation = obj._rotation;
        obj.sprite.tails.forEach(function(tail){
            old_rotaion = tail.rotation;
            _vx = obj.speed*20 * Math.cos(_rotation) *2;
            _vy = obj.speed*20 * Math.sin(_rotation) *2;
            tail.rotation = _rotation;
            _rotation = old_rotaion;


            tail.setVelocityX(_vx);
            tail.setVelocityY(_vy);
            if(_vx < 0) tail.setFlip(false,true);
            if(_vx > 0) tail.setFlip(false,false);
        });
    });

}

function destroy_player(_player){
    for (var i =  0; i < game.global.players.length; i++) {
    if(game.global.players[i].id == _player.objid ) {
        game.global.players.splice(i,1);
        _player.tails.forEach(function(__tail){
                        __tail.destroy();
                    })
                    _player.destroy();
                    
    }
    };
                    

}

function generate_star(){
    if(Math.random()>0.1){
        // new_star = game.add.sprite(Math.random()*1760, Math.random()*1008, 'star');
        new_star = game.global.starsgroup.create(Math.random()*1760, Math.random()*1008, 'star');
        new_star.setScale(.2,.2);
        // new_star.body.immovable = true;
        // new_star.scale.setTo(.2,.2);
        new_star.setCollideWorldBounds(true);
        // game.physics.enable(new_star, Phaser.Physics.ARCADE);
        // game.global.starsgroup.add(new_star);
        game.global.stars.push(new_star);

    }
}

function render() {

}
