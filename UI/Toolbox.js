/// <reference path="../Logic/Cursor.js" />
/// <reference path="../Logic/Line.js" />
/// <reference path="../Logic/Square.js" />

var CornerStone = CornerStone || {};

CornerStone.toolbox = function () {
    var line = new CornerStone.Line(),
        cursor = new CornerStone.Cursor(),
        rectangle = new CornerStone.Rectangle();


    var removeEvents = function () {
        $(CornerStone.tempCanvas).unbind('mousedown');
        $(CornerStone.tempCanvas).unbind('mousemove');
        $(CornerStone.tempCanvas).unbind('mouseup');
    };

    var addEvents = function (selectedTool) {
        switch (selectedTool) {
            case "line":
                $(CornerStone.tempCanvas).bind('mousedown', line.startDrag);
                $(CornerStone.tempCanvas).bind('mousemove', line.drag);
                $(CornerStone.tempCanvas).bind('mouseup', line.stopDrag);
                break;
            case "cursor":
                $(CornerStone.tempCanvas).bind('mousedown', cursor.startDrag);
                $(CornerStone.tempCanvas).bind('mousemove', cursor.drag);
                $(CornerStone.tempCanvas).bind('mouseup', cursor.stopDrag);
                break;
            case "rectangle":
                $(CornerStone.tempCanvas).bind('mousedown', rectangle.startDrag);
                $(CornerStone.tempCanvas).bind('mousemove', rectangle.drag);
                $(CornerStone.tempCanvas).bind('mouseup', rectangle.stopDrag);
                break;
        }
    };

    return {
        removeEvents: removeEvents,
        addEvents: addEvents
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
    });
});

