var CornerStone = CornerStone || {};

CornerStone.Math = function () {

};

CornerStone.Math.prototype = function () {
    var getPointsForLine = function (x1, y1, x2, y2, n) {
        if (x1 == x2) {
            if (y1 == y2) {
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

    var calcCircle = function (x0, y0, radius) {
        var coordinatesArray = new Array();
        var x = radius, y = 0;
        var radiusError = 1 - x;

        while (x >= y) {
            coordinatesArray.push([x + x0, y + y0]);
            coordinatesArray.push([y + x0, x + y0]);
            coordinatesArray.push([-x + x0, y + y0]);
            coordinatesArray.push([-y + x0, x + y0]);
            coordinatesArray.push([-x + x0, -y + y0]);
            coordinatesArray.push([-y + x0, -x + y0]);
            coordinatesArray.push([x + x0, -y + y0]);
            coordinatesArray.push([y + x0, -x + y0]);

            y++;
            if (radiusError < 0) {
                radiusError += 2 * y + 1;
            } else {
                x--;
                radiusError += 2 * (y - x + 1);
            }
        }

        return coordinatesArray;
    };

    var calcFilledCircle = function (x0, y0, radius) {
        var coordinatesArray = new Array();
        var x = radius;
        var y = 0;
        var xChange = 1 - (radius << 1);
        var yChange = 0;
        var radiusError = 0;

        while (x >= y) {
            for (var i = x0 - x; i <= x0 + x; i++) {
                coordinatesArray.push([i, y0 + y]);
                coordinatesArray.push([i, y0 - y]);
            }
            for (var i = x0 - y; i <= x0 + y; i++) {
                coordinatesArray.push([i, y0 + x]);
                coordinatesArray.push([i, y0 - x]);
            }

            y++;
            radiusError += yChange;
            yChange += 2;
            if (((radiusError << 1) + xChange) > 0) {
                x--;
                radiusError += xChange;
                xChange += 2;
            }
        }

        return coordinatesArray;
    }

    var calcDistance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    };

    var factorial = function (n) {
        var result = 1;
        for (var i = 1; i <= n; i++) {
            result *= i;
        }

        return result;
    };

    var calcHermite = function (x, n, count) {
        if (f[points[x]] == f[points[n]]) {
            if (count == 0) {
                return f[points[x]] / factorial(count);
            }
            else {
                result.push(fprim[points[x]] / factorial(count));
                return fprim[points[x]] / factorial(count);
            }
        }
        else {
            var diff = calcHermite(x + 1, n, count - 1) - calcHermite(x, n - 1, count - 1);
            result.push(diff);
            return diff;
        }
    };

    var calcSimpleCurve = function (x0, y0, x1, y1, x2, y2) {
        f = new Array();
        fprim = new Array();

        f[0] = -1;
        f[1] = 0;

        fprim[0] = -2;
        fprim[1] = 10;

        points = [0, 0, 1, 1];
        result = [f[0]];

        calcHermite(0, 3, 3);
        return [result[0], result[5], result[6], result[7]];
    };

    return {
        calcDistance: calcDistance,
        getPointsForLine: getPointsForLine,
        calcStraightLine: calcStraightLine,
        calcCircle: calcCircle,
        calcFilledCircle: calcFilledCircle,
        calcSimpleCurve: calcSimpleCurve
    };
}();