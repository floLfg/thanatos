var GridNode = astar.GridNode;

function AstarHelper(grid) {
	this.graph = new Graph(grid, {diagonal: true});
}

AstarHelper.prototype.search = function(startPoint, endPoint) {
	var startGridNode = this.graph.grid[startPoint.x][startPoint.y];
	var endGridNode = this.graph.grid[endPoint.x][endPoint.y];

	var path = astar.search(this.graph, startGridNode, endGridNode);
	resultPath = this.translatePath(path);
	return resultPath;
};

AstarHelper.prototype.translatePath = function(pathToTranslate) {
	var translatedPath = new Array;

	for (var i = 0; i < pathToTranslate.length; ++ i) {
		translatedPath.push(new Point(pathToTranslate[i].x, pathToTranslate[i].y, 0));
	}

	return translatedPath;
}