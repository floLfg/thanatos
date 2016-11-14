var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

function Graphics(canvasId, grid)
{
	this.size = grid.length;
	this.grid = grid;

	this.isomers = {
		'grid': new Isomer(document.getElementById(canvasId + '_grid')),
		'background': new Isomer(document.getElementById(canvasId + '_background')),
		'models': new Isomer(document.getElementById(canvasId + '_models')),
		'actions': new Isomer(document.getElementById(canvasId + '_actions'))
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

Graphics.prototype = {

	computeCellsDimensions : function() {
		var pixelsOfOrigin = this.isomers['grid']._translatePoint(Point(0,1,0));
		var pixelsOfPointWithZOffset = this.isomers['grid']._translatePoint(Point(0,1,1));
		var pixelsOfPointWithXYOffset = this.isomers['grid']._translatePoint(Point(1,0,0));
		this.cell_height = pixelsOfOrigin.y - pixelsOfPointWithZOffset.y;
		this.cell_width =  pixelsOfPointWithXYOffset.x - pixelsOfOrigin.x;
		this.cell_ratio = parseFloat((this.cell_height / this.cell_width).toFixed(2));
	},

	getContext : function(name) {
		return this.isomers[name].canvas.ctx;
	},

	createSprite : function(options) {
		var image = new Image();
		image.src = options['url'];

		options['image'] = image;
		return new Sprite(options);
	},

	setCharacter : function(character) {
		this.character = character;
	},

	addShape : function(shape, position, colorParam) {
		var baseColor = colorParam;
		this.shapes[position.x][position.y] = {'shape': shape, 'color': baseColor};
	},

	addShapes : function(shapes) {
		for (var i = 0; i < shapes.length; ++ i) {
			this.addShape(shapes[i]['shape'], shapes[i]['position'], shapes[i]['color']);
		}
	},

	redrawCharacter : function() {
		this.clear('models');
		this.draw('models');
	},

	clear : function(name) {
		this.getContext(name).clearRect(this.xPixelsOffset, this.yPixelsOffset, this.isomers[name].canvas.width, this.isomers[name].canvas.height);
	},
	
	drawEverything : function() {
		this.draw('grid');
		this.draw('background');
		this.draw('models');
		this.draw('actions');
	},

	draw : function(name) {
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
	},


	drawBackground : function() {
		for (var x = this.shapes.length - 1; x >= 0; -- x) {
			for (var y = this.shapes[x].length - 1; y >= 0; -- y) {
				if (this.shapes[x][y] && this.shouldDrawCell(x, y)) {
					this.isomers['background'].add(this.shapes[x][y]['shape'], this.shapes[x][y]['color']);
				}
			}
		}
	},

	drawModels : function() {
		this.drawModel(this.character);

		for (var i = 0; i < this.character.invocations.length; ++ i) {
			this.drawModel(this.character.invocations[i]);
		}
	},

	drawModel : function(model) {
		this.getContext('models').globalAlpha = (this.isBehindWall(model)) ?  0.5 : 1;
		var coordinatesInPixels = this.isomers['models']._translatePoint(model.getPosition());
		model.getSprite().renderInContext(this.getContext('models'), coordinatesInPixels);
	},

	isBehindWall : function(model) {
		return 	(model.getCurrentPoint().y > 0 && this.grid[model.getCurrentPoint().x][model.getCurrentPoint().y - 1] > 0)
				|| (model.getCurrentPoint().x > 0 && model.getCurrentPoint().y > 0 && this.grid[model.getCurrentPoint().x - 1][model.getCurrentPoint().y - 1] > 0)
				|| (model.getCurrentPoint().x > 0 && this.grid[model.getCurrentPoint().x - 1][model.getCurrentPoint().y] > 0);
	},

	drawGrid : function drawGrid () {
	
		this.isomers['grid'].add(new Path([
	  		new Point(0, 0, 0),
	  		new Point(0, this.grid.length, 0),
			new Point(this.grid.length, this.grid.length, 0),
	  		new Point(this.grid.length, 0, 0)
	    ]), this.colors['ground']);
	},

	drawActions : function() {
		for (var x = 0; x < this.size; x ++) {
			for (var y = 0; y < this.size; y ++) {
				if (this.shouldDrawCell(x, y)) {
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
	},

	shouldDrawCell : function(x, y) {
		var minX = this.minX - 10;
		var minY = this.minY - 10;
		var maxX = this.minX + this.display_size + 2;
		var maxY = this.minY + this.display_size + 2;

		return x >= minX && x <= maxX && y >= minY && y <= maxY;
	},

	clearEverything : function() {
		this.getContext('grid').clearRect(parseInt(this.xPixelsOffset), parseInt(this.yPixelsOffset), this.isomers['grid'].canvas.width, this.isomers['grid'].canvas.height);
		this.getContext('background').clearRect(parseInt(this.xPixelsOffset), parseInt(this.yPixelsOffset), this.isomers['background'].canvas.width, this.isomers['background'].canvas.height);
		this.getContext('models').clearRect(parseInt(this.xPixelsOffset), parseInt(this.yPixelsOffset), this.isomers['models'].canvas.width, this.isomers['models'].canvas.height);
		this.getContext('actions').clearRect(parseInt(this.xPixelsOffset), parseInt(this.yPixelsOffset), this.isomers['actions'].canvas.width, this.isomers['actions'].canvas.height);
	},

	moveWorldView : function(direction) {
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
	},

	translateEverything : function(x, y) {
		this.xPixelsOffset = this.xPixelsOffset - x;
		this.yPixelsOffset = this.yPixelsOffset - y;
		this.getContext('grid').translate(x, y);
		this.getContext('background').translate(x, y);
		this.getContext('models').translate(x, y);
		this.getContext('actions').translate(x, y);
	},

	getNearCell : function(position) {
		var nearPositions = [
			new Point(position.x - 1, position.y, 0),
			new Point(position.x + 1, position.y, 0),
			new Point(position.x, position.y - 1, 0),
			new Point(position.x, position.y + 1, 0),
			new Point(position.x - 1, position.y - 1, 0),
			new Point(position.x + 1, position.y - 1, 0),
			new Point(position.x - 1, position.y + 1, 0),
			new Point(position.x + 1, position.y + 1, 0)
		];
		var positionIndex = Math.floor(Math.random() * 8);
		return nearPositions[positionIndex];
	}

};
