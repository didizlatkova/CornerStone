﻿/// <reference path="../Logic/Cursor.js" />
/// <reference path="../Logic/Line.js" />
/// <reference path="../Logic/Rectangle.js" />
/// <reference path="../Logic/Circle.js" />
/// <reference path="../Logic/Point.js" />
/// <reference path="../Logic/Triangle.js" />

var CornerStone = CornerStone || {};

CornerStone.toolbox = function () {
    var line = new CornerStone.Line(),
        drawing = new CornerStone.Drawing(),
        cursor = new CornerStone.Cursor(),
        rectangle = new CornerStone.Rectangle(),
        square = new CornerStone.Square(),
        circle = new CornerStone.Circle(),
        point = new CornerStone.Point(),
        triangle = new CornerStone.Triangle(),
        parallelogram = new CornerStone.Parallelogram(),
        rhombus = new CornerStone.Rhombus(),
        trapezoid = new CornerStone.Trapezoid(),
        bezier = new CornerStone.BezierCurve(),
        curve = new CornerStone.SimpleCurve();


    var removeEvents = function () {
        $(CornerStone.tempCanvas).unbind('mousedown');
        $(CornerStone.tempCanvas).unbind('mousemove');
        $(CornerStone.tempCanvas).unbind('mouseup');
        $(CornerStone.tempCanvas).unbind('click');
    };

    var addEvents = function (selectedTool) {
        switch (selectedTool) {
            case "point":
                $(CornerStone.tempCanvas).bind('click', point.click);
                break;
            case "line":
                $(CornerStone.tempCanvas).bind('mousedown', line.startDrag);
                $(CornerStone.tempCanvas).bind('mousemove', line.drag);
                $(CornerStone.tempCanvas).bind('mouseup', line.stopDrag);
                break;
            case "drawing":
                $(CornerStone.tempCanvas).bind('mousedown', drawing.startDrag);
                $(CornerStone.tempCanvas).bind('mousemove', drawing.drag);
                $(CornerStone.tempCanvas).bind('mouseup', drawing.stopDrag);
                break;
            case "cursor":
                $(CornerStone.tempCanvas).bind('click', cursor.click);
                $(CornerStone.tempCanvas).bind('mousedown', cursor.startDrag);
                $(CornerStone.tempCanvas).bind('mousemove', cursor.drag);
                $(CornerStone.tempCanvas).bind('mouseup', cursor.stopDrag);
                break;
            case "rectangle":
                $(CornerStone.tempCanvas).bind('mousedown', rectangle.startDrag);
                $(CornerStone.tempCanvas).bind('mousemove', rectangle.drag);
                $(CornerStone.tempCanvas).bind('mouseup', rectangle.stopDrag);
                break;
            case "square":
                $(CornerStone.tempCanvas).bind('mousedown', square.startDrag);
                $(CornerStone.tempCanvas).bind('mousemove', square.drag);
                $(CornerStone.tempCanvas).bind('mouseup', square.stopDrag);
                break;
            case "circle":
                $(CornerStone.tempCanvas).bind('mousedown', circle.startDrag);
                $(CornerStone.tempCanvas).bind('mousemove', circle.drag);
                $(CornerStone.tempCanvas).bind('mouseup', circle.stopDrag);
                break;
            case "triangle":
                $(CornerStone.tempCanvas).bind('click', triangle.click);
                $(CornerStone.tempCanvas).bind('mousemove', triangle.move);
                break;
            case "parallelogram":
                $(CornerStone.tempCanvas).bind('click', parallelogram.click);
                $(CornerStone.tempCanvas).bind('mousemove', parallelogram.move);
                break;
            case "rhombus":
                $(CornerStone.tempCanvas).bind('click', rhombus.click);
                $(CornerStone.tempCanvas).bind('mousemove', rhombus.move);
                break;
            case "trapezoid":
                $(CornerStone.tempCanvas).bind('click', trapezoid.click);
                $(CornerStone.tempCanvas).bind('mousemove', trapezoid.move);
                break;
            case "curve":
                $(CornerStone.tempCanvas).bind('click', curve.click);
                $(CornerStone.tempCanvas).bind('mousemove', curve.move);
                break;
            case "bezier":
                $(CornerStone.tempCanvas).bind('click', bezier.click);
                $(CornerStone.tempCanvas).bind('mousemove', bezier.move);
                break;
        }
    };

    redrawCanvas = function () {
        CornerStone.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        for (var collection in elements) {
            for (var e in elements[collection]) {
                var element = elements[collection][e];
                for (var p in element.points) {
                    element.draw(CornerStone.context);
                }
            };
        };
    };

    removeSelection = function () {
        if (selectedElement != null) {
            selectedElement.draw(CornerStone.context);
            CornerStone.selection = false;
            selectedElement = null;

            if (CornerStone.contextmenu) {
                // remove context menu
                $('body').contextMenu('destroy');
                CornerStone.contextmenu = false;
            }
        }
    }

    return {
        removeEvents: removeEvents,
        addEvents: addEvents,
        removeSelection: removeSelection
    };
}();

$(function () {
    $(".tool").click(function () {
        var data = $(this);
        $(".tool").removeClass("active");
        data.addClass("active");

        var id = data[0].id;
        CornerStone.toolbox.removeEvents();
        CornerStone.toolbox.addEvents(id);

        if (CornerStone.selection) {
            // remove current selection
            CornerStone.toolbox.removeSelection();
        }
    });

    $('#save').click(function () {
        var dataURL = CornerStone.canvas.toDataURL();
        this.href = dataURL;            
    });

    $(document).click(function (ev) {
        if (CornerStone.selection) {
            var shouldRemoveSelection = true;

            // check if current click is on an element currently being selected
            for (var p in selectedElement.points) {
                var point = selectedElement.points[p];
                if (Math.abs(point[0] - ev.clientX) < 3 && Math.abs(point[1] - ev.clientY) < 3) {
                    // it is - do not remove selection
                    shouldRemoveSelection = false;
                    break;
                };
            }

            // remove current selection
            if (shouldRemoveSelection) {
                CornerStone.toolbox.removeSelection();
            }
        }
    });
});

