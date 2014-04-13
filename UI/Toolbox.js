/// <reference path="../Logic/Cursor.js" />
/// <reference path="../Logic/Line.js" />

var CornerStone = CornerStone || {};

CornerStone.toolbox = function () {
    var line = new CornerStone.Line();
    var cursor = new CornerStone.Cursor();

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

