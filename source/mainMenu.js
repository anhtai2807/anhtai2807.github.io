BasicGame.MainMenu = function (game) 
{
};

BasicGame.MainMenu.prototype = 
{
	create: function () 
	{
		this.add.sprite(0, 0, 'titlepage');
		this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2, "Click game to start", { font: "50px monospace", fill: "#fff" });
		this.loadingText.anchor.setTo(0.5, 0.5);
	},

	update: function () 
	{
		if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) 
		{
			this.loadingText.destroy();
			this.startGame();
		}
	},
	
	startGame: function () 
	{
		this.state.start('Game');
	}

};
