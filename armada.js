
var key;

function Ship(game, key){

	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(60, game.width - 64), 
		game.rnd.integerInRange(60, game.height - 60), key);
	//add properties
	this.anchor.set(0.5);//center sprite at position
	var scale = game.rnd.realInRange(0.5, 1.5);//generate a random scale
	//apply that scale to this ship
	this.scale.x = scale;
	this.scale.y = scale;
	//enable physics for this ship
	game.physics.enable(this);
	this.body.velocity.x = game.rnd.integerInRange(-100, 100);//generate a random velocity for this ship
	if( this.body.velocity.x > 0 ) this.angle = 90;
	if( this.body.velocity.x <= 0) this.angle = -90;

	//Key capture to reverse the direction of this ship
	key = game.input.keyboard.addKey(Phaser.Keyboard.R);
	key.onDown.add(changeDirection, this);
}

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

//overloading the update function
Ship.prototype.update = function(){

	if( this.body.position.x < -50 ){
		this.body.position.x = game.width;
	}
	//if this ship has passed beyond the right side of the screen, move it to the left
	if( this.body.position.x > game.width){
		this.body.position.x = 0;
	}
}
changeDirection = function(){
	this.body.velocity.x *= -1;
	this.angle += 180;
}