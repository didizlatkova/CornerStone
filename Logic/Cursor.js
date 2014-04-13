var CornerStone = CornerStone || {};

CornerStone.Cursor = function () {

};

CornerStone.Cursor.prototype = function () {
    startDrag = function (ev) {
        // to do: implement
    },

    drag = function (ev, context) {
        // to do: implement
    },

    stopDrag = function (ev) {
        // to do: implement
    };

    return {
        startDrag: startDrag,
        drag: drag,
        stopDrag: stopDrag
    };
}();