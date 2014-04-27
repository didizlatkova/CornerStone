var CornerStone = CornerStone || {};

CornerStone.Cursor = function () {

};

CornerStone.Cursor.prototype = function () {
    //we should probably be checking which button is clicked
    //some other time

    startDrag = function (ev) {
        // to do: implement
    },

    drag = function (ev, context) {
        // to do: implement
    },

    stopDrag = function (ev) {
        // to do: implement
    };

    click = function (ev) {
        makeSelection(ev.clientX, ev.clientY);
    };

    makeSelection = function (x, y) {
        for (var collection in elements) {
            for (var e in elements[collection]) {
                var element = elements[collection][e];
                for (var p in element.points) {
                    var point = element.points[p];
                    if (Math.abs(point[0] - x) < 3 && Math.abs(point[1] - y) < 3) {
                        element.state = true;
                        CornerStone.toolbox.removeSelection();
                        CornerStone.context.fillStyle = "#FF0000";
                        element.draw(CornerStone.context);
                        CornerStone.context.fillStyle = "#000000";

                        // activate context menu for selected element
                        element.activateContextMenu();

                        // set selection vars
                        CornerStone.selection = true;
                        selectedElement = element;                        
                    };
                }
            };
        };
    };
    
    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag,
        click: click
    };
}();