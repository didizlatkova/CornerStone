var CornerStone = CornerStone || {};

CornerStone.PointConstructor = function (x, y) {
	this.x = x;
	this.y = y;
	this.points = [[x, y]];
	this.state = false;
};

CornerStone.LineConstructor = function (start, end, points) {
	this.startPoint = start;
	this.endPoint = end;
	this.points = points;
	this.state = false;
};

CornerStone.RectangleConstructor = function (start, end, points) {
	this.startPoint = start;
	this.endPoint = end;
	this.points = points;
	this.state = false;
};

CornerStone.CircleConstructor = function (start, end, points) {
	this.center = start;
	this.radius = end;
	this.points = points;
	this.state = false;
};

CornerStone.TriangleConstructor = function (a, b, c, points) {
	this.first = a;
	this.second = b;
	this.third = c;
	this.points = points;
	this.state = false;
};