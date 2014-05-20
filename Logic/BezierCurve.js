/// <reference path="../Math/Math.js" />
/// <reference path="Line.js" />
/// <reference path="Point.js" />

var CornerStone = CornerStone || {};

CornerStone.BezierCurve = function (a, b, c, points) {
    this.first = a;
    this.second = b;
    this.third = c;
    this.points = points;
    this.state = false;
};

CornerStone.BezierCurve.prototype = function () {
    var math = new CornerStone.Math(),
        line = new CornerStone.Line(),
        point = new CornerStone.Point(),
        clickCount = 0,
        dragData = new Array();
    
    drawCasteljau = function (ctx, anchors) {
        var points = [];
        for (var t = 0; t <= 1; t += 0.01) { 
            var tempPoint = getCasteljauPoint(anchors.length-1, 0, t, anchors);
            points.push(tempPoint);
            ctx.fillRect(tempPoint.x, tempPoint.y, 1, 1);
            if (points.length > 1) {
                line.draw(ctx, tempPoint.x, tempPoint.y, points[points.length-2].x, points[points.length-2].y);
            };
        }
        line.draw(ctx, points[points.length-1].x, points[points.length-1].y, anchors[anchors.length-1].x, anchors[anchors.length-1].y);
        return points;    
    }

    getCasteljauPoint = function(r, i, t, anchors) { 
            if(r == 0) return anchors[i];

            var p1 = getCasteljauPoint(r - 1, i, t, anchors),
                p2 = getCasteljauPoint(r - 1, i + 1, t, anchors);

            return new CornerStone.Point(Math.round((1 - t) * p1.x + t * p2.x), Math.round((1 - t) * p1.y + t * p2.y));
        }

    click = function (ev) {
        ev = ev || event;
        dragData.push([ev.clientX, ev.clientY]);
        clickCount++;
        if (clickCount == 1) {
            point.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1]);
        } else if (clickCount == 2) {
            point.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1]);
            point.draw(CornerStone.tempContext, dragData[1][0], dragData[1][1]);
        } else if (clickCount == 3) {
            var a = new CornerStone.Point(dragData[0][0], dragData[0][1]),
                c = new CornerStone.Point(dragData[1][0], dragData[1][1]),
                b = new CornerStone.Point(dragData[2][0], dragData[2][1]),
                anchors = [a,b,c],
                points = drawCasteljau(CornerStone.context, anchors);

            definingPoints.push(a);
            definingPoints.push(b);
            definingPoints.push(c);
            
            this.first = a;
            this.second = b;
            this.third = c;

            elements.bezierCurves.push(new CornerStone.BezierCurve(a, b, c, points));

            clickCount = 0;
            dragData = new Array();
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    };

    move = function (ev) {
        ev = ev || event;
        if (clickCount == 1) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            point.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1]);
            line.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1], ev.clientX, ev.clientY);
        } else if (clickCount == 2) {
            var a = new CornerStone.Point(dragData[0][0], dragData[0][1]),
                c = new CornerStone.Point(dragData[1][0], dragData[1][1]),
                b = new CornerStone.Point(ev.clientX, ev.clientY),
                anchors = [a,b,c];
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            point.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1]);
            point.draw(CornerStone.tempContext, dragData[1][0], dragData[1][1]);
            drawCasteljau(CornerStone.tempContext, anchors);
        };
    };

    return {
        click: click,
        move: move,
        draw: drawCasteljau
    };
}();