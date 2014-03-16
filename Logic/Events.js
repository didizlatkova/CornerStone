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
            //drag = function (ev, context) {
            //    if (this.dragData && this.dragging) {
            //        ev = ev || event;
            //        context.beginPath();
            //        context.moveTo(dragData.x, dragData.y);
            //        context.lineTo(ev.clientX, ev.clientY);
            //        context.lineWidth = 5;
            //        context.strokeStyle = 'blue';
            //        context.stroke();
            //        dragData = {
            //            x: ev.clientX,
            //            y: ev.clientY
            //        };
            //    }
            //},
            stopLineDrag = function (ev) {
                if (this.dragData) {
                    ev = ev || event;
                    brush.drawLine(context, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY);
                }
            };

    return {
        startDrag: startDrag,
       // drag: drag,
        stopLineDrag: stopLineDrag
    };
}();