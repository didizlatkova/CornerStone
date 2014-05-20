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
        for (var t = 0; t <= 1; t += 0.001) { 
            var tempPoint = getCasteljauPoint(anchors.length-1, 0, t, anchors);
            //console.log(tempPoint);
            points = points.concat(tempPoint);
            ctx.fillRect(tempPoint.x, tempPoint.y, 1, 1);
        }
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
        point.draw(CornerStone.context, ev.clientX, ev.clientY);
        dragData.push([ev.clientX, ev.clientY]);
        clickCount++;
        if (clickCount == 3) {
            var a = new CornerStone.Point(dragData[0][0], dragData[0][1]),
                b = new CornerStone.Point(dragData[1][0], dragData[1][1]),
                c = new CornerStone.Point(dragData[2][0], dragData[2][1]),
                anchors = [a,b,c],
                points = drawCasteljau(CornerStone.context, anchors);

            definingPoints.push(a);
            definingPoints.push(b);
            definingPoints.push(c);
            
            this.first = a;
            this.second = b;
            this.third = c;

            elements.curves.push(new CornerStone.BezierCurve(a, b, c, points));

            clickCount = 0;
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    };

    move = function (ev) {
        ev = ev || event;
        if (clickCount == 1) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            line.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1], ev.clientX, ev.clientY);
        } else if (clickCount == 2) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            line.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]);
            line.draw(CornerStone.tempContext, dragData[1][0], dragData[1][1], ev.clientX, ev.clientY);
        };
    };

    return {
        click: click,
        move: move,
        draw: drawCasteljau
    };
}();