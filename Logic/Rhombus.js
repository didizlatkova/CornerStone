/// <reference path="../Math/Math.js" />
/// <reference path="Line.js" />
/// <reference path="Point.js" />

var CornerStone = CornerStone || {};

CornerStone.Rhombus = function (a, b, c, d, points) {
    this.first = a;
    this.second = b;
    this.third = c;
    this.forth = d;
    this.points = points;
    this.state = false;
};

CornerStone.Rhombus.prototype = function () {
    var math = new CornerStone.Math(),
        line = new CornerStone.Line(),
        point = new CornerStone.Point(),
        clickCount = 0,
        dragData = new Array(),
        circle = new CornerStone.Circle(),

    drawRhombus = function (ctx) {
        if (dragData[0] == undefined) {
            dragData.push([this.first.x, this.first.y]);
            dragData.push([this.second.x, this.second.y]);
            dragData.push([this.third.x, this.third.y]);
            dragData.push([this.forth.x, this.forth.y]);
        }

        var points = [];
        points = points.concat(line.draw(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]));
        points = points.concat(line.draw(ctx, dragData[1][0], dragData[1][1], dragData[2][0], dragData[2][1]));
        points = points.concat(line.draw(ctx, dragData[2][0], dragData[2][1], dragData[3][0], dragData[3][1]));
        points = points.concat(line.draw(ctx, dragData[0][0], dragData[0][1], dragData[3][0], dragData[3][1]));

        dragData = new Array();
        return points;
    },

    drawTempRhombus = function (ctx, x, y) {
        var lastPoint = calcLastPoint(dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1], x, y);
        line.draw(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]);
        line.draw(ctx, dragData[1][0], dragData[1][1], x, y);
        line.draw(ctx, dragData[0][0], dragData[0][1], lastPoint.x, lastPoint.y);
        line.draw(ctx, x, y, lastPoint.x, lastPoint.y);
    },

    activateContextMenu = function () {
        CornerStone.contextmenu = true;
        var that = this;

        var menu = [{
            name: '�������� / ��������',
            fun: function () {
                drawRightDiagonal.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }, {
            name: '�������� \\ ��������',
            fun: function () {
                drawLeftDiagonal.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }, {
            name: '�������� ������� ���������',
            fun: function () {
                drawInsideCircle.call(that, CornerStone.context);
                $('body').contextMenu('close');
            }
        }
        ];

        $('body').contextMenu(menu, { triggerOn: 'contextmenu' });
    },

    click = function (ev) {
        ev = ev || event;
        if (clickCount == 0 || clickCount == 1) {
            point.draw(CornerStone.context, ev.clientX, ev.clientY);
            dragData.push([ev.clientX, ev.clientY]);
            clickCount++;
        } else if (clickCount == 2) {
            var r = Math.floor(math.calcDistance(dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1])),
                circle = math.calcCircle(dragData[1][0], dragData[1][1], r),
                tempPoint = circle[0],
                minDist = Math.floor(math.calcDistance(tempPoint[0], tempPoint[1], ev.clientX, ev.clientY));

            for (var i = 1; i < circle.length; i = i + 9) {
                var dist = Math.floor(math.calcDistance(circle[i][0], circle[i][1], ev.clientX, ev.clientY));
                if (dist < minDist) {
                    minDist = dist;
                    tempPoint = circle[i];
                };
            };
            dragData.push(tempPoint);
            point.draw(CornerStone.context, tempPoint[0], tempPoint[1]);
            var last = calcLastPoint(dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1], dragData[2][0], dragData[2][1]);

            point.draw(CornerStone.context, last.x, last.y);
            dragData.push([last.x, last.y]);

            var a = new CornerStone.Point(dragData[0][0], dragData[0][1]),
                b = new CornerStone.Point(dragData[1][0], dragData[1][1]),
                c = new CornerStone.Point(dragData[2][0], dragData[2][1]),
                d = new CornerStone.Point(last.x, last.y),
                points = drawRhombus(CornerStone.context);

            point.draw(CornerStone.context, d.x, d.y);

            definingPoints.push(a);
            definingPoints.push(b);
            definingPoints.push(c);
            definingPoints.push(d);
            elements.rhombus.push(new CornerStone.Rhombus(a, b, c, d, points));
            this.first = a;
            this.second = b;
            this.third = c;
            this.forth = d;

            clickCount = 0;
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    },

    move = function (ev) {
        ev = ev || event;
        if (clickCount == 1) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            line.draw(CornerStone.tempContext, dragData[0][0], dragData[0][1], ev.clientX, ev.clientY);
        } else if (clickCount == 2) {
            CornerStone.tempContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            var r = Math.floor(math.calcDistance(dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1])),
                circle = math.calcCircle(dragData[1][0], dragData[1][1], r),
                tempPoint = circle[0],
                minDist = Math.floor(math.calcDistance(tempPoint[0], tempPoint[1], ev.clientX, ev.clientY));

            for (var i = 1; i < circle.length; i = i + 9) {
                var dist = Math.floor(math.calcDistance(circle[i][0], circle[i][1], ev.clientX, ev.clientY));
                if (dist < minDist) {
                    minDist = dist;
                    tempPoint = circle[i];
                };
            };
            drawTempRhombus(CornerStone.tempContext, tempPoint[0], tempPoint[1]);
        };
    },

    calcLastPoint = function (x1, y1, x2, y2, x3, y3) {
        return {
            x: x3 - x2 + x1,
            y: y3 - y2 + y1
        }
    },
    
    drawRightDiagonal = function (ctx) {
        var x1 = this.second.x;
        var y1 = this.second.y;
        var x2 = this.forth.x;
        var y2 = this.forth.y;
        line.draw(ctx, x1, y1, x2, y2);
    },

    drawLeftDiagonal = function (ctx) {
        var x1 = this.first.x;
        var y1 = this.first.y;
        var x2 = this.third.x;
        var y2 = this.third.y;
        line.draw(ctx, x1, y1, x2, y2);
    },

    drawInsideCircle = function (ctx) {
        var x1 = this.first.x;
        var y1 = this.first.y;
        var x2 = this.third.x;
        var y2 = this.third.y;
        circle.draw(ctx, (x1 + x2) / 2, (y1 + y2) / 2, (x1 + x2) / 2, y1);
    }

    return {
        click: click,
        move: move,
        draw: drawRhombus,
        activateContextMenu: activateContextMenu
    };
}();