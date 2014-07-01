/// <reference path="../Math/Math.js" />
/// <reference path="Line.js" />

var CornerStone = CornerStone || {};

CornerStone.Drawing = function (points) {
    var dragData = null,
        dragging = false;

    this.points = points;
    this.state = false;
};

CornerStone.Drawing.prototype = function () {
    var line = new CornerStone.Line(),

        startDrag = function (ev) {
            ev = ev || event;
            this.dragging = true;
            this.dragData = {
                x: ev.clientX,
                y: ev.clientY
            };
            this.points = new Array();
        },

        drag = function (ev, context) {
            if (this.dragData && this.dragging) {
                ev = ev || event;
                line.draw(CornerStone.context, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY, 1, 1);
                this.dragData.x = ev.clientX;
                this.dragData.y = ev.clientY;
                this.points.push([ev.clientX, ev.clientY]);
            }
        },

        stopDrag = function (ev) {
            if (this.dragData) {
                ev = ev || event;
                line.draw(CornerStone.context, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY, 1, 1);
                this.points.push([ev.clientX, ev.clientY]);
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