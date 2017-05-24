BasicGame.Preloader = function (game) 
{
	this.background = null;
	this.preloadBar = null;
};

BasicGame.Preloader.prototype = 
{
	preload: function () 
	{
		this.stage.backgroundColor = '#2d2d2d';
		//  loading progress bar
		this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
		this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		
		// Load assets
		this.load.image('titlepage', 'assets/titlepage.png');
		this.load.image('sea', 'assets/sea.png');
		this.load.image('bullet', 'assets/bullet.png');
		this.load.image("explode_bullet", "assets/bullet-burst.png");
		this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
		this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
		this.load.spritesheet('player', 'assets/player.png', 64, 64);
		this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
		this.load.audio('playerExplosion', ['assets/player-explosion.ogg', 'assets/player-explosion.wav']);
		this.load.audio('enemyFire', ['assets/enemy-fire.ogg', 'assets/enemy-fire.wav']);
	},

	create: function () 
	{
		this.preloadBar.cropEnabled = false;
	},
	update: function () 
	{
		this.state.start('MainMenu');
	}
};
