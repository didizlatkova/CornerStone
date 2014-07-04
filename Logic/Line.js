/// <reference path="../Math/Math.js" />

var CornerStone = CornerStone || {};

CornerStone.Line = function (start, end, points) {
    var dragData = null,
        dragging = false;

    this.startPoint = start;
    this.endPoint = end;
    this.points = points;
    this.state = false;
};

CornerStone.Line.prototype = function () {
    var math = new CornerStone.Math(),
        LINE_PARTS = 1000,

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
            return points;
        },

        activateContextMenu = function () {
            CornerStone.contextmenu = true;
            var that = this;

            var menu = [{
                name: 'направи безкрайна права',
                fun: function () {
                    drawInfiniteLine.call(that, CornerStone.context);
                    $('body').contextMenu('close');
                }
            }];

            $('body').contextMenu(menu, { triggerOn: 'contextmenu' });
        }

    startDrag = function (ev) {
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
    },

    drawInfiniteLine = function (ctx) {
        x1 = this.startPoint.x;
        y1 = this.startPoint.y;
        x2 = this.endPoint.x;
        y2 = this.endPoint.y;

        var b = math.calcIntercept(x1, y1, x2, y2);
        var slope = math.calcSlope(x1, y1, x2, y2);

        if (slope == 0) {
            if (x1 == x2) {
                drawLine(ctx, x1, 0, x1, 700);
            } else {
                drawLine(ctx, 0, y1, 900, y1);
            }
        } else if (slope < 0) {
            var startX = -b / slope;
            var endY = b;

            drawLine(ctx, Math.floor(startX), 0, 0, Math.floor(endY));
        } else {
            var startY = b;
            var endX = (700 - b) / slope;

            drawLine(ctx, 0, Math.floor(startY), Math.floor(endX), 700);
        }
    }

    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag,
        draw: drawLine,
        activateContextMenu: activateContextMenu
    };
}();