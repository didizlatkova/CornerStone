var CornerStone = CornerStone || {};

CornerStone.Brush = function () {

};

CornerStone.Brush.prototype = function () {
    var math = new CornerStone.Math(),
        LINE_PARTS = 1000,
        drawLine = function (ctx, x1, y1, x2, y2) {
            var points = math.calcStraightLine(x1, y1, x2, y2);
            if (points) {
            	for (var i = 0; i < points.length; i++) {
                	x = points[i][0];
                	y = points[i][1];
                	ctx.fillRect(x, y, 1, 1);
            	}
            }
        };

    return {
        drawLine: drawLine
    };
}();