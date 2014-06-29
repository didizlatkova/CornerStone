/// <reference path="../Math/Math.js" />
/// <reference path="Line.js" />
/// <reference path="Point.js" />

var CornerStone = CornerStone || {};

CornerStone.Parallelogram = function (a, b, c, d, points) {
    this.first = a;
    this.second = b;
    this.third = c;
    this.forth = d;
    this.points = points;
    this.state = false;
};

CornerStone.Parallelogram.prototype = function () {
    var math = new CornerStone.Math(),
        line = new CornerStone.Line(),
        point = new CornerStone.Point(),
        clickCount = 0,
        dragData = new Array();

    drawParallelogram = function (ctx) {
        if (dragData[0] == undefined) {
            dragData.push([this.first.x, this.first.y]);
            dragData.push([this.second.x, this.second.y]);
            dragData.push([this.third.x, this.third.y]);
            dragData.push([this.forth.x, this.forth.y]);
        }

        var points = [];
        points = points.concat(line.draw(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]));
        points = points.concat(line.draw(ctx, dragData[1][0], dragData[1][1], dragData[2][0], dragData[2][1]));
        points = points.concat(line.draw(ctx, dragData[2][0], dragData[2][1], dragData[3][0], dragData[3][1]));
        points = points.concat(line.draw(ctx, dragData[0][0], dragData[0][1], dragData[3][0], dragData[3][1]));

        dragData = new Array();
        return points;
    },

    drawTempParallelogram = function (ctx, x, y) {
        var lastPoint = calcLastPoint(dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1], x, y);
        line.draw(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]);
        line.draw(ctx, dragData[1][0], dragData[1][1], x, y);
        line.draw(ctx, dragData[0][0], dragData[0][1], lastPoint.x, lastPoint.y);
        line.draw(ctx, x, y, lastPoint.x, lastPoint.y);
    },

    activateContextMenu = function () {
        CornerStone.contextmenu = false;
    },

    click = function (ev) {
        ev = ev || event;
        point.draw(CornerStone.context, ev.clientX, ev.clientY);
        dragData.push([ev.clientX, ev.clientY]);
        clickCount++;
        if (clickCount == 3) {
            var last = calcLastPoint(dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1], dragData[2][0], dragData[2][1]);

            point.draw(CornerStone.context, last.x, last.y);
            dragData.push([last.x, last.y]);

            var a = new CornerStone.Point(dragData[0][0], dragData[0][1]),
                b = new CornerStone.Point(dragData[1][0], dragData[1][1]),
                c = new CornerStone.Point(dragData[2][0], dragData[2][1]),
                d = new CornerStone.Point(last.x, last.y),
                points = drawParallelogram(CornerStone.context);

            point.draw(CornerStone.context, d.x, d.y);

            definingPoints.push(a);
            definingPoints.push(b);
            definingPoints.push(c);
            definingPoints.push(d);
            elements.parallelograms.push(new CornerStone.Parallelogram(a, b, c, d, points));
            this.first = a;
            this.second = b;
            this.third = c;
            this.forth = d;

            clickCount = 0;
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    };

    move = function (ev) {
        ev = ev || event;
        if (clickCount == 1) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            line.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1], ev.clientX, ev.clientY);
        } else if (clickCount == 2) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawTempParallelogram(CornerStone.tempContext, ev.clientX, ev.clientY);
        };
    };

    calcLastPoint = function (x1, y1, x2, y2, x3, y3) {
        return {
            x: x3 - x2 + x1,
            y: y3 - y2 + y1
        }
    };

    return {
        click: click,
        move: move,
        draw: drawParallelogram,
        activateContextMenu: activateContextMenu
    };
}();