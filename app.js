"use strict";
(function() {
    var CONFIG = {};
    CONFIG.step = 20;
    var history = [];
    var canvas, context, i, len, pattern, point, ref;
    // [x,y]
    pattern = [     [ [0, 0],[0,0.2],[0,0.6],[0,0.7],[0, 1] ], [ [0.4, 0],[0.4,0.2],[0.4,0.6],[0.4,0.7],[0.4, 1] ], [ [0.6, 0],[0.6,0.2],[0.6,0.6],[0.6,0.7],[0.6, 1] ], [ [1, 0],[1,0.2],[1,0.6],[1,0.7],[1, 1] ]    ];
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.lineWidth = 2;
    context.strokeStyle = 'lime';
    var container = document.getElementById("container");
    var points = [];
    var rowCount = pattern.length; //4
    var colCount = pattern[0].length; //3
    for (var i=0; i<pattern.length ; i++ ) {  
       var row = pattern[i];
       points[i] = [];
       for (var j=0;j<row.length;j++ ) {  
                   var newEl = document.createElement("div");
            newEl.classList.add("dot","draggable-element");

            
            newEl.id = "dot"+j+":"+i;
            newEl.setAttribute("rowIndex", i);
            newEl.setAttribute("colIndex", j);
            var isCorner = false;
            //отметить угловые точки
            if (  ( j == 0 || j == rowCount -1 ) && ( i == 0 || i == colCount-1)    ) isCorner = true;  
            newEl.setAttribute("iscorner", isCorner); 
            //отметить точки  как перемещаемые           

                newEl.draggable = true;

                newEl.ondragstart = function(e) {
                    var s = e.target.style;
                    s.borderRadius = '0px';
                }
                newEl.ondrag = function(e){
                    
   
                }
                newEl.ondragend = function(e) {
                     var s = e.target.style;
                     s.borderRadius = '50px'
                     
                     var newX = e.pageX;
                     var newY = e.pageY;
                     var minX = false;
                     var maxY =  false;
                     var minY = false;
                     var maxX = false;
                     var rowIndex = parseInt(e.target.getAttribute("rowIndex"));
                     var colIndex = parseInt(e.target.getAttribute("colIndex"));
                     
                     for (let sibling of getSiblings(e.target)) {
                        var sX = parseInt(sibling.style.left)-10;
                        var sY = parseInt(sibling.style.top)-10;
                        if (rowIndex > 0)     
                            minX = (minX === false) ? sX : (minX > sX ? sX : minX);
                        else
                            minX = 0;
                        if (colIndex > 0)
                            minY = (minY === false) ? sY : (minY > sY ? sY : minY);
                        else
                            minY = 0;
                        if (rowIndex < (rowCount -1 ))
                            maxX = (maxX === false) ? sX : (maxX < sX ? sX : maxX);
                        else
                            maxX = canvas.width;
                        if (colIndex < (colCount-1))
                            maxY = (maxY === false) ? sY : (maxY < sY ? sY : maxY);
                        else
                            maxY = canvas.height;
                     }

                     console.log(minX,minY,maxX,maxY);
                     console.log(newX,newY);
                     if ( (newX > minX) && (newX < maxX) && (newY > minY) && (newY < maxY) ) {
                        history.push ( [ rowIndex, colIndex, parseInt(s.left), parseInt(s.top) ] );
                        s.top = newY -10 + "px";
                        s.left = newX -10 + "px";
                        console.log("OK");
                     }
                     drawGrid();
                }
            container.insertBefore(newEl,canvas);
            newEl.style.left = toWidth(canvas,row[j][0])+10+"px";
            newEl.style.top =  toHeight(canvas,row[j][1])+10+"px";
            points[i][j] = newEl;
        }
    }

    function drawGrid() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        for (var i = 0; i < points.length; i++) {
            var row = points[i];
            for (var j = 0; j < row.length; j++) {
                var point = points[i][j];
                var pX = parseInt(point.style.left)-10;
                var pY = parseInt(point.style.top)-10;
                for (let sibling of getSiblings(point)) {
                    context.moveTo(pX,pY);
                    var sX = parseInt(sibling.style.left)-10;
                    var sY = parseInt(sibling.style.top)-10;
                    context.lineTo(sX, sY);
                }
            }
        }
        context.stroke();
    }

    function getSiblings(obj) {
        var siblings = [];
        var rowIndex = parseInt(obj.getAttribute("rowIndex"));
        var colIndex = parseInt(obj.getAttribute("colIndex"));
        if (colIndex > 0 ) siblings.push(points[rowIndex][colIndex-1]);      
        if (colIndex < colCount -1 ) siblings.push(points[rowIndex][colIndex+1]);      
        if (rowIndex > 0 ) siblings.push(points[rowIndex-1][colIndex]);      
        if (rowIndex < rowCount - 1  ) siblings.push(points[rowIndex+1][colIndex]);      
        return siblings;
    }

function toWidth(obj,val) {
    var res = obj.width * val;
    return res;
}

function toHeight(obj,val) {
    var res = obj.height*val;
    return res;
}
var undo = document.getElementById("undo");

undo.addEventListener("click", function(){
    if (history.length == 0 ) return;
    var current = history [history.length - 1];
    var r = current[0];
    var c = current[1];
    var x = current[2];
    var y = current[3];
    var point = points[r][c];
    point.style.left = parseInt(x) + "px";
    point.style.top = parseInt(y) + "px";  
    history.pop(); 
    drawGrid();
})
 

drawGrid();

}).call(this);
