/// <reference path="../Math/Math.js" />
/// <reference path="Line.js" />
/// <reference path="Point.js" />

var CornerStone = CornerStone || {};

CornerStone.Triangle = function () {

};

CornerStone.Triangle.prototype = function () {
    var math = new CornerStone.Math(),
        line = new CornerStone.Line(),
        point = new CornerStone.Point(),
        clickCount = 0,
        dragData = new Array();

    drawTriangle = function (ctx) {
        var points = [];
        points = points.concat(line.drawLine(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]));
        points = points.concat(line.drawLine(ctx, dragData[1][0], dragData[1][1], dragData[2][0], dragData[2][1]));
        points = points.concat(line.drawLine(ctx, dragData[0][0], dragData[0][1], dragData[2][0], dragData[2][1]));
        return points;
    },

    drawTempTriangle = function (ctx, x, y) {
        line.drawLine(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]);
        line.drawLine(ctx, dragData[1][0], dragData[1][1], x, y);
        line.drawLine(ctx, dragData[0][0], dragData[0][1], x, y);
    },

    drawHeight = function (ctx) {
        //TODO move and refactor this + draw line for not-acute triangles
        var xDelta = dragData[1][0] - dragData[0][0],
            yDelta = dragData[1][1] - dragData[0][1];

        if ((xDelta == 0) && (yDelta == 0)) {
            return; //illegal
        }

        var u = ((dragData[2][0] - dragData[0][0]) * xDelta + (dragData[2][1] - dragData[0][1]) * yDelta) / (xDelta * xDelta + yDelta * yDelta),
            closestPoint = [dragData[0][0] + u * xDelta, dragData[0][1] + u * yDelta];

        line.drawLine(ctx, Math.round(closestPoint[0]), Math.round(closestPoint[1]) , dragData[2][0], dragData[2][1]);
    },

    click = function (ev) {
        ev = ev || event;
        point.drawPoint(CornerStone.context, ev.clientX, ev.clientY);
        dragData.push([ev.clientX, ev.clientY]);
        clickCount++;
        if (clickCount == 3) {
            var points = drawTriangle(CornerStone.context),
                a = new CornerStone.PointConstructor(dragData[0][0], dragData[0][1]),
                b = new CornerStone.PointConstructor(dragData[1][0], dragData[1][1]),
                c = new CornerStone.PointConstructor(dragData[2][0], dragData[2][1]);
            elements.points.push(a);
            elements.points.push(b);
            elements.points.push(c);
            elements.triangles.push(new CornerStone.TriangleConstructor(a, b, c, points));

            drawHeight(CornerStone.context);

            clickCount = 0;
            dragData = new Array();
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }        
    };

    move = function (ev) {
        ev = ev || event;
        if (clickCount == 1) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            line.drawLine(CornerStone.tempContext, dragData[0][0], dragData[0][1], ev.clientX, ev.clientY);
        } else if (clickCount == 2) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawTempTriangle(CornerStone.tempContext, ev.clientX, ev.clientY);
        };
    };

    return {
        click: click,
        move: move
    };
}();