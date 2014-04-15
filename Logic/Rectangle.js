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
        line.drawLine(context, x1, y1, x2, y1);
        line.drawLine(context, x2, y1, x2, y2);
        line.drawLine(context, x2, y2, x1, y2);
        line.drawLine(context, x1, y2, x1, y1);
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
            drawRectangle(CornerStone.context, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY);
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