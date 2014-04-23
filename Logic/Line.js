/// <reference path="../Math/Math.js" />

var CornerStone = CornerStone || {};

CornerStone.Line = function () {
    var dragData = null,
        dragging = false;
};

CornerStone.Line.prototype = function () {
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
            return points;
        },

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
                    startPoint = new CornerStone.PointConstructor(this.dragData.x, this.dragData.y),
                    endPoint = new CornerStone.PointConstructor(ev.clientX, ev.clientY);
                elements.points.push(startPoint);
                elements.points.push(endPoint);
                elements.lines.push(new CornerStone.LineConstructor(startPoint, endPoint, points));
                this.dragging = false;
            }
            this.dragData = null;
        };

    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag,
        drawLine: drawLine
    };
}();