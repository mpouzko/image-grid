"use strict";
(function() {
    var canvas, context, i, len, pattern, point, ref;
    // [x,y]
    pattern = [     [ [0, 0],[0,0.2],[0,0.6],[0,0.7],[0, 1] ], [ [0.4, 0],[0.4,0.2],[0.4,0.6],[0.4,0.7],[0.4, 1] ], [ [0.6, 0],[0.6,0.2],[0.6,0.6],[0.6,0.7],[0.6, 1] ], [ [1, 0],[1,0.2],[1,0.6],[1,0.7],[1, 1] ]    ];
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.lineWidth = 2;
    context.strokeStyle = 'lime';
    var container = document.getElementById("container");
    var points = [];
    

    for (var i=0;i<pattern.length;i++ ) {  
       var row = pattern[i];
       points[i] = [];
       for (var j=0;j<row.length;j++ ) {  
           var rowCount = row.length; //4
           var colCount = pattern.length; //3
           var newEl = document.createElement("div");
            newEl.classList.add("dot","draggable-element");

            
            newEl.id = "dot"+i+":"+j;
            newEl.setAttribute("index", j+":"+i);
            var isCorner = false;
            //отметить угловые точки
            if (  ( j == 0 || j == rowCount -1 ) && ( i == 0 || i == colCount-1)    ) { newEl.setAttribute("iscorner", true); isCorner = true;}
            //отметить внутренние точки и угловые как перемещаемые
            if ( ( j > 0 && j < rowCount -1 &&  i > 0  && i < colCount-1) || isCorner    ) {
                newEl.draggable = true;

                newEl.ondragstart = function(e) {
                    var t = e.target;
                    t.style.borderRadius = '0px';
                }
                newEl.ondrag = function(e){
                    
    /*                var s = e.target.style;       
                    var rowIndex = e.target.index.split(":")[0];
                    var colIndex = e.target.index.split(":")[1];
                    
                    if (rowIndex == 0 && e.offsetY < 0 ) {}
                    else if (rowIndex == rowCount && e.offsetY > 0 ) {}
                    else if (colIndex == 0 && e.offsetx < 0 ) {}
                    else if (colIndex == colCount && e.offsetY > 0 ) {}
                    else {
                        //check range to siblings
                    }*/

                }
                newEl.ondragend = function(e) {
                     var s = e.target.style;
                     
                     s.borderRadius = '50px';
                     s.top = parseInt(s.top) + e.offsetY + 'px';
                     s.left = parseInt(s.left) + e.offsetX + 'px'; 

                     //при перемещнии уголовой точки - перемещать все точки, лежащие на внешних гранях.
                     if (e.target.getAttribute("iscorner")) {
                            var rowIndex = e.target.getAttribute("index").split(":")[0];
                            var colIndex = e.target.getAttribute("index").split(":")[1];
                            var rowCount = row.length; //4
                            var colCount = pattern.length; //3
                            
                            

                            //in row
                            var hSibling = points[ colIndex==0 ? colCount-1 : 0 ][rowIndex];                            
                            var pointA = colIndex == 0 ? e.target : hSibling;
                            var pointB = colIndex != 0 ? e.target : hSibling;
                            for (i=1;i<colCount-1;i++) {
                                var point = points[i][rowIndex];
                                var offset = point.getAttribute("hoffset") / (1 - point.getAttribute("hoffset"));
                                var pX = ( parseInt(pointA.style.left) + offset * parseInt(pointB.style.left) ) / (1 + offset);
                                var pY = ( parseInt(pointA.style.top) + offset * parseInt(pointB.style.top) ) / (1 + offset);
                                 
                                point.style.top = pY +'px';
                                point.style.left = pX + 'px'; 
                            }

                            //in col
                            var vSibling = points[ colIndex][rowIndex==0 ? rowCount-1 : 0 ];                            
                            var pointA = rowIndex == 0 ? e.target : vSibling;
                            var pointB = rowIndex != 0 ? e.target : vSibling;

                            for (j=1;j<rowCount-1;j++) {
                                var point = points[colIndex][j];
                            
                                var offset = point.getAttribute("voffset") / (1 - point.getAttribute("voffset"));
                                var pX = ( parseInt(pointA.style.left) + offset * parseInt(pointB.style.left) ) / (1 + offset);
                                var pY = ( parseInt(pointA.style.top) + offset * parseInt(pointB.style.top) ) / (1 + offset);
                                
                                point.style.top = pY +'px';
                                point.style.left = pX + 'px'; 
                            }





                       /* var rowIndex = e.target.getAttribute("index").split(":")[0];
                        var colIndex = e.target.getAttribute("index").split(":")[1];
                        var siblings = [];
                        //console.log(rowIndex,colIndex);
                        siblings.push( points[(colIndex==0?colCount-1:0)][rowIndex] );
                        siblings.push( points[colIndex][(rowIndex==0?rowCount-1:0)] );

                        for (let sibling of siblings) {
                            var siblingRowIndex = sibling.getAttribute("index").split(":")[0];
                            var siblingColIndex = sibling.getAttribute("index").split(":")[1];

                            if (siblingRowIndex == rowIndex) 
                                //подсчитать изменение х и у, и смещение точек на оси
                                for ( i = 1; i < rowCount-1; i++ ) {
                                    var point = points[i][rowIndex];
                                    var x = parseInt(points[0][rowIndex].style.left) - parseInt(points[colCount-1][rowIndex].style.left);
                                    var y = parseInt(points[0][rowIndex].style.top) - parseInt(points[colCount-1][rowIndex].style.top);
                                    var totalLength = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) );
                                    x = parseInt(point.style.left) - parseInt(points[colCount-1][rowIndex].style.left);
                                    y = parseInt(point.style.top) - parseInt(points[colCount-1][rowIndex].style.top);
                                    var pointLength = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) );
                                    //console.log(pointLength/totalLength);

                                }
                        }*/
                     }
                
                     drawGrid();
                }
            }

            //если точка лежит на внешней грани (но не угловая) - зафиксировать ее смещение на отрезке относительно начала)
            else {
                newEl.setAttribute("hOffset", pattern[i][j][0]);
                newEl.setAttribute("vOffset", pattern[i][j][1] );

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
        //draw outer frame
        var rowCount = points.length-1;
        var colCount = points[0].length-1; 
        var corners = [];
        corners.push(points[0][0]);
        corners.push(points[0][colCount]);
        corners.push(points[rowCount][colCount]);
        corners.push(points[rowCount][0]);
        corners.push(points[0][0]);
        for ( i = 0; i < (corners.length-1); i++ ) {
            var x = parseInt(corners[i].style.left)-10;
            var y = parseInt(corners[i].style.top)-10;
            context.moveTo(x,y);
            var x = parseInt(corners[i+1].style.left)-10;
            var y = parseInt(corners[i+1].style.top)-10;
            context.lineTo(x,y);
        }
        //draw inner grid
        for (i=1;i<points.length-1;i++) {
            var row = points[i];
               for (var j=1;j<row.length-1;j++ ) {  
                var point = points[i][j];
                var siblings = [];
                siblings.push(points[i-1][j]);
                siblings.push(points[i][j-1]);
                siblings.push(points[i+1][j]);
                siblings.push(points[i][j+1]);
                for (let s of siblings) {
                    var x = parseInt(point.style.left)-10;
                    var y = parseInt(point.style.top)-10;
                    context.moveTo(x,y);
                    var x = parseInt(s.style.left)-10;
                    var y = parseInt(s.style.top)-10;
                    context.lineTo(x,y);
                }

                }
        }

        context.stroke();
    }



   

function toWidth(obj,val) {
    var res = obj.width * val;
    return res;

}
function toHeight(obj,val) {
    var res = obj.height*val;
    return res;
}

drawGrid();

}).call(this);
