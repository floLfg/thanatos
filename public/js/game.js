function Game(map) {

	this.map = map;
	this.character = new Character(new Point(8, 8, 0));

	graphics.setMainModel(this.character);
	graphics.addShapes(map.shapes);
}

Game.prototype.update = function() {
	game.update();
	graphics.update();
}

Game.prototype.update = function() {
	this.character.update();
	graphics.redrawCharacter();
};