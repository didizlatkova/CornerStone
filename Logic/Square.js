/// <reference path="Line.js" />
/// <reference path="../Math/Math.js" />

var CornerStone = CornerStone || {};

CornerStone.Square = function (start, end, points) {
    var dragData = null,
        dragging = false;

    this.startPoint = start;
    this.endPoint = end;
    this.points = points;
    this.state = false;
};

CornerStone.Square.prototype = function () {
    var math = new CornerStone.Math(),
        line = new CornerStone.Line(),

    drawSquare = function (context, x1, y1, x2, y2) {
        if (x1 == undefined) {
            x1 = this.startPoint.x;
            y1 = this.startPoint.y;
            x2 = this.endPoint.x;
            y2 = this.endPoint.y;
        }

        var points = [];
        points = points.concat(line.draw(context, x1, y1, x2, y1));
        points = points.concat(line.draw(context, x2, y1, x2, y2));
        points = points.concat(line.draw(context, x2, y2, x1, y2));
        points = points.concat(line.draw(context, x1, y2, x1, y1));
        return points;
    },

    activateContextMenu = function () {
        // no context menu for Squares (for now)
        CornerStone.contextmenu = false;
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
            var end = getSecondPoint(this.dragData.x, this.dragData.y, ev.clientX, ev.clientY);
            drawSquare(CornerStone.tempContext, this.dragData.x, this.dragData.y, end.x, end.y);
        }
    },

    stopDrag = function (ev) {
        if (this.dragData) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ev = ev || event;
            var end = getSecondPoint(this.dragData.x, this.dragData.y, ev.clientX, ev.clientY),
                points = drawSquare(CornerStone.context, this.dragData.x, this.dragData.y, end.x, end.y),
                start = new CornerStone.Point(this.dragData.x, this.dragData.y),
                end = new CornerStone.Point(end.x, end.y);
            definingPoints.push(start);
            definingPoints.push(end);
            this.startPoint = start;
            this.endPoint = end;
            elements.squares.push(new CornerStone.Square(start, end, points));

            this.dragging = false;
        }
        this.dragData = null;
    };

    getSecondPoint = function (x1, y1, x2, y2) {
        if(Math.abs(x1-x2) < Math.abs(y1-y2)) {
            return {
                x: x2,
                y: y1 < y2 ? y1 + Math.abs(x1-x2) : y1 - Math.abs(x1-x2)
            }
        } else {
            return {
                x: x1 < x2 ? x1 + Math.abs(y1-y2) : x1 - Math.abs(y1-y2),
                y: y2
            }
        }
    }

    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag,
        draw: drawSquare,
        activateContextMenu: activateContextMenu
    };
}();