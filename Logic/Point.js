/// <reference path="../Math/Math.js" />

var CornerStone = CornerStone || {};

CornerStone.Point = function () {

};

CornerStone.Point.prototype = function () {
    var math = new CornerStone.Math(),
        POINT_RADIUS = 2;

    drawPoint = function (ctx, x1, y1) {
        var points = math.calcFilledCircle(x1, y1, POINT_RADIUS);

        if (points) {
            for (var i = 0; i < points.length; i++) {
                x = points[i][0];
                y = points[i][1];
                ctx.fillRect(x, y, 1, 1);
            }
        }
    },

    click = function (ev) {
        ev = ev || event;
        drawPoint(CornerStone.context, ev.clientX, ev.clientY);
    };

    return {
        click: click,
        drawPoint: drawPoint
    };
}();