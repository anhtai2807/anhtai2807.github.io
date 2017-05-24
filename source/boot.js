var BasicGame = 
{// General
	SEA_SCROLL_SPEED: 12,
	ENEMY_BULLET_VELOCITY: 150,
	MAX_BULLET: 500,
	MAX_EXPLODE_BULLET: 1500,
	MAX_ENEMY: 20,
	INSTRUCTION_EXPIRE: Phaser.Timer.SECOND * 5,
	RETURN_MESSAGE_DELAY: Phaser.Timer.SECOND * 5,
	DIFF_UP_SCORE: 500,
// Player
	PLAYER_SPEED: 300,
	BLINK_DISTANCE: 300,
	BLINK_DELAY: 1000,
	PLAYER_EXTRA_LIVES: 3,
	PLAYER_IFRAME: Phaser.Timer.SECOND * 3,
//// Enemy
// Group 1: random shooter
	SPAWN_SHOOTER_DELAY: Phaser.Timer.SECOND * 3,
	SHOOTER_HEALTH: 10,
	SHOOTER_SHOT_DELAY: Phaser.Timer.SECOND * 1,
	SHOOTER_VELOCITY: 80,
	SHOOTER_REWARD: 100,
};

BasicGame.Boot = function (game) 
{
};

BasicGame.Boot.prototype = 
{
	init: function () 
	{
		this.input.maxPointers = 1;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
	},
	
	preload: function () 
	{
		this.load.image('preloaderBar', 'assets/preloader-bar.png');
	},
	
	create: function () 
	{
		this.state.start('Preloader');
	}
};
