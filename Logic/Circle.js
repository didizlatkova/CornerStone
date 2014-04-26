/// <reference path="../Math/Math.js" />

var CornerStone = CornerStone || {};

CornerStone.Circle = function (start, end, points) {
    var dragData = null,
        dragging = false;

    this.center = start;
    this.radius = end;
    this.points = points;
    this.state = false;
};

CornerStone.Circle.prototype = function () {
    var math = new CornerStone.Math(),

    drawCircle = function (ctx, x1, y1, x2, y2) {
        if (x1 == undefined) {
            x1 = this.center.x;
            y1 = this.center.y;
            var radius = this.radius;
        }
        else {
            var radius = math.calcDistance(x1, y1, x2, y2);
        }

        var points = math.calcCircle(x1, y1, radius);

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
            drawCircle(CornerStone.tempContext, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY);
        }
    },

    stopDrag = function (ev) {
        if (this.dragData) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ev = ev || event;
            var points = drawCircle(CornerStone.context, this.dragData.x, this.dragData.y, ev.clientX, ev.clientY),
                o = new CornerStone.Point(this.dragData.x, this.dragData.y),
                r = math.calcDistance(this.dragData.x, this.dragData.y, ev.clientX, ev.clientY);

            definingPoints.push(o);
            elements.circles.push(new CornerStone.Circle(o, r, points));

            this.center = o;
            this.radius = r;

            this.dragging = false;
        }
        this.dragData = null;
    };

    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag,
        draw : drawCircle
    };
}();