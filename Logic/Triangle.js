/// <reference path="../Math/Math.js" />
/// <reference path="Line.js" />
/// <reference path="Point.js" />

var CornerStone = CornerStone || {};

CornerStone.Triangle = function () {

};

CornerStone.Triangle.prototype = function () {
    var math = new CornerStone.Math(),
        line = new CornerStone.Line(),
        point = new CornerStone.Point(),
        clickCount = 0,
        dragData = new Array();

    drawTriangle = function (ctx) {
        line.drawLine(ctx, dragData[0][0], dragData[0][1], dragData[1][0], dragData[1][1]);
        line.drawLine(ctx, dragData[1][0], dragData[1][1], dragData[2][0], dragData[2][1]);
        line.drawLine(ctx, dragData[0][0], dragData[0][1], dragData[2][0], dragData[2][1]);
    },

    click = function (ev) {
        ev = ev || event;
        point.drawPoint(CornerStone.context, ev.clientX, ev.clientY);
        dragData.push([ev.clientX, ev.clientY]);
        clickCount++;
        if (clickCount == 3) {
            drawTriangle(CornerStone.context);
            clickCount = 0;
            dragData = new Array();
        }        
    };

    return {
        click: click
    };
}();