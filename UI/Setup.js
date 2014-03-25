var CornerStone = CornerStone || {};
var canvas, context, tempCanvas, tempContext;
var canvasWidth = 900;
var canvasHeight = 700;

window.onload = function () {
    canvas = document.getElementById('CornerStoneCanvas'),
    context = canvas.getContext('2d'),
	tempCanvas = document.getElementById('tempMovementCanvas'),
    tempContext = tempCanvas.getContext('2d');
    
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
	
    tempCanvas.setAttribute('width', canvasWidth);
	tempCanvas.setAttribute('height', canvasHeight);

    var event = new CornerStone.Events();
    window.addEventListener("mousedown", event.startDrag);
    window.addEventListener ("mousemove", event.drag);
    window.addEventListener("mouseup", event.stopLineDrag);
};