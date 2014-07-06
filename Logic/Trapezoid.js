/// <reference path="../Math/Math.js" />
/// <reference path="Line.js" />
/// <reference path="Point.js" />

var CornerStone = CornerStone || {};

CornerStone.Trapezoid = function (a, b, c, d, points) {
    this.first = a;
    this.second = b;
    this.third = c;
    this.forth = d;
    this.points = points;
    this.state = false;
};

CornerStone.Trapezoid.prototype = function () {
    var math = new CornerStone.Math(),
        line = new CornerStone.Line(),
        point = new CornerStone.Point(),
        clickCount = 0,
        dragData = new Array(),
        circle = new CornerStone.Circle(),

    drawTrapezoid = function (ctx) {
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

    drawTempTrapezoid = function (ctx, x, y) {
        var lastPoint = calcLastPoint(dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1], dragData[2][0], dragData[2][1], x, y);
        line.draw(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]);
        line.draw(ctx, dragData[2][0], dragData[2][1], dragData[1][0], dragData[1][1]);
        line.draw(ctx, dragData[0][0], dragData[0][1], Math.floor(lastPoint.x), Math.floor(lastPoint.y));
        line.draw(ctx, dragData[2][0], dragData[2][1], Math.floor(lastPoint.x), Math.floor(lastPoint.y));
    },

    activateContextMenu = function () {
        CornerStone.contextmenu = true;
        var that = this;

        var menu = [{
            name: 'начертай / диагонал',
            fun: function () {
                drawRightDiagonal.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }, {
            name: 'начертай \\ диагонал',
            fun: function () {
                drawLeftDiagonal.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }
        ];

        $('body').contextMenu(menu, { triggerOn: 'contextmenu' });
    },

    click = function (ev) {
        ev = ev || event;
        if (clickCount == 0 || clickCount == 1 || clickCount == 2) {
            point.draw(CornerStone.context, ev.clientX, ev.clientY);
            dragData.push([ev.clientX, ev.clientY]);
            clickCount++;
        } else if (clickCount == 3) {
            var a = new CornerStone.Point(dragData[0][0], dragData[0][1]),
                b = new CornerStone.Point(dragData[1][0], dragData[1][1]),
                c = new CornerStone.Point(dragData[2][0], dragData[2][1]),
                last = calcLastPoint(a.x, a.y, b.x, b.y, c.x, c.y, ev.clientX, ev.clientY),
                d = new CornerStone.Point(Math.floor(last.x), Math.floor(last.y));

            dragData.push([d.x, d.y]);
            var points = drawTrapezoid(CornerStone.context);

            point.draw(CornerStone.context, d.x, d.y);

            definingPoints.push(a);
            definingPoints.push(b);
            definingPoints.push(c);
            definingPoints.push(d);
            elements.trapezoids.push(new CornerStone.Trapezoid(a, b, c, d, points));
            this.first = a;
            this.second = b;
            this.third = c;
            this.forth = d;

            clickCount = 0;
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    },

    move = function (ev) {
        ev = ev || event;
        if (clickCount == 1) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            line.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1], ev.clientX, ev.clientY);
        } else if (clickCount == 2) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            line.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]);
            line.draw(CornerStone.tempContext, dragData[1][0], dragData[1][1], ev.clientX, ev.clientY);
        } else if (clickCount == 3) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawTempTrapezoid(CornerStone.tempContext, ev.clientX, ev.clientY);
        } ;
    },

    calcLastPoint = function (x1, y1, x2, y2, x3, y3, clientX, clientY) {
        var opt = {
            x: x3 - x2 + x1,
            y: y3 - y2 + y1
        }, slope, results = [],
        args = [[{x: x1, y:y1}, opt, {x: clientX, y: clientY}],[{x: x3, y:y3}, opt, {x: clientX, y: clientY}]];

        for (var i = 0; i < args.length; i++) {
            var xDelta = args[i][1].x - args[i][0].x,
                yDelta = args[i][1].y - args[i][0].y;

            if ((xDelta == 0) && (yDelta == 0)) {
                return; //illegal
            }

            var u = ((args[i][2].x - args[i][0].x) * xDelta + (args[i][2].y - args[i][0].y) * yDelta) / (xDelta * xDelta + yDelta * yDelta),
                closestPoint = [args[i][0].x + u * xDelta, args[i][0].y + u * yDelta];
            results[i] = {x: closestPoint[0], y: closestPoint[1]};
        

            if ((results[i].x - args[i][0].x) * xDelta < 0) {
                results[i].x = args[i][0].x;
            }
            if ((results[i].y - args[i][0].y) * yDelta < 0) {
                results[i].y = args[i][0].y;
            }
        }
        var minDist = Math.abs(results[0].x - clientX),
            minIndex = 0;
        for (var i = 0; i < results.length; i++) {
            if (Math.abs(results[i].x - clientX) < minDist) {
                minDist = Math.abs(results[i].x - clientX);
                minIndex = i;
            }

            if (Math.abs(results[i].y - clientY) < minDist) {
                minDist = Math.abs(results[i].y - clientY);
                minIndex = i;
            }
        };

        return results[minIndex];
    },

    drawRightDiagonal = function (ctx) {
        var x1 = this.second.x;
        var y1 = this.second.y;
        var x2 = this.forth.x;
        var y2 = this.forth.y;
        line.draw(ctx, x1, y1, x2, y2);
    },

    drawLeftDiagonal = function (ctx) {
        var x1 = this.first.x;
        var y1 = this.first.y;
        var x2 = this.third.x;
        var y2 = this.third.y;
        line.draw(ctx, x1, y1, x2, y2);
    }

    return {
        click: click,
        move: move,
        draw: drawTrapezoid,
        activateContextMenu: activateContextMenu
    };
}();