
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

//global variables
var MAXSPEED = new Phaser.Point( 100, 150);		//Max horizontal and Vertical speed, respectively
var accelVector = new Phaser.Point( 2 , 2);		//Horizontal and Vertical acceleration rates, respectively
var MAXACCEL = 40;								//Max Acceration
var MINACCEL = 2;								//Minimum Acceration
var shipSpeed = 3;								//speed constant
var background;									//background sprite
var ship;										//player object
var buttons;									//button object
var accelRate = 1.4;							//acceleration rate of the player object
var decelRate = 0.85;							//deceleration rate of the player object
var score;										//counter to keep track of score
var scoreGUI;									//sprite to display the score on screen

//game objects
function buttonLayout( up, down, left, right, buttonOne) 
 {
		this.up = up;
		this.down = down;
		this.right = right;
		this.left = left;
		this.stabilize = buttonOne;
}

//Game methods
function preload() {
	game.load.spritesheet('ship', "assets/img/spaceShipFighterSS.png", 150, 100);
	game.load.image('space', "assets/img/spaceBackgroundSimple.png");
}

function create() {

	//activate physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//create sprite for the background
	background = game.add.sprite( 0 , 0, 'space');
	//create player sprite
	ship = game.add.sprite(150, 150, 'ship');

	//activate physics for the ship
	game.physics.arcade.enable(ship);

	//movement setting for player object
	ship.body.allowGravity = false;
	ship.body.allowRotation = false;
	ship.body.velocity.x = 0;
	ship.body.velocity.y = 0;

	//animation setting for the player object
	ship.animations.add('ignition', [0, 1, 2, 3], 8, true);


	//cursor key input
	game.input.keyboard.enabled = true;//enable keyboard
	//create new button layout object.  Maybe for user input settings later
	buttons = new buttonLayout( Phaser.KeyCode.W, Phaser.KeyCode.S, Phaser.KeyCode.A, Phaser.KeyCode.D, Phaser.KeyCode.SHIFT);
	cursor = game.input.keyboard.addKeys( buttons );//Add new keys
	scoreGUI = game.add.text( 16, 16, 'score: 0', { fontSize: '32px', fill: '#FFFF'});
}

function update() {

	//move the ship based on input
	//console.info("velX : ", ship.body.velocity.x, " velY : ", ship.body.velocity.y);
	move(ship, MAXSPEED, accelVector, MAXACCEL, MINACCEL);
	//this will eventually do something
	scoreGUI.text = 'Score: 0';

}

function move( player, maxSpeed, av, maxAccel, minAccel ){

	var velX = player.body.velocity.x;
	var velY = player.body.velocity.y;

	//stabilize the player when a button is pressed
	if( cursor.stabilize.isDown ){
		if( velX + velY != 0){//is the player moving?
			//slow the velocity and the acceleration of the player
			velY *= 0.85;
			velX *= 0.85;
			av.x *= 0.85;
			av.y *= 0.85;
			//floor manipulation
			if( av.x < minAccel) av.x = minAccel;
			if( av.y < minAccel) av.y = minAccel;
			if( Math.abs(velX) < 1 ) velX = 0;
			if( Math.abs(velY) < 1 ) velY = 0;
			//set new velocity
			player.body.velocity.x = velX;
			player.body.velocity.y = velY;
			ship.animations.stop(0);
		}
		return;//drop out of move so that no other movement can take place while stabilizing
	}

	if( cursor.left.isDown){
		//console.info("left is down");
		if( velX > -maxSpeed.x){//is the player going maxspeed to the left?
			if( velX > 0){//velocity vector points to positive x
				av.x = dec ( av.x, minAccel);//decelerate
				velX -= av.x;//decelerate toward negative x
			} else if ( velX <= 0){//velocity vector is pointing toward negative x
				av.x = acc ( av.x, maxAccel);//accelerate
				velX -= av.x;//accelerate toward negative x
			}
		}
		ship.animations.play('ignition');
	}

	if ( cursor.right.isDown){
		//console.info("right is down");
		if( velX < maxSpeed.x){//if the player can still accellerate
			if( velX < 0 ){//velocity vector is pointing toward negative x
				av.x = dec( av.x, minAccel );//decelerate
				velX += av.x//decelerate toward the positive x axis
			} else if ( velX >= 0){//velocity vector is pointing towards positive x
				av.x = acc( av.x, maxAccel );//accelerate
				velX += av.x//accellerate towards positive x
			}
		}
		ship.animations.play('ignition');
	}

	if ( cursor.down.isDown){
		//console.info("up is down");
		if( velY < maxSpeed.y){//can the player still accelerate?
			if( velY >= 0){//the velocity vector is pointing towards positive y
				av.y = acc( av.y, maxAccel);//accelerate
				velY += av.y;//accelerate towards positive y
			} else if ( velY < 0){//the velocity vector is pointing towards negative y
				av.y = dec( av.y, minAccel);//decelerate
				velY += av.y;//decelerate toward positive y
			}
		}
		ship.animations.play('ignition');
	}

	if ( cursor.up.isDown){
		//console.info("Down is down");
		if( velY > -maxSpeed.y){//can the player still accelerate?
			if( velY > 0){//the velocity vector is pointing toward positive Y
				av.y = dec( av.y, minAccel);//decelerate
				velY -= av.y;//decelerate toward negative y
			} else if ( velY <= 0){//the velocity vector is pointing toward negative Y
				av.y = acc( av.y, maxAccel);//accelerate
				velY -= av.y;//accelerate towards negative y
			}
		}
		ship.animations.play('ignition');
	}
	//applies ceiling to the 
	if( Math.abs( velX ) > maxSpeed.x )	velX = capSpeed( velX, maxSpeed.x );
	if( Math.abs( velY ) > maxSpeed.y )	velY = capSpeed( velY, maxSpeed.y );
	//apply changes to velocity
	//console.info("velocityVector( ", velX, " , ", velY, " )  accelVector( ", accelVector.x, " , ", accelVector.y, " )");
	player.body.velocity.x = velX;
	player.body.velocity.y = velY;

}
function capSpeed( velocity, maxSpeed){
	return (velocity / Math.abs( velocity )) * maxSpeed;
}
//acceleration curve
function acc( accel, maxAccel ){

	if( accel < maxAccel ){//has accelleration reached it's ceiling?
		if( accel * accelRate > maxAccel){//if the next step is greater than maxAccel
			return maxAccel;
		} else {//if the next step is within bounds
			return accel * accelRate;
		}
	}

	return maxAccel;
}
//deceleration
function dec( accel, minAccel ){
	
	if( accel > minAccel ) {//if acceleration is within bounds
		if( accel * decelRate < minAccel ){
			return minAccel;
		} else {
			return accel * decelRate; 
		}
	}
	return minAccel;
}
