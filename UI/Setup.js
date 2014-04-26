/// <reference path="../Logic/Cursor.js" />

var CornerStone = CornerStone || {};

var CANVAS_WIDTH = 900,
    CANVAS_HEIGHT = 700,
    selectedElement = null,
    definingPoints = [],
    elements = {
    points: [],
    lines: [],
    rectangles: [],
    circles: [],
    triangles: [],
};

window.onload = function () {
    CornerStone.selection = false;
    CornerStone.canvas = document.getElementById('cornerStoneCanvas'),
    CornerStone.context = CornerStone.canvas.getContext('2d'),
	CornerStone.tempCanvas = document.getElementById('tempMovementCanvas'),
    CornerStone.tempContext = CornerStone.tempCanvas.getContext('2d');
    
    CornerStone.canvas.setAttribute('width', CANVAS_WIDTH);
    CornerStone.canvas.setAttribute('height', CANVAS_HEIGHT);
	
    CornerStone.tempCanvas.setAttribute('width', CANVAS_WIDTH);
    CornerStone.tempCanvas.setAttribute('height', CANVAS_HEIGHT);
    
    var cursor = new CornerStone.Cursor();
    $(CornerStone.tempCanvas).bind('mousedown', cursor.startDrag);
    $(CornerStone.tempCanvas).bind('mousemove', cursor.drag);
    $(CornerStone.tempCanvas).bind('mouseup', cursor.stopDrag);
};