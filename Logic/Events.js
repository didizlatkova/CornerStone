var CornerStone = CornerStone || {};

CornerStone.Events = function () {
    var dragData = null,
        dragging = false;
};

CornerStone.Events.prototype = function () {
    var brush = new CornerStone.Brush(),
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
                    tempContext.clearRect (0, 0, 900, 700);
                    brush.drawLine(tempContext, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY); 
                }
            },
            stopLineDrag = function (ev) {
                if (this.dragData) {
                    ev = ev || event;
                    brush.drawLine(context, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY);
                    this.dragging = false;
                }
            };

    return {
        startDrag: startDrag,
        drag: drag,
        stopLineDrag: stopLineDrag
    };
}();