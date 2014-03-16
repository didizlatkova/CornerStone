var CornerStone = CornerStone || {};

CornerStone.Math = function () {

};

CornerStone.Math.prototype = function () {
    var getPointsForLine = function (x1, y1, x2, y2, n) {
        var slope = (y2 - y1) / (x2 - x1);
        var b = y1 - slope * x1;
        var x = x1;

        var result = [];
        var interval = (Math.max(x1, x2) - Math.min(x1, x2)) / n;
        for (var i = Math.min(x1, x2) ; i <= Math.max(x1, x2) ; i += interval) {
            x = i;
            result.push([x, slope * x + b]);
        }

        return result;
    };

    return {
        getPointsForLine: getPointsForLine,
    };
}();