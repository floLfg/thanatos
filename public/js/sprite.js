function Sprite (options) {
	this.frame_index = 0;
	this.tick_count = 0;
	this.ticks_per_frame = options.ticks_per_frame  || 0;
	this.nb_frames = options.nb_frames || 1;
	this.width = options.width;
	this.height = options.height;
	this.display_scale = options.display_scale;
	this.is_animated = options.is_animated;
	this.image = options.image;
	this.sprite_line = options.sprite_line ;
	this.offset_y = options.offset_y  || 0;
}

Sprite.prototype = {

	update : function () {
		if (this.is_animated) {
		    this.tick_count ++;

		    if (this.tick_count > this.ticks_per_frame) {

				this.tick_count = 0;
				
		        if (this.frame_index < this.nb_frames - 1) {	
		            this.frame_index ++;
		        } else {
		            this.frame_index = 0;
		        }
		    }
		}
	},

	renderInContext : function (context, point) {
		var sourceX = this.frame_index * this.width / this.nb_frames,
			sourceY = this.sprite_line * this.height,
			width = this.width / this.nb_frames,
			drawX = parseInt(point.x - (width * this.display_scale) / 2),
			drawY = parseInt(point.y - this.offset_y);

	  	context.drawImage(
	    	this.image,

	    	sourceX, sourceY,
	    	width,
	    	this.height,

	    	drawX, drawY,
	    	width * this.display_scale,
	    	this.height * this.display_scale
	    );
	},

	erase : function (context, point) {
		var displayWidth = (this.width * this.display_scale) / this.nb_frames,
			displayHeight = this.height * this.display_scale,
			drawX = parseInt(point.x - displayWidth / 2),
			drawY = parseInt(point.y - this.offset_y);

	  	context.clearRect(
	  		drawX, drawY,
	    	displayWidth,
	    	displayHeight
	    );
	}
};