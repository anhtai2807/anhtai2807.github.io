// Bullets
function Bullet(game, x, y, key)
{	
	// create:
	Phaser.Sprite.call(this, game, x, y, key);
	this.kill();
	
	// physic, body:
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.anchor.setTo(0.5, 0.5);
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;
}
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

function EBullet(game, x, y, key)
{	
	// create:
	Phaser.Sprite.call(this, game, x, y, key);
	this.kill();
	
	// physic, body:
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.anchor.setTo(0.5, 0.5);
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;
}
EBullet.prototype = Object.create(Phaser.Sprite.prototype);
EBullet.prototype.constructor = EBullet;

// Explosions
function Explosion(game, x, y, key)
{	
	// create:
	Phaser.Sprite.call(this, game, x, y, key);
	this.kill();
	
	// physic, body:
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.anchor.setTo(0.5, 0.5);
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;
	
	// animations:
	this.animations.add('boom');
	this.animations.add("hit",[0]);
}
Explosion.prototype = Object.create(Phaser.Sprite.prototype);
Explosion.prototype.constructor = Explosion;

BasicGame.Game.prototype.addToScore = function(score)
{
	if (this.showReturn > 0)
		return;
	
	this.score += score;
	this.scoreText.text = "Game score: " + this.score;
	if (this.score % BasicGame.DIFF_UP_SCORE == 0)
	{
		this.healthDiff = Phaser.Math.min((1 + 0.1*(this.score / BasicGame.DIFF_UP_SCORE)),1.7);
		this.spawnDiff = Phaser.Math.max((1 - 0.1*(this.score / BasicGame.DIFF_UP_SCORE)),0.3);
		this.fireDiff = Phaser.Math.max((1 - 0.05*(this.score / BasicGame.DIFF_UP_SCORE)),0.5);
	}
	
	this.diffText.text = 
		"Enemy health bonus: x" + this.healthDiff + 
		"\nEnemy fire rate bonus: x" + this.fireDiff +
		"\nEnemy spawn rate bonus: x" + this.spawnDiff;
}

BasicGame.Game.prototype.explode = function (sprite, big = true) 
{
	if (this.explosions.countDead() === 0) 
		return;
	let explosion = this.explosions.getFirstExists(false);
	explosion.reset(sprite.x, sprite.y);
	if (big)
	{
		explosion.play('boom', 10, false, true);
		explosion.body.velocity.x = sprite.body.velocity.x;
		explosion.body.velocity.y = sprite.body.velocity.y;
	}
	else explosion.play('hit',5,false,true); 
}
	
BasicGame.Game.prototype.displayEnd = function()
{
	this.endText = this.add.text(this.game.width/2, this.game.height/2,
		"Game over!",
		{ font: "72px serif", fill: "#fff"});
	this.endText.anchor.setTo(0.5,0.5);
	this.showReturn = this.time.now + BasicGame.RETURN_MESSAGE_DELAY;
}
