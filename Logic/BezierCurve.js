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

    drawTriangle = function (ctx) {
        if (dragData[0] == undefined) {
            dragData.push([this.first.x, this.first.y]);
            dragData.push([this.second.x, this.second.y]);
            dragData.push([this.third.x, this.third.y]);
        }

        var points = [];
        points = points.concat(line.draw(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]));
        points = points.concat(line.draw(ctx, dragData[1][0], dragData[1][1], dragData[2][0], dragData[2][1]));
        points = points.concat(line.draw(ctx, dragData[0][0], dragData[0][1], dragData[2][0], dragData[2][1]));

        dragData = new Array();
        return points;
    },
    
    drawCasteljau = function (anchorPoints) {
        tmp = new CornerStone.Point();
        for (var t = 0; t <= 1; t += 0.001) { 
            tmp = getCasteljauPoint(points.length-1, 0, t);
            //image.SetPixel(tmp.x, tmp.y, color);
        }

        getCasteljauPoint = function(r, i, t) { 
            if(r == 0) return points[i];

            var p1 = getCasteljauPoint(r - 1, i, t),
                p2 = getCasteljauPoint(r - 1, i + 1, t);

            return new  CornerStone.Point((int) ((1 - t) * p1.X + t * p2.X), (int) ((1 - t) * p1.Y + t * p2.Y));
        }
    }


    
    drawTempTriangle = function (ctx, x, y) {
        line.draw(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]);
        line.draw(ctx, dragData[1][0], dragData[1][1], x, y);
        line.draw(ctx, dragData[0][0], dragData[0][1], x, y);
    },

    click = function (ev) {
        ev = ev || event;
        point.draw(CornerStone.context, ev.clientX, ev.clientY);
        dragData.push([ev.clientX, ev.clientY]);
        clickCount++;
        if (clickCount == 3) {
            var a = new CornerStone.Point(dragData[0][0], dragData[0][1]),
                b = new CornerStone.Point(dragData[1][0], dragData[1][1]),
                c = new CornerStone.Point(dragData[2][0], dragData[2][1]),
                    points = drawTriangle(CornerStone.context);

            definingPoints.push(a);
            definingPoints.push(b);
            definingPoints.push(c);
            elements.triangles.push(new CornerStone.Triangle(a, b, c, points));
            this.first = a;
            this.second = b;
            this.third = c;

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
            drawTempTriangle(CornerStone.tempContext, ev.clientX, ev.clientY);
        };
    };

    return {
        click: click,
        move: move,
        draw: drawTriangle
    };
}();