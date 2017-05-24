BasicGame.Game = function (game) 
{
};

BasicGame.Game.prototype = 
{
	create: function () 
	{
		this.setupBackground();
		this.player = new Player(this.game,this.game.width/2,this.game.height/2,"player");
		this.setupShooters();
		this.setupGroups();
		this.setupPlayerIcons();
		this.setupText();
		this.setupAudio();
	},

	update: function () 
	{
		this.checkCollisions();
		this.spawnShooter();
		this.shooterFire();
		this.processDelayedEffects();
	},
	
	render: function ()
	{ // Debug only
		//this.game.debug.body(this.player);
	},
	
	quitGame: function (pointer) 
	{
		this.sea.destroy();
		this.player.destroy();
		this.shooters.destroy();
		this.bullets.destroy();
		this.eBullets.destroy();
		this.explosions.destroy();
		this.lives.destroy();
		this.instructions.destroy();
		this.scoreText.destroy();
		this.endText.destroy();
		this.state.start('MainMenu');
	},

//
//// setup - Create
//
	setupBackground: function()
	{
		this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, "sea");
		this.sea.autoScroll(0, BasicGame.SEA_SCROLL_SPEED);
	},
	
	setupShooters: function()
	{
		// Group 1: Random shooters
		this.shooters = this.add.group();
		for (let i = 0; i < BasicGame.MAX_ENEMY; i++)
			this.shooters.add(new Shooter(this.game,0,0,"greenEnemy"));
		this.nextShooter = this.time.now + BasicGame.INSTRUCTION_EXPIRE;
		this.shooterDelay = BasicGame.SPAWN_SHOOTER_DELAY;
		
		this.healthDiff = 1;
		this.spawnDiff = 1;
		this.fireDiff = 1;
	},
	
	setupGroups: function()
	{
		this.bullets = this.add.group();
		for (let i = 0; i < BasicGame.MAX_BULLET; i++)
			this.bullets.add(new Bullet(this.game,0,0,"bullet"));
		this.eBullets = this.add.group();
		for (let i = 0; i < BasicGame.MAX_EXPLODE_BULLET; i++)
			this.eBullets.add(new EBullet(this.game,0,0,"explode_bullet"));
		this.explosions = this.add.group();
		for (let i = 0; i < BasicGame.MAX_ENEMY+1; i++)
			this.explosions.add(new Explosion(this.game,0,0,"explosion"));
	},
	
	setupPlayerIcons: function()
	{
		this.lives = this.add.group();
		for (var i = 0; i < BasicGame.PLAYER_EXTRA_LIVES; i++)
		{
			var life = this.lives.create(this.game.width - (10 + i * 30) - 20, this.game.height - 30, "player");
			life.scale.setTo(0.5,0.5);
			life.anchor.setTo(0.5,0.5);
		}
	},
	
	setupText: function()
	{
		this.instructions = this.add.text( this.game.width/2, this.game.height - 100, 
			"Use WASD to Move\nPress Mouse to Blink to the target location\n" +
			"Blink has a cooldown of 1s, and a max range of 300 pixels",
			{
				font: '20px monospace', fill: '#fff', align: 'center' 
			});
		this.instructions.anchor.setTo(0.5, 0.5);
		this.instExpire = this.time.now + BasicGame.INSTRUCTION_EXPIRE;
		
		this.score = 0;
		this.scoreText = this.add.text(this.game.width / 2, this.game.height - 30, 
			"Game score: " + this.score, 
			{ 
				font: '20px monospace', fill: '#fff', align: 'center' 
			});
		this.scoreText.anchor.setTo(0.5, 0.5);
		
		this.diffText = this.add.text(20, this.game.height - 100,
			"Enemy health bonus: x" + this.healthDiff + 
			"\nEnemy fire rate bonus: x" + this.fireDiff +
			"\nEnemy spawn rate bonus: x" + this.spawnDiff,
			{
				font: "15px monospace", fill: "#fff"
			});
	},
	
	setupAudio: function()
	{
		this.explosionSFX = this.add.audio('explosion');
		this.playerExplosionSFX = this.add.audio('playerExplosion');
		this.shooterFireSFX = this.add.audio('enemyFire');
	},
//
//// setup - Update
//
	
	checkCollisions: function()
	{
		this.physics.arcade.overlap(this.player, this.bullets, this.playerHitBullet, null, this);
		this.physics.arcade.overlap(this.player, this.shooters, this.playerHitEnemy, null, this);
		this.physics.arcade.overlap(this.player, this.eBullets, this.playerIFrame, null, this);
	},
		
	processDelayedEffects: function()
	{
		if (this.instructions.exists && this.time.now > this.instExpire)
			this.instructions.destroy();
		if (this.player.nextIFrame && this.player.nextIFrame < this.time.now) 
		{
			this.player.nextIFrame = null;
			this.player.play('idle');
		}
		if (this.showReturn && this.time.now > this.showReturn) 
		{
			this.quitGame();
		}
	},
};
