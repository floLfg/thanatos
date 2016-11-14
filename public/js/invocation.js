function Invocation(name, position) {
	var sprite = graphics.createSprite({
		url: 'img/' + name + '.png',
		width: 1024,
		height: 256,
		nb_frames: 4,
		ticks_per_frame: 2,
		sprite_line: 6,
		is_animated: false,
		display_scale: 1,
		offset_y: 192 + graphics.cell_height / 2
	});

	this.entity = new Entity(this, position, 'S', sprite);
}

Invocation.prototype = {

	getPosition : function() {return this.entity.position;},
	getCurrentPoint : function() {return this.entity.current_point;},
	getSprite : function() {return this.entity.sprite;},
	getDirection : function() {return this.entity.direction;},
	update : function() {this.entity.update();},
	updateDirection : function() {this.entity.updateDirection(false);},
	goTo : function(target) {this.entity.goTo(target)},
	walkToCurrentPoint : function() {this.entity.walkToCurrentPoint();}

};