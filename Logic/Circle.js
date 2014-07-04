/// <reference path="../Math/Math.js" />
/// <reference path="Point.js" />
/// <reference path="Line.js" />

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
        line = new CornerStone.Line(),
        point = new CornerStone.Point(),

    drawCircle = function (ctx, x1, y1, x2, y2) {
        if (x1 == undefined) {
            x1 = this.center.x;
            y1 = this.center.y;
            var radius = this.radius;
        }
        else {
            var radius = math.calcDistance(x1, y1, x2, y2);
        }

        drawCircleWithRadius(ctx, x1, y1, radius);
    },

    drawCircleWithRadius = function (ctx, x1, y1, radius) {
        var points = math.calcCircle(x1, y1, radius);

        if (points) {
            for (var i = 0; i < points.length; i++) {
                x = points[i][0];
                y = points[i][1];
                ctx.fillRect(x, y, 1, 1);
            }
        }
        return points;
    }

    activateContextMenu = function () {
        CornerStone.contextmenu = true;
        var that = this;

        var menu = [{
            name: 'начертай радиус',
            fun: function () {
                drawRadius.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }, {
            name: 'начертай диаметър',
            fun: function () {
                drawDiameter.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }, {
            name: 'начертай център',
            fun: function () {
                drawCenter.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }];

        $('body').contextMenu(menu, { triggerOn: 'contextmenu' });
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
    },

    drawRadius = function (ctx) {
        line.draw(ctx, Math.floor(this.points[0][0]), Math.floor(this.points[0][1]), this.center.x, this.center.y);
    },

    drawDiameter = function (ctx) {
        line.draw(ctx, Math.floor(this.points[0][0]), Math.floor(this.points[0][1]), Math.floor(this.center.x - this.radius), this.center.y);
    },

    drawCenter = function (ctx) {        
        point.draw(ctx, this.center.x, this.center.y);
    }

    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag,
        draw: drawCircle,
        drawWithRadius : drawCircleWithRadius,
        activateContextMenu: activateContextMenu
    };
}();