var CornerStone = CornerStone || {};

CornerStone.Math = function () {

};

CornerStone.Math.prototype = function () {
    var getPointsForLine = function (x1, y1, x2, y2, n) {
        if (x1 == x2) {
            if (y1==y2) {
                return;
            }
            else {
                var result = [];
                var interval = (Math.max(y1, y2) - Math.min(y1, y2)) / n;
                for (var i = Math.min(y1, y2) ; i <= Math.max(y1, y2) ; i += interval) {
                    y = i;
                    result.push([x1, y]);
                }
            }
    	} else {
        var slope = (y2 - y1) / (x2 - x1);
        var b = y1 - slope * x1;
        var x = x1;

        var result = [];
        var interval = (Math.max(x1, x2) - Math.min(x1, x2)) / n;
        for (var i = Math.min(x1, x2) ; i <= Math.max(x1, x2) ; i += interval) {
            x = i;
            result.push([x, slope * x + b]);
        }
       }

        return result;
    };

    var calcStraightLine = function (x1, y1, x2, y2) {
        var coordinatesArray = new Array();
        // Define differences and error check
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;
        // Set first coordinates
        coordinatesArray.push([x1, y1]);
        // Main loop
        while (!((x1 == x2) && (y1 == y2))) {
            var e2 = err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
            // Set coordinates
            coordinatesArray.push([x1, y1]);
        }
        // Return the result
        return coordinatesArray;
    };

    return {
        getPointsForLine: getPointsForLine,
        calcStraightLine: calcStraightLine
    };
}();