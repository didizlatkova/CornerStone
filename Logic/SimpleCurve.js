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
        lineDrawn = false,
        dragStopped = false,
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

    click = function (ev) {
        if (lineDrawn) {
            if (dragStopped) {
                ev = ev || event;
                point.draw(CornerStone.context, ev.clientX, ev.clientY);	
				math.calcSimpleLine();
				
                lineDrawn = false;
                dragStopped = false;
            }
            else {
                dragStopped = true;
            }
        }        
    };

    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag,
        draw: drawLine,
        click: click,
        activateContextMenu: activateContextMenu
    };
}();