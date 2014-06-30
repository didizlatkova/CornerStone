/// <reference path="../Math/Math.js" />

var CornerStone = CornerStone || {};

CornerStone.SimpleCurve = function (start, end, curve, points) {
    var dragData = null,
        dragging = false;

    this.startPoint = start;
    this.endPoint = end;
    this.curvePoint = curve;
    this.points = points;
    this.state = false;
};

CornerStone.SimpleCurve.prototype = function () {
    var math = new CornerStone.Math(),
        LINE_PARTS = 1000,
        clickCount = 0,
        point = new CornerStone.Point();

    drawLine = function (ctx, x1, y1, x2, y2) {
        if (x1 == undefined) {
            x1 = this.startPoint.x;
            y1 = this.startPoint.y;
            x2 = this.endPoint.x;
            y2 = this.endPoint.y;
        }

        var points = math.calcStraightLine(x1, y1, x2, y2);
        if (points) {
            for (var i = 0; i < points.length; i++) {
                x = points[i][0];
                y = points[i][1];
                ctx.fillRect(x, y, 1, 1);
            }
        }

        lineDrawn = true;
        return points;
    },

    activateContextMenu = function () {
        // no context menu for lines
        CornerStone.contextmenu = false;
    }

    startDrag = function (ev) {
        if (lineDrawn) {
            return;
        }

        ev = ev || event;
        this.dragging = true;
        this.dragData = {
            x: ev.clientX,
            y: ev.clientY
        };
    },

    drag = function (ev, context) {
        if (this.dragData && this.dragging) {
            ev = ev || event;
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawLine(CornerStone.tempContext, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY);
        }
        else if (lineDrawn) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            var points = math.calcSimpleCurve(ev.clientX, ev.clientY, this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
            for (var i = 0; i < points.length; i++) {
                x = points[i][0];
                y = points[i][1];
                CornerStone.tempContext.fillRect(x, y, 1, 1);
            }
        };
    },

    stopDrag = function (ev) {
        if (this.dragData) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ev = ev || event;
            var points = drawLine(CornerStone.context, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY),
                startPoint = new CornerStone.Point(this.dragData.x, this.dragData.y),
                endPoint = new CornerStone.Point(ev.clientX, ev.clientY);
            this.startPoint = startPoint;
            this.endPoint = endPoint;
            definingPoints.push(startPoint);
            definingPoints.push(endPoint);
            elements.lines.push(new CornerStone.Line(startPoint, endPoint, points));
            this.dragging = false;
        }
        this.dragData = null;
    };

    move = function (ev) {
        ev = ev || event;
        if (clickCount == 1) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            point.draw(CornerStone.tempContext, this.startPoint.x, this.startPoint.y);
            drawLine(CornerStone.tempContext, this.startPoint.x, this.startPoint.y, ev.clientX, ev.clientY);
        }
        else if (clickCount == 2) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            point.draw(CornerStone.tempContext, this.startPoint.x, this.startPoint.y);
            point.draw(CornerStone.tempContext, this.endPoint.x, this.endPoint.y);
            var points = math.calcSimpleCurve(ev.clientX, ev.clientY, this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);            
            var x = points[0][0];
            var y = points[0][1];
            if (!isNaN(y)) {
                for (var i = 1; i < points.length; i++) {
                    drawLine(CornerStone.tempContext, Math.floor(x), Math.floor(y), Math.floor(points[i][0]), Math.floor(points[i][1]));
                    x = points[i][0];
                    y = points[i][1];
                }
            }
        };
    };

    click = function (ev) {
        ev = ev || event;
        clickCount++;
        if (clickCount == 1) {
            this.startPoint = new CornerStone.Point(ev.clientX, ev.clientY);
            point.draw(CornerStone.tempContext, this.startPoint.x, this.startPoint.y);
        } else if (clickCount == 2) {
            this.endPoint = new CornerStone.Point(ev.clientX, ev.clientY);
            point.draw(CornerStone.tempContext, this.startPoint.x, this.startPoint.y);
            point.draw(CornerStone.tempContext, this.endPoint.x, this.endPoint.y);
            drawLine(CornerStone.tempContext, Math.floor(this.startPoint.x), Math.floor(this.startPoint.y),
                Math.floor(ev.clientX), Math.floor(ev.clientY));
        } else if (clickCount == 3) {
            this.curvePoint = new CornerStone.Point(ev.clientX, ev.clientY);
            var points = math.calcSimpleCurve(this.curvePoint.x, this.curvePoint.y, this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
            var x = points[0][0];
            var y = points[0][1];
            if (!isNaN(y)) {
                for (var i = 1; i < points.length; i++) {
                    drawLine(CornerStone.context, Math.floor(x), Math.floor(y), Math.floor(points[i][0]), Math.floor(points[i][1]));
                    x = points[i][0];
                    y = points[i][1];
                }

                clickCount = 0;
                CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
            else {
                clickCount--;
            }
        }

    };

    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag,
        draw: drawLine,
        click: click,
        activateContextMenu: activateContextMenu,
        move: move
    };
}();