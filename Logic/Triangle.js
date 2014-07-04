/// <reference path="../Math/Math.js" />
/// <reference path="Line.js" />
/// <reference path="Point.js" />
/// <reference path="Circle.js" />

var CornerStone = CornerStone || {};

CornerStone.Triangle = function (a, b, c, points) {
    this.first = a;
    this.second = b;
    this.third = c;
    this.points = points;
    this.state = false;
};

CornerStone.Triangle.prototype = function () {
    var math = new CornerStone.Math(),
        line = new CornerStone.Line(),
        point = new CornerStone.Point(),
        circle = new CornerStone.Circle(),
        clickCount = 0,
        dragData = new Array();

    drawTriangle = function (ctx) {
        if (dragData[0] == undefined) {
            dragData.push([this.first.x, this.first.y]);
            dragData.push([this.second.x, this.second.y]);
            dragData.push([this.third.x, this.third.y]);
        }

        var points = [];
        points = points.concat(line.draw(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]));
        points = points.concat(line.draw(ctx, dragData[1][0], dragData[1][1], dragData[2][0], dragData[2][1]));
        points = points.concat(line.draw(ctx, dragData[0][0], dragData[0][1], dragData[2][0], dragData[2][1]));

        dragData = new Array();
        return points;
    },

    drawTempTriangle = function (ctx, x, y) {
        line.draw(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]);
        line.draw(ctx, dragData[1][0], dragData[1][1], x, y);
        line.draw(ctx, dragData[0][0], dragData[0][1], x, y);
    },

    drawHeight = function (ctx) {
        //TODO move and refactor this + draw line for not-acute triangles
        var xDelta = this.second.x - this.first.x,
            yDelta = this.second.y - this.first.y;

        if ((xDelta == 0) && (yDelta == 0)) {
            return; //illegal
        }

        var u = ((this.third.x - this.first.x) * xDelta + (this.third.y - this.first.y) * yDelta) / (xDelta * xDelta + yDelta * yDelta),
            closestPoint = [this.first.x + u * xDelta, this.first.y + u * yDelta];

        line.draw(ctx, Math.round(closestPoint[0]), Math.round(closestPoint[1]), this.third.x, this.third.y);
    },

    drawMedian = function (ctx) {
        var midpoint = {
            x: (this.first.x + this.second.x) / 2,
            y: (this.first.y + this.second.y) / 2
        }

        line.draw(ctx, Math.round(midpoint.x), Math.round(midpoint.y), this.third.x, this.third.y);
    },

    drawBisector = function (ctx) {
        var a = math.calcDistance(this.first.x, this.first.y, this.third.x, this.third.y);
        var b = math.calcDistance(this.second.x, this.second.y, this.third.x, this.third.y);

        var xDelta = this.second.x - this.first.x,
            yDelta = this.second.y - this.first.y;
        var proportion = a / (a + b);

        line.draw(ctx, Math.round(this.first.x + proportion * xDelta), Math.round(this.first.y + proportion * yDelta), this.third.x, this.third.y);
    },

    drawOutsideCircle = function (ctx) {
        var x1 = this.first.x;
        var y1 = this.first.y;
        var x2 = this.second.x;
        var y2 = this.second.y;
        var x3 = this.third.x;
        var y3 = this.third.y;

        var slope1 = math.calcSlope(x1, y1, x2, y2);
        var slope2 = math.calcSlope(x2, y2, x3, y3);

        var x = (slope1 * slope2 * (y3 - y1) + slope1 * (x2 + x3) - slope2 * (x1 + x2)) / (2 * (slope1 - slope2));
        var y = -1 / slope1 * (x - (x1 + x2) / 2) + (y1 + y2) / 2;

        circle.draw(ctx, Math.floor(x), Math.floor(y), x1, y1);
    },

    drawInsideCircle = function (ctx) {
        var x1 = this.first.x;
        var y1 = this.first.y;
        var x2 = this.second.x;
        var y2 = this.second.y;
        var x3 = this.third.x;
        var y3 = this.third.y;

        var a = math.calcDistance(x2, y2, x3, y3);
        var b = math.calcDistance(x1, y1, x3, y3);
        var c = math.calcDistance(x1, y1, x2, y2);

        var P = a + b + c;
        var p = (a + b + c) / 2;

        var x = (a * x1 + b * x2 + c * x3) / P;
        var y = (a * y1 + b * y2 + c * y3) / P;
        var radius = Math.sqrt((p - a) * (p - b) * (p - c) / p);

        circle.drawWithRadius(ctx, Math.floor(x), Math.floor(y), radius);
    }

    activateContextMenu = function () {
        CornerStone.contextmenu = true;
        var that = this;

        var menu = [{
            name: 'начертай височина',
            fun: function () {
                drawHeight.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }, {
            name: 'начертай медиана',
            fun: function () {
                drawMedian.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }, {
            name: 'начертай ъглополовяща',
            fun: function () {
                drawBisector.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }, {
            name: 'начертай описана окръжност',
            fun: function () {
                drawOutsideCircle.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }, {
            name: 'начертай вписана окръжност',
            fun: function () {
                drawInsideCircle.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }];

        $('body').contextMenu(menu, { triggerOn: 'contextmenu' });
    },

    click = function (ev) {
        ev = ev || event;
        point.draw(CornerStone.context, ev.clientX, ev.clientY);
        dragData.push([ev.clientX, ev.clientY]);
        clickCount++;
        if (clickCount == 3) {
            var a = new CornerStone.Point(dragData[0][0], dragData[0][1]),
                b = new CornerStone.Point(dragData[1][0], dragData[1][1]),
                c = new CornerStone.Point(dragData[2][0], dragData[2][1]),
                    points = drawTriangle(CornerStone.context);

            definingPoints.push(a);
            definingPoints.push(b);
            definingPoints.push(c);
            elements.triangles.push(new CornerStone.Triangle(a, b, c, points));
            this.first = a;
            this.second = b;
            this.third = c;

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
            drawTempTriangle(CornerStone.tempContext, ev.clientX, ev.clientY);
        };
    }

    return {
        click: click,
        move: move,
        draw: drawTriangle,
        activateContextMenu: activateContextMenu
    };
}();