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
        console.log(checkSelection(ev.clientX, ev.clientY));
    };

    function checkSelection(x, y) {
        for (var colection in elements) {
            for (var e in elements[colection]) {
                var element = elements[colection][e];
                for (var p in element.points) {
                    var point = element.points[p];
                    if (Math.abs(point[0] - x) < 3 && Math.abs(point[1] - y) < 3) {
                        element.state = true;
                        return element;
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