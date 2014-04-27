/// <reference path="../Math/Math.js" />

var CornerStone = CornerStone || {};

CornerStone.Point = function (x, y) {
    this.x = x;
    this.y = y;
    this.points = [[x, y]];
    this.state = false;
};

CornerStone.Point.prototype = function () {
    var math = new CornerStone.Math(),
        POINT_RADIUS = 2;

    drawPoint = function (ctx, x1, y1) {
        if (x1 == undefined) {
            x1 = this.x;
            y1 = this.y;
        }
        var points = math.calcFilledCircle(x1, y1, POINT_RADIUS);

        if (points) {
            for (var i = 0; i < points.length; i++) {
                x = points[i][0];
                y = points[i][1];
                ctx.fillRect(x, y, 1, 1);
            }
        }
    },

    activateContextMenu = function () {
        // no context menu for points
        CornerStone.contextmenu = false;
    },

    click = function (ev) {
        ev = ev || event;
        this.x = ev.clientX;
        this.y = ev.clientY;
        drawPoint(CornerStone.context, ev.clientX, ev.clientY);
        elements.points.push(new CornerStone.Point(ev.clientX, ev.clientY));
    };

    return {
        click: click,
        draw: drawPoint,
        activateContextMenu: activateContextMenu
    };
}();