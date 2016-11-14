function Entity(parent, position, direction, sprite) {
	this.parent = parent;
	this.position = new Point(position.x, position.y);
	this.current_point = new Point(position.x, position.y);
	this.action = 'waiting';
	this.walking_path = new Array;
	this.direction = direction;
	this.sprite = sprite;
}

Entity.prototype = {

	update : function() {
		switch (this.action) {
			case 'walking' :
				this.updateWalking();
				break;

			default:
				break;
		}

		this.sprite.update();
	},

	goTo : function(target) {
		this.walking_path = this.findWalkingPathTo(target);
		this.action = 'walking';
		this.sprite.is_animated = true;
	},

	findWalkingPathTo : function(target) {
		var walkingPath = pathFinder.search(new Point(this.current_point.x, this.current_point.y), target);

		return walkingPath;
	},

	updateWalking : function() {
		if (! this.position.equals(this.current_point)) {
				this.parent.walkToCurrentPoint();
		} else if (this.walking_path.length > 0) {
			this.walkToNextPoint();
		} else {
			this.startWaiting();
		}
	},

	walkToNextPoint : function() {
		var nextPoint = this.walking_path.shift();
		this.current_point.x = nextPoint.x;
		this.current_point.y = nextPoint.y;
		this.parent.updateDirection();
	},

	walkToCurrentPoint : function() {
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
	},

	updateDirection : function(moveWorld) {
		if (this.position.x < this.current_point.x) {
			
			if (this.position.y < this.current_point.y) {
				
				this.direction = 'N';
				this.sprite.sprite_line = 2;

				if (moveWorld) {
					graphics.minX ++;
					graphics.minY ++;
				}

			} else if (this.position.y == this.current_point.y) {

				this.direction = 'NE';
				this.sprite.sprite_line = 3;

				if (moveWorld) {
					graphics.minX ++;
				}

			} else {

				this.direction = 'E'
				this.sprite.sprite_line = 4;

				if (moveWorld) {
					graphics.minX ++;
					graphics.minY --;
				}

			}
		} else if (this.position.x > this.current_point.x) {
			if (this.position.y < this.current_point.y) {

				this.direction = 'O';
				this.sprite.sprite_line = 0;

				if (moveWorld) {
					graphics.minX --;
					graphics.minY ++;
				}

			} else if (this.position.y == this.current_point.y) {

				this.direction = 'SO';
				this.sprite.sprite_line = 7;

				if (moveWorld) {
					graphics.minX --;
				}

			} else {

				this.direction = 'S'
				this.sprite.sprite_line = 6;

				if (moveWorld) {
					graphics.minX --;
					graphics.minY --;
				}

			}
		} else if (this.position.y > this.current_point.y) {

			this.direction = 'SE';
			this.sprite.sprite_line = 5;

			if (moveWorld) {
				graphics.minY --;
			}

		} else if (this.position.y < this.current_point.y) {

			this.direction = 'NO';
			this.sprite.sprite_line = 1;

			if (moveWorld) {
				graphics.minY ++;
			}

		}
	},

	startWaiting : function() {
		this.action = 'waiting';
		this.sprite.is_animated = false;
		this.sprite.frame_index = 0;
	}
	
};