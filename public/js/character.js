function Character(position) {
	this.position = new Point(position.x, position.y);
	this.current_point = new Point(position.x, position.y);
	this.action = 'waiting';
	this.walking_path = new Array;
	this.direction = 'S';
	this.sprite = graphics.createSprite({
		url: 'img/sprite.png',
		width: 1024,
		height: 128,
		nb_frames: 8,
		ticks_per_frame: 1,
		sprite_line: 6,
		is_animated: false
	});
	this.ticks_counts = {
		walking: 0
	};

	this.ticks_required = {
		walking: 1
	};
}

Character.prototype.update = function() {
	switch (this.action) {
		case 'walking' :
			this.updateWalking();
			break;
	}

	this.sprite.update();
};

Character.prototype.goTo = function(target) {
	this.walking_path = this.findWalkingPathTo(target);
	this.action = 'walking';
	this.sprite.is_animated = true;
};

Character.prototype.findWalkingPathTo = function(target) {
	var walkingPath = pathFinder.search(new Point(this.current_point.x, this.current_point.y), target);

	return walkingPath;
};

Character.prototype.updateWalking = function() {
	if (! this.position.equals(this.current_point)) {

		if (this.ticks_counts['walking'] == this.ticks_required['walking']) {
			this.walkToCurrentPoint();
			this.ticks_counts['walking'] = 0;
		}
		this.ticks_counts['walking'] ++;

	} else if (this.walking_path.length > 0) {
		this.walkToNextPoint();
	} else {
		this.stopWalking();
	}
};

Character.prototype.walkToNextPoint = function() {
	var nextPoint = this.walking_path.shift();
	this.current_point.x = nextPoint.x;
	this.current_point.y = nextPoint.y;
	this.updateDirection();
};

Character.prototype.updateDirection = function() {
	if (this.position.x < this.current_point.x) {
		
		if (this.position.y < this.current_point.y) {
			
			this.direction = 'N';
			this.sprite.sprite_line = 2;
			graphics.minX ++;
			graphics.minY ++;

		} else if (this.position.y == this.current_point.y) {

			this.direction = 'NE';
			this.sprite.sprite_line = 3;
			graphics.minX ++;

		} else {

			this.direction = 'E'
			this.sprite.sprite_line = 4;
			graphics.minX ++;
			graphics.minY --;

		}
	} else if (this.position.x > this.current_point.x) {
		if (this.position.y < this.current_point.y) {

			this.direction = 'O';
			this.sprite.sprite_line = 0;
			graphics.minX --;
			graphics.minY ++;

		} else if (this.position.y == this.current_point.y) {

			this.direction = 'SO';
			this.sprite.sprite_line = 7;
			graphics.minX --;

		} else {

			this.direction = 'S'
			this.sprite.sprite_line = 6;
			graphics.minX --;
			graphics.minY --;

		}
	} else if (this.position.y > this.current_point.y) {

		this.direction = 'SE';
		this.sprite.sprite_line = 5;
		graphics.minY --;

	} else if (this.position.y < this.current_point.y) {

		this.direction = 'NO';
		this.sprite.sprite_line = 1;
		graphics.minY ++;

	}
}

Character.prototype.walkToCurrentPoint = function() {
	var delta = 0.2;
	switch (this.direction) {
		case 'N' :
			this.position.x += delta;
			this.position.y += delta;
			if (this.position.x > this.current_point.x && this.position.y > this.current_point.y) {
				this.position.x = this.current_point.x;
				this.position.y = this.current_point.y;
			}
			break;

		case 'NE' :
			this.position.x += delta;
			break;

		case 'E' :
			this.position.y -= delta * graphics.cell_ratio;
			this.position.x += delta * graphics.cell_ratio;
			if (this.position.x > this.current_point.x && this.position.y < this.current_point.y) {
				this.position.x = this.current_point.x;
				this.position.y = this.current_point.y;
			}
			break;

		case 'SE' :
			this.position.y -= delta;
			break;

		case 'S' :
			this.position.x -= delta;
			this.position.y -= delta;
			if (this.position.x < this.current_point.x && this.position.y < this.current_point.y) {
				this.position.x = this.current_point.x;
				this.position.y = this.current_point.y;
			}
			break;

		case 'SO' :
			this.position.x -= delta;
			break;

		case 'O' :
			this.position.y += delta * graphics.cell_ratio;
			this.position.x -= delta * graphics.cell_ratio;
			if (this.position.x < this.current_point.x && this.position.y > this.current_point.y) {
				this.position.x = this.current_point.x;
				this.position.y = this.current_point.y;
			}
			break;

		case 'NO' :
			this.position.y += delta;
			break;
	}
	this.position.x = parseFloat(this.position.x.toFixed(2));
	this.position.y = parseFloat(this.position.y.toFixed(2));
	graphics.moveWorldView(this.direction);
};

Character.prototype.stopWalking = function() {
	this.action = 'waiting';
	this.sprite.is_animated = false;
};

Character.prototype.isBehindWallInGrid = function(grid) {
	return 	(this.current_point.y > 0 && grid[this.current_point.x][this.current_point.y - 1] > 0)
			|| (this.current_point.x > 0 && this.current_point.y > 0 && grid[this.current_point.x - 1][this.current_point.y - 1] > 0)
			|| (this.current_point.x > 0 && grid[this.current_point.x - 1][this.current_point.y] > 0);
}
