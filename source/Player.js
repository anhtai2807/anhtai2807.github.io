function Player(game, x, y, key)
{  
	// create:
	Phaser.Sprite.call(this, game, x, y, key);
	
	// physic, body:
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.game.add.existing(this);
	this.anchor.setTo(0.5, 0.5);
	this.body.collideWorldBounds = true;
	this.body.setSize(40,40);
	
	// animations: 
	this.animations.add("idle", [0,1,2,0], 20, true);
	this.animations.add("iframe", [ 3, 0, 3, 1 ], 20, true);
	this.play("idle");
	
	// additional vars:
	this.speed = BasicGame.PLAYER_SPEED;
	this.blink = BasicGame.BLINK_DISTANCE;
	this.blinkDelay = BasicGame.BLINK_DELAY;
	this.nextBlink = null;
	this.nextIFrame = null;
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
	this.rotation = this.game.physics.arcade.angleToPointer(this) + Math.PI/2;
	this.distance = this.game.physics.arcade.distanceToPointer(this);
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
		
	if (this.game.input.activePointer.isDown)
		this.playerBlink();
	this.playerMove();
}

Player.prototype.playerBlink = function()
{
	if (!this.nextBlink || this.nextBlink < this.game.time.now)
	{
		this.nextBlink = this.game.time.now + this.blinkDelay;
		
		if (this.distance <= this.blink)
		{
			this.x = this.game.input.mousePointer.x;
			this.y = this.game.input.mousePointer.y;
			return;
		}
		var x = Math.cos(this.rotation - Math.PI/2);
		var y = Math.sin(this.rotation - Math.PI/2);
		this.x = Phaser.Math.clamp(this.x + x * this.blink,0,this.game.width);
		this.y = Phaser.Math.clamp(this.y + y * this.blink,0,this.game.height);
	}
}
	
Player.prototype.playerMove = function()
{
	var vec = new Phaser.Point();
	if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) 
		vec.x = -1;
	else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
		vec.x = 1;
	if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
		vec.y = -1;
	else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
		vec.y = 1;
	vec.normalize();
	this.body.velocity.x = vec.x * this.speed;
	this.body.velocity.y = vec.y * this.speed;
}

BasicGame.Game.prototype.playerIFrame = function()
{
	if (!this.player.nextIFrame) 
	{
		var life = this.lives.getFirstAlive();
		if (life)
		{
			life.kill();
			this.player.nextIFrame = this.time.now + BasicGame.PLAYER_IFRAME;
			console.log(this.player.nextIFrame);
			this.player.play("iframe");
			this.explode(this.player,false);
		}
		else 
		{
			this.explode(this.player);
			this.playerExplosionSFX.play();
			this.player.kill();
			this.displayEnd();
		}
	}
}

BasicGame.Game.prototype.playerHitBullet = function(player, bullet)
{
	bullet.kill();
	this.playerIFrame();
}

BasicGame.Game.prototype.playerHitEnemy = function(player, enemy)
{
	this.playerIFrame();
	if (this.player.nextIFrame) 
		return;
	this.damageShooter(enemy,3);
}