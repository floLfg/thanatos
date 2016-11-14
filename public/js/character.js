function Character(position) {
	var sprite = graphics.createSprite({
		url: 'img/sprite.png',
		width: 1024,
		height: 128,
		nb_frames: 8,
		ticks_per_frame: 1,
		sprite_line: 6,
		is_animated: false,
		display_scale: 2,
		offset_y: 192 + graphics.cell_height / 2
	});

	this.entity = new Entity(this, position, 'S', sprite);
	this.invocations = new Array;
}

Character.prototype = {

	getPosition : function() {return this.entity.position;},
	getCurrentPoint : function() {return this.entity.current_point;},
	getSprite : function() {return this.entity.sprite;},
	getDirection : function() {return this.entity.direction;},
	update : function() {this.entity.update();},
	updateDirection : function() {this.entity.updateDirection(true);},

	goTo : function(target) {
		this.entity.goTo(target);

		for (var i = 0; i < this.invocations.length; ++ i) {
			this.invocations[i].goTo(graphics.getNearCell(target));
		}
	},


	walkToCurrentPoint : function() {
		this.entity.walkToCurrentPoint();
		graphics.moveWorldView(this.getDirection());
	},

	summon : function(name) {
		if (this.invocations.length < 8) {
			var position = graphics.getNearCell(this.getPosition());
			this.invocations.push(new Invocation(name, position));
		}
	}

};