/// <reference path="Line.js" />
/// <reference path="../Math/Math.js" />

var CornerStone = CornerStone || {};

CornerStone.Rectangle = function () {
    var dragData = null,
        dragging = false;
};

CornerStone.Rectangle.prototype = function () {
    var math = new CornerStone.Math(),
        line = new CornerStone.Line(),

    drawRectangle = function (context, x1, y1, x2, y2) {
        var points = [];
        points = points.concat(line.drawLine(context, x1, y1, x2, y1));
        points = points.concat(line.drawLine(context, x2, y1, x2, y2));
        points = points.concat(line.drawLine(context, x2, y2, x1, y2));
        points = points.concat(line.drawLine(context, x1, y2, x1, y1));
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
            drawRectangle(CornerStone.tempContext, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY);
        }
    },

    stopDrag = function (ev) {
        if (this.dragData) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ev = ev || event;
            var points = drawRectangle(CornerStone.context, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY),
                start = new CornerStone.PointConstructor(this.dragData.x, this.dragData.y),
                end = new CornerStone.PointConstructor(ev.clientX, ev.clientY);
            elements.points.push(start);
            elements.points.push(end);
            elements.rectangles.push(new CornerStone.RectangleConstructor(start, end, points));

            this.dragging = false;
        }
        this.dragData = null;
    };

    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag
    };
}();