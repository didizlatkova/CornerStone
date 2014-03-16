var CornerStone = CornerStone || {};
var canvas;
var context;

window.onload = function () {
    canvas = document.getElementById('CornerStoneCanvas');
    context = canvas.getContext('2d')

    var event = new CornerStone.Events();
    canvas.addEventListener("mousedown", event.startDrag);
    //canvas.addEventListener ("mousemove", drag);
    canvas.addEventListener("mouseup", event.stopLineDrag);
}