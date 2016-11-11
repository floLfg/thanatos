var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

function Graphics(canvasId, grid)
{
	this.size = grid.length;
	this.grid = grid;
	this.display_scale = 2;
	
	var gridCanvas = document.getElementById(canvasId + '_grid');
	var backgroundCanvas = document.getElementById(canvasId + '_background');
	var modelsCanvas = document.getElementById(canvasId + '_models');
	var actionsCanvas = document.getElementById(canvasId + '_actions');

	this.isomers = {
		'grid': new Isomer(gridCanvas),
		'background': new Isomer(backgroundCanvas),
		'models': new Isomer(modelsCanvas),
		'actions': new Isomer(actionsCanvas)
	};

	this.colors = {
		'default' : new Color(120, 120, 120),
		'grey' 	: new Color(175, 175, 175),
		'green' : new Color(200, 250, 0),
		'black' : new Color(0, 0, 0),
		'blue' 	: new Color(50, 69, 169),
		'ground' : new Color(276,276,276)
	};

	this.shapes = new Array;
	for (var x = 0; x < this.size; ++ x) {
		this.shapes[x] = new Array;
	}

	// for panning
	this.xPixelsOffset = 0;
	this.yPixelsOffset = 0;
	this.minX = 0;
	this.minY = 0;
	// nb of cells displayed on an axe (x or y)
	this.display_size = 25;

	this.computeCellsDimensions();
}

Graphics.prototype.computeCellsDimensions = function() {
	var pixelsOfOrigin = this.isomers['grid']._translatePoint(Point(0,1,0));
	var pixelsOfPointWithZOffset = this.isomers['grid']._translatePoint(Point(0,1,1));
	var pixelsOfPointWithXYOffset = this.isomers['grid']._translatePoint(Point(1,0,0));
	this.cell_height = pixelsOfOrigin.y - pixelsOfPointWithZOffset.y;
	this.cell_width =  pixelsOfPointWithXYOffset.x - pixelsOfOrigin.x;
	this.cell_ratio = parseFloat((this.cell_height / this.cell_width).toFixed(2));
};

Graphics.prototype.getContext = function(name) {
	return this.isomers[name].canvas.ctx;
};

Graphics.prototype.createSprite = function(options) {
	var image = new Image();
	image.src = options['url'];

	return sprite({
		width: options['width'],
		height: options['height'],
		image: image,
		number_of_frames: options['nb_frames'],
		ticks_per_frame: options['ticks_per_frame'],
		display_scale: this.display_scale,
		sprite_line: options['sprite_line'],
		is_animated: options['is_animated']
	});
};

Graphics.prototype.setMainModel = function(model) {
	this.main_model = model;
};

Graphics.prototype.addShape = function(shape, position, colorParam) {
	var baseColor = colorParam;
	this.shapes[position.x][position.y] = {'shape': shape, 'color': baseColor};
};

Graphics.prototype.addShapes = function(shapes) {
	for (var i = 0; i < shapes.length; ++ i) {
		this.addShape(shapes[i]['shape'], shapes[i]['position'], shapes[i]['color']);
	}
};

Graphics.prototype.redrawCharacter = function() {
	this.clear('models');
	this.draw('models');
};

Graphics.prototype.clear = function(name) {
	this.getContext(name).clearRect(this.xPixelsOffset, this.yPixelsOffset, this.isomers[name].canvas.width, this.isomers[name].canvas.height);
};

Graphics.prototype.drawEverything = function() {
	this.draw('grid');
	this.draw('background');
	this.draw('models');
	this.draw('actions');
};

Graphics.prototype.draw = function(name) {
	switch(name) {
		case 'grid':
			this.drawGrid();
		break;

		case 'background':
			this.drawBackground();
		break;

		case 'models':
			this.drawModels();
		break;

		case 'actions':
			this.drawActions();
		break;
	}
};

Graphics.prototype.drawBackground = function() {
	for (var x = this.shapes.length - 1; x >= 0; -- x) {
		for (var y = this.shapes[x].length - 1; y >= 0; -- y) {
			if (this.shouldDrawShape(x, y)) {
				if (this.shapes[x][y]) {
					this.isomers['background'].add(this.shapes[x][y]['shape'], this.shapes[x][y]['color']);
				}
			}
		}
	}
};

Graphics.prototype.shouldDrawShape = function(x, y) {
	var minX = this.minX - 10;
	var minY = this.minY - 10;
	var maxX = this.minX + this.display_size + 2;
	var maxY = this.minY + this.display_size + 2;

	return x >= minX && x <= maxX && y >= minY && y <= maxY;
};

Graphics.prototype.drawModels = function() {
	if (this.main_model.isBehindWallInGrid(this.grid)) {
		this.getContext('models').globalAlpha = 0.75;
	} else {
		this.getContext('models').globalAlpha = 1;
	}
	var coordinatesInPixels = this.isomers['models']._translatePoint(this.main_model.position);
	this.main_model.sprite.renderInContext(this.getContext('models'), coordinatesInPixels);
};

Graphics.prototype.drawGrid = function drawGrid () {
	
	this.isomers['grid'].add(new Path([
  		new Point(0, 0, 0),
  		new Point(0, this.grid.length, 0),
		new Point(this.grid.length, this.grid.length, 0),
  		new Point(this.grid.length, 0, 0)
    ]), this.colors['ground']);


	// var minX = this.minX - 8;
	// var minY = this.minY - 8;
	// var maxX = this.minX + this.display_size + 2;
	// var maxY = this.minY + this.display_size + 2;
 //  	for (var x = minX; x <  maxX; x ++) {

 //    	this.isomers['grid'].add(new Path([
 //      		new Point(x, minY, 0),
 //      		new Point(x, maxY, 0),
 //      		new Point(x, minY, 0)
 //    	]), this.colors['black']);

 //    	// à revoir avec le panning world
 //    	this.isomers['grid'].add(new Path([
 //      		new Point(minY, x, 0),
 //      		new Point(maxY, x, 0),
 //      		new Point(minY, x, 0)
 //    	]), this.colors['black']);
 //  	}
};

Graphics.prototype.drawActions = function() {
	for (var x = 0; x < this.size; x ++) {
		for (var y = 0; y < this.size; y ++) {
			if (this.shouldDrawAction(x, y)) {
				this.isomers['actions'].add(new Path([
			  		new Point(x, y, 0),
			  		new Point(x + 1, y, 0),
			  		new Point(x + 1, y + 1, 0),
			  		new Point(x, y + 1, 0)
				]));

	    		this.getContext('actions').addHitRegion({'id': x + ',' + y	, 'cursor': 'pointer'});
	    	}
		}
	}
};

Graphics.prototype.shouldDrawAction = function(x, y) {
	var minX = this.minX - 10;
	var minY = this.minY - 10;
	var maxX = this.minX + this.display_size + 2;
	var maxY = this.minY + this.display_size + 2;

	return ! this.shapes[x][y] && x >= minX && x <= maxX && y >= minY && y <= maxY;
};

Graphics.prototype.clearEverything = function() {
	this.getContext('grid').clearRect(this.xPixelsOffset, this.yPixelsOffset, this.isomers['grid'].canvas.width, this.isomers['grid'].canvas.height);
	this.getContext('background').clearRect(this.xPixelsOffset, this.yPixelsOffset, this.isomers['background'].canvas.width, this.isomers['background'].canvas.height);
	this.getContext('models').clearRect(this.xPixelsOffset, this.yPixelsOffset, this.isomers['models'].canvas.width, this.isomers['models'].canvas.height);
	this.getContext('actions').clearRect(this.xPixelsOffset, this.yPixelsOffset, this.isomers['actions'].canvas.width, this.isomers['actions'].canvas.height);
}

Graphics.prototype.moveWorldView = function(direction) {
	this.clearEverything();
	
	switch(direction) {
		case 'N':
			this.translateEverything(0, this.cell_height * 0.2);
			break;

		case 'NE':
			this.translateEverything(-0.1 * this.cell_width, 0.1 * this.cell_height);
			break;

		case 'E':
			this.translateEverything(-this.cell_width * 0.2 * this.cell_ratio, 0);
			break;

		case 'SE':
			this.translateEverything(-0.1 * this.cell_width, -0.1 * this.cell_height);
			break;

		case 'S':
			this.translateEverything(0, -this.cell_height * 0.2);
			break;

		case 'SO':
			this.translateEverything(0.1 * this.cell_width, -0.1 * this.cell_height * this.cell_ratio);
			break;

		case 'O':
			this.translateEverything(this.cell_width * 0.2 * this.cell_ratio, 0);
			break;

		case 'NO':
			this.translateEverything(0.1 * this.cell_width, 0.1 * this.cell_height);
			break;

		default: break;
	}

	this.drawEverything();
};

Graphics.prototype.translateEverything = function(x, y) {
	this.xPixelsOffset -= x;
	this.yPixelsOffset -= y;
	this.getContext('grid').translate(x, y);
	this.getContext('background').translate(x, y);
	this.getContext('models').translate(x, y);
	this.getContext('actions').translate(x, y);
};
