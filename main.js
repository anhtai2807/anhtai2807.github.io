// Class Processor, used to process video
class Processor
{		
	doLoad()
	{
		this.video = document.getElementById("video");
		this.canvas = document.getElementById("canvas");
		this.context = canvas.getContext("2d");
					
		let self = this;
			
		this.video.addEventListener('play', function()
		{
			self.width = self.video.videoWidth;
			self.height = self.video.videoHeight;
			self.playEvent();
		}, false)
	}
				
	playEvent()
	{
		if (this.video.paused || this.video.ended)
		{
			return;
		}
		this.doEachFrame();
					
		let self = this;
					
		setTimeout(function()
		{
			self.playEvent();
		}, 0);
	}
				
	doEachFrame()
	{
		this.context.drawImage(this.video, 0, 0, this.width, this.height);
		let frame = this.context.getImageData(0, 0, this.width, this.height);
		let l = frame.data.length / 4;
		
		let matrix = 
		[
			0.111, 0.111, 0.111,
			0.111, 0.111, 0.111,
			0.111, 0.111, 0.111,
		];
		let position =
		[
			-this.width-1,-this.width,-this.width+1,
			-1,0,1,
			(this.width-1),this.width,this.width+1,
		];
		for (let i = 0; i < l; i++) 
		{
			let r = 0.0;
			let g = 0.0;
			let b = 0.0;
			for (let iter = 0; iter < 9; iter++)
			{
				let j = i + position[iter];
				if (j < 0)
					j = j + this.width;
				if (j > this.height*this.width-1)
					j = j - this.width;
				if (i % this.width == 0)
					j++;
				if ((i+1) % this.width == 0)
					j--;
				r = r + frame.data[j*4+0]*matrix[iter];
				g = g + frame.data[j*4+1]*matrix[iter];
				b = b + frame.data[j*4+2]*matrix[iter];
			}
			frame.data[i*4+0] = Number(r);
			frame.data[i*4+1] = Number(g);
			frame.data[i*4+2] = Number(b);
		}
		this.context.putImageData(frame, 0,0);
	}	
}