var game;
var ship;

window.onload = function() {
	game = new Phaser.Game(700, 700, Phaser.AUTO);
	game.state.add('Load', Load);
	game.state.add('Play', Play);
	game.state.start('Load');
}

var Load = function(){};

Load.prototype = {
	preload: function() {
		game.load.image('bg', 'assets/bg.png');
		game.load.image('ship', 'assets/ship.png');
	},
	create: function(){
		game.state.start('Play');
	}
}

var Play = function() {};

Play.prototype = {
	create: function() {

		game.add.sprite(0,0,'bg');
	
		for( var i = 0; i < 50; i++){
			ship = new Ship(game, 'ship');
			game.add.existing(ship);
		}
	},
	update: function() {

	}
}