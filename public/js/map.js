function Map(grid) {
	this.shapes = new Array;

	// dessine de l'arrière plan vers l'avant plan
	for (var x = grid.length - 1; x > 0; -- x) {
		for (var y = grid[x].length - 1; y > 0; -- y) {
			if (grid[x][y] != 0) {
				var position = new Point(x, y, 0);
				this.shapes.push({
					'shape' : Shape.Prism(position, 1, 1, grid[x][y]),
					'position': position,
					'color' : graphics.colors['default']
				});
			}
		}
	}
}