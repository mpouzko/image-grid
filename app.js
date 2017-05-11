"use strict";
(function() {
  var canvas, context, i, len, pattern, point, ref;

  canvas = document.getElementById("canvas");

  pattern = [[0, 0], [1, 0], [1, 1], [0, 1]];

  context = canvas.getContext("2d");

  context.lineWidth = 2;

  context.strokeStyle = 'lime';

  context.beginPath();

  context.moveTo(pattern[0][0], pattern[0][1]);

  ref = pattern.slice(1);
  for (i = 0, len = ref.length; i < len; i++) {
    point = ref[i];
    context.lineTo(canvas.width * point[0], canvas.height * point[1]);
    //console.log(canvas.width * point[0], canvas.height * point[1]);
  }
    context.lineTo(canvas.width * pattern[0][0], canvas.height * pattern[0][1]);
  context.stroke();

function toWidth(obj,val) {
    var res = obj.width * val;
    return res;

}
function toHeight(obj,val) {
    var res = obj.height*val;
    return res;
}

var container = document.getElementById("container");
var points = [];
var j=0;

for (let i of pattern ) {  
   var newEl = document.createElement("div");
    newEl.classList.add("dot","draggable-element");
    newEl.setAttribute("draggable", true);
    newEl.setAttribute("index", j);
    newEl.setAttribute("id", "corner"+j);

    newEl.ondragstart = function(e) {
        var t = e.target;
        t.style.borderRadius = '0px';
    }
    newEl.ondrag = function(e){
        var index = e.target.index;
        var nextIndex = index>3?0:index+1;
        var prevIndex = index==0?3:index-1;
        var nextObject = document.getElementById("corner"+nextIndex);
        var prevObject = document.getElementById("corner"+prevIndex);
        var s = e.target.style;       
        
        /*s.top = parseInt(s.top) + e.offsetY + 'px';
        s.left = parseInt(s.left) + e.offsetX + 'px';*/
    }
    newEl.ondragend = function(e) {
         var s = e.target.style;
         s.borderRadius = '50px';
         s.top = parseInt(s.top) + e.offsetY + 'px';
         s.left = parseInt(s.left) + e.offsetX + 'px';
         drawFrame();
    }
    container.insertBefore(newEl,canvas);
    newEl.style.left = toWidth(canvas,i[0])+"px";
    newEl.style.top =  toHeight(canvas,i[1])+"px";
    //console.log(toWidth(canvas,[i][0])+"px");
    points.push(newEl);
    j++;
}
function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    var x = parseInt(points[0].style.left)-10;
    var y = parseInt(points[0].style.top)-10;
    context.moveTo(x,y);

    ref = points.slice(1);
    for (i = 0, len = ref.length; i < len; i++) {
      var x = parseInt(ref[i].style.left)-10;
      var y = parseInt(ref[i].style.top)-10;
      context.lineTo(x,y);
      
    }
    x = parseInt(points[0].style.left)-10;
    y = parseInt(points[0].style.top)-10;
      context.lineTo(x,y);
    context.stroke();
}

}).call(this);
