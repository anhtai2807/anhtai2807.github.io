var count = 0;
function Shooter(game, x, y, key)
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
	this.animations.add("idle", [0,1,2,0], 20, true);
	this.animations.add("critical", [0,3,1,3,2,3], 10, true);
	this.play("idle");
	
	// additional vars:
	this.reward = BasicGame.SHOOTER_REWARD;
	this.nextShot = 0;
}
Shooter.prototype = Object.create(Phaser.Sprite.prototype);
Shooter.prototype.constructor = Shooter;

BasicGame.Game.prototype.spawnShooter = function()
{
	if (this.nextShooter < this.time.now && this.shooters.countDead() > 0) 
	{
		this.nextShooter = this.time.now + this.shooterDelay * this.spawnDiff;
		let shooter = this.shooters.getFirstExists(false);
		let x = this.rnd.integerInRange(20, this.game.width - 20);
		let y = this.rnd.integerInRange(0, this.game.height / 6);
		if (this.player.y < this.game.height / 2)
			y = this.game.height - y;
		shooter.reset(x, y, BasicGame.SHOOTER_HEALTH * this.healthDiff);
		shooter.play('idle');
		// reset nextShot
		shooter.nextShot = 0;
		shooter.rotation = this.physics.arcade.moveToObject(shooter, this.player, BasicGame.SHOOTER_VELOCITY * this.rnd.integerInRange(50,100)*0.01) - Math.PI/2;
	}
}

BasicGame.Game.prototype.shooterFire = function()
{
	// Group 1: Random shooters
	this.shooters.forEachAlive(function (shooter)
	{
		if (this.time.now > shooter.nextShot && this.bullets.countDead() > 0) 
		{
			let bullet = this.bullets.getFirstDead();
			if (!bullet)
				return;
			this.shooterFireSFX.play();
			bullet.reset(shooter.x, shooter.y);
			let angle = this.physics.arcade.moveToObject(bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY);
			if (shooter.health > 1 && shooter.health < BasicGame.SHOOTER_HEALTH)
			{
				for (let i = 1; i <= (BasicGame.SHOOTER_HEALTH - shooter.health) / 4; i++)
				{
					let deltaAngle = i * Math.PI * 0.05;
					let rBullet = this.bullets.getFirstDead();
					if (rBullet)
					{
						rBullet.reset(shooter.x, shooter.y);
						rBullet.body.velocity.x = Math.cos(angle + deltaAngle) * BasicGame.ENEMY_BULLET_VELOCITY;
						rBullet.body.velocity.y = Math.sin(angle + deltaAngle) * BasicGame.ENEMY_BULLET_VELOCITY;
					}
					let lBullet = this.bullets.getFirstDead();
					if (lBullet)
					{
						lBullet.reset(shooter.x, shooter.y);
						lBullet.body.velocity.x = Math.cos(angle - deltaAngle) * BasicGame.ENEMY_BULLET_VELOCITY;
						lBullet.body.velocity.y = Math.sin(angle - deltaAngle) * BasicGame.ENEMY_BULLET_VELOCITY;
					}
				}
			}
			else if (shooter.health == 1)
			{
				bullet.kill();
			}
			shooter.nextShot = this.time.now + BasicGame.SHOOTER_SHOT_DELAY * this.rnd.integerInRange(50,100) * 0.01 * this.fireDiff;
			this.damageShooter(shooter);
		}
	}, this);
}

BasicGame.Game.prototype.damageShooter = function(shooter, damage = 1)
{
	shooter.damage(damage);
	if (shooter.health <= 2)
	{
		shooter.play("critical");
	} 
	if (!shooter.alive)
	{
		this.explode(shooter);
		this.explosionSFX.play();
		for (let i = 0; i <= 39; i++)
		{
			let deltaAngle = i * Math.PI * 0.05;
			let extraBullet = this.eBullets.getFirstDead();
			if (extraBullet)
			{
				extraBullet.reset(shooter.x,shooter.y);
				extraBullet.body.velocity.x = Math.cos(deltaAngle) * BasicGame.ENEMY_BULLET_VELOCITY * 0.5;
				extraBullet.body.velocity.y = Math.sin(deltaAngle) * BasicGame.ENEMY_BULLET_VELOCITY * 0.5;
			}
		}
		this.addToScore(shooter.reward);
	}
}