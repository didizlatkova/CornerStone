var CornerStone = CornerStone || {};
var canvas, context, tempCanvas, tempContext;

window.onload = function () {
    canvas = document.getElementById('CornerStoneCanvas'),
    context = canvas.getContext('2d'),
	tempCanvas = document.getElementById('tempMovementCanvas'),
    tempContext = tempCanvas.getContext('2d');
    
    canvas.setAttribute('width', '900');
	canvas.setAttribute('height', '700');
	
	tempCanvas.setAttribute('width', '900');
	tempCanvas.setAttribute('height', '700');

    var event = new CornerStone.Events();
    window.addEventListener("mousedown", event.startDrag);
    window.addEventListener ("mousemove", event.drag);
    window.addEventListener("mouseup", event.stopLineDrag);
};