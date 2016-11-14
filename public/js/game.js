function Game(map) {

	this.map = map;
	this.character = new Character(new Point(8, 8, 0));

	graphics.setCharacter(this.character);
	graphics.addShapes(map.shapes);
}

Game.prototype.update = function() {
	this.character.update();
	
	for (var i = 0; i < this.character.invocations.length; ++ i) {
		this.character.invocations[i].update();
	}

	graphics.redrawCharacter();
};