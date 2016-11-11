function sprite (options) {
	
	var sprite = {};
	
	var frame_index 	= 0,
		tick_count 		= 0,
		ticks_per_frame 	= options.ticks_per_frame  || 0,
		number_of_frames 	= options.number_of_frames || 1;

	sprite.width = options.width;
	sprite.height = options.height;
	sprite.display_scale = options.display_scale;
	sprite.is_animated = options.is_animated; 
	sprite.image = options.image;
	sprite.sprite_line = options.sprite_line  || 0;
	
	sprite.update = function () {
		if (sprite.is_animated) {
		    tick_count += 1;

		    if (tick_count > ticks_per_frame) {

				tick_count = 0;
				
		        if (frame_index < number_of_frames - 1) {	
		            frame_index += 1;
		        } else {
		            frame_index = 0;
		        }
		    }
		} else {
			frame_index = 0;
		}
	};
	
	sprite.renderInContext = function (context, point) {
		var sourceX = frame_index * sprite.width / number_of_frames,
			sourceY = sprite.sprite_line * sprite.height,
			sourceWidth = sprite.width / number_of_frames,
			sourceHeight = sprite.height,
			displayWidth = (sprite.width * sprite.display_scale) / number_of_frames,
			displayHeight = sprite.height * sprite.display_scale,
			drawX = parseInt(point.x - displayWidth / 2),
			drawY = parseInt(point.y - displayHeight * 0.85);

	  	context.drawImage(
	    	sprite.image,

	    	sourceX, sourceY,
	    	sourceWidth,
	    	sourceHeight,

	    	drawX, drawY,
	    	displayWidth,
	    	displayHeight
	    );
	};

	sprite.erase = function (context, point) {
		var displayWidth = (sprite.width * sprite.display_scale) / number_of_frames,
			displayHeight = sprite.height * sprite.display_scale,
			drawX = point.x - displayWidth / 2,
			drawY = point.y - displayHeight * 0.85;

	  	context.clearRect(
	  		drawX, drawY,
	    	displayWidth,
	    	displayHeight
	    );
	};

	return sprite;
}