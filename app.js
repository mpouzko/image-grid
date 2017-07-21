"use strict";
window.addEventListener('load', function() {
    var CONFIG = {};
    CONFIG.step = 20;
    var history = [];
    var canvas, context, i, len, pattern, point, ref;
    // [x,y]
    pattern = [
        [
            [0, 0],
            [0, 0.2],
            [0, 0.6],
            [0, 0.7],
            [0, 1]
        ],
        [
            [0.4, 0],
            [0.4, 0.2],
            [0.4, 0.6],
            [0.4, 0.7],
            [0.4, 1]
        ],
        [
            [0.6, 0],
            [0.6, 0.2],
            [0.6, 0.6],
            [0.6, 0.7],
            [0.6, 1]
        ],
        [
            [1, 0],
            [1, 0.2],
            [1, 0.6],
            [1, 0.7],
            [1, 1]
        ]
    ];
    canvas = document.getElementById("canvas");

    var imgsrc = document.getElementById("imgsrc");
    var canvas2 = document.getElementById("canvas2");

    var imgcanvas = document.getElementById("imgcanvas");

    
    var container = document.getElementById("container");
    var points = [];
    var pieces = [];
    var corrX,corrY;
    var rowCount = pattern.length; //4
    var colCount = pattern[0].length; //3
    var gridHeight, gridWidth;
    calculateGridSize();
    context = canvas.getContext("2d");
    context.lineWidth = 2;
    context.strokeStyle = 'lime';
    var context2 = canvas2.getContext("2d");
    var imgcontext = imgcanvas.getContext("2d");

    for (var i = 0; i < pattern.length; i++) {
        var row = pattern[i];
        points[i] = [];
        pieces[i] = [];
        for (var j = 0; j < row.length; j++) {
            var newEl = document.createElement("div");
            newEl.classList.add("dot", "draggable-element");
            newEl.id = "dot" + j + ":" + i;
            newEl.setAttribute("rowIndex", i);
            newEl.setAttribute("colIndex", j);
            var isCorner = false;
            //отметить угловые точки
            if ((j == 0 || j == rowCount - 1) && (i == 0 || i == colCount - 1)) isCorner = true;
            newEl.setAttribute("iscorner", isCorner);
            //отметить точки  как перемещаемые           
            newEl.draggable = true;
            newEl.ondragstart = function(e) {
                e.dataTransfer.setData('text/plain',null);
                var s = e.target.style;
                s.borderRadius = '0px';

            }
            newEl.ondrag = function(e) {}
            newEl.ondragend = function(e) {
                
                var s = e.target.style;
                s.borderRadius = '50px'
                var newX = e.pageX ==0 ? e.screenX : e.pageX;
                var newY = e.pageY ==0 ? e.screenY : e.pageY;
                var minX = false;
                var maxY = false;
                var minY = false;
                var maxX = false;
                var rowIndex = parseInt(e.target.getAttribute("rowIndex"));
                var colIndex = parseInt(e.target.getAttribute("colIndex"));
                for (let sibling of getSiblings(e.target)) {

                    var sX = parseInt(sibling.style.left) - 10;
                    var sY = parseInt(sibling.style.top) - 10;
                    if (rowIndex > 0) minX = (minX === false) ? sX : (minX > sX ? sX : minX);
                    else minX = 0;
                    if (colIndex > 0) minY = (minY === false) ? sY : (minY > sY ? sY : minY);
                    else minY = 0;
                    if (rowIndex < (rowCount - 1)) maxX = (maxX === false) ? sX : (maxX < sX ? sX : maxX);
                    else maxX = canvas.width;
                    if (colIndex < (colCount - 1)) maxY = (maxY === false) ? sY : (maxY < sY ? sY : maxY);
                    else maxY = canvas.height;
                }
/*                console.log(minX,minY,maxX,maxY);
                console.log(newX,newY);*/
                if ((newX > minX) && (newX < maxX) && (newY > minY) && (newY < maxY)) {
                    history.push([rowIndex, colIndex, parseInt(s.left), parseInt(s.top)]);
                    s.top = newY - 10 + "px";
                    s.left = newX - 10 + "px";
                    
                }
                drawGrid();
                reDraw();

            }
            corrX = 0;
            corrY = 0;
            container.insertBefore(newEl, canvas);
             if (i < (rowCount - 1) ) { 
                    corrX = 10;
             }
            if ( j < (colCount - 1)) { 
                corrY = 10;
             }

            newEl.style.left = toWidth(canvas, row[j][0]) + corrX + "px";
            newEl.style.top = toHeight(canvas, row[j][1]) + corrY + "px";
            points[i][j] = newEl;
            if (i < (rowCount - 1) && j < (colCount - 1)) {
                //режем мсходное изображение на кусочки, и сохраняем в массив
                // if ( i == 1 &&  j== 1 ) {
                var newImage = new Image();
                newImage.width = toWidth(canvas, pattern[i + 1][j][0] - row[j][0]);
                newImage.height = toHeight(canvas, row[j + 1][1] - row[j][1]);
                canvas2.width = newImage.width;
                canvas2.height = newImage.height;
                context2.clearRect(0, 0, canvas2.width, canvas2.height);
                context2.drawImage(imgsrc, toWidth(canvas, row[j][0]), toHeight(canvas, row[j][1]), gridWidth, gridHeight, 0, 0, gridWidth, gridHeight);
                newImage.src = canvas2.toDataURL("image/png");
                pieces[i][j] = newImage;

                // console.log ( newImage.src );
            }
        }
    }
    /*window.show = function( i , j ) {
        var piece = pieces[i][j];
        console.log(piece.src);
    }
*/
    function drawGrid() {
        //рисует сетку, 
    
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        for (var i = 0; i < points.length; i++) {
            var row = points[i];
            for (var j = 0; j < row.length; j++) {
                var point = points[i][j];
                var pX = parseInt(point.style.left) - 10;
                var pY = parseInt(point.style.top) - 10;
                for (let sibling of getSiblings(point)) {
                    context.moveTo(pX, pY);
                    var sX = parseInt(sibling.style.left) - 10;
                    var sY = parseInt(sibling.style.top) - 10;
                    context.lineTo(sX, sY);
                    console.log(pX,pY,sX,sY);
                }
            }
        }
        context.stroke();
        
    }

    function reDraw() {
        var corrX, corrY;
        //рисует искаженную картинку
        imgcontext.clearRect(0, 0, gridWidth, gridHeight);
        for (var i = 0; i < (pattern.length - 1); i++) {
            var row = pattern[i];
            for (var j = 0; j < (row.length - 1); j++) {
                /*corrX = (i + 2) == pattern.length ? 2: 0;
                corrY = (j + 2) == row.length ? 2: 0;*/
                var piece = pieces[i][j];
                var coords = [];
                coords.push(getXY(points[i][j]));
                coords.push(getXY(points[i + 1][j]));
                coords.push(getXY(points[i + 1][j + 1]));
                coords.push(getXY(points[i][j + 1]));
                var p = new Perspective(imgcontext, piece);
                p.draw(coords);
            }
        }
    }

  

    function getSiblings(obj) {
        var siblings = [];
        var rowIndex = parseInt(obj.getAttribute("rowIndex"));
        var colIndex = parseInt(obj.getAttribute("colIndex"));
        if (colIndex > 0) siblings.push(points[rowIndex][colIndex - 1]);
        if (colIndex < colCount - 1) siblings.push(points[rowIndex][colIndex + 1]);
        if (rowIndex > 0) siblings.push(points[rowIndex - 1][colIndex]);
        if (rowIndex < rowCount - 1) siblings.push(points[rowIndex + 1][colIndex]);
        return siblings;
    }

    function getAllPoints() {
        var _points = [];
        for (var i = 0; i < points.length; i++) {
            var row = points[i];
            for (var j = 0; j < row.length; j++) _points.push(points[i][j]);
        }
        return _points;
    }

    function toWidth(obj, val) {
        var res = obj.width * val;
        return parseInt(res);
    }

    function toHeight(obj, val) {
        var res = obj.height * val;
        return parseInt(res);
    }
    var undo = document.getElementById("undo");
    undo.addEventListener("click", function() {
        if (history.length == 0) return;
        var current = history[history.length - 1];
        var r = current[0];
        var c = current[1];
        var x = current[2];
        var y = current[3];
        var point = points[r][c];
        point.style.left = parseInt(x) + "px";
        point.style.top = parseInt(y) + "px";
        history.pop();
        drawGrid();
        reDraw();
    })
    var go = document.getElementById("go");
    go.addEventListener("click", function() {
        var minX = 0;
        var minY = 0;
        var maxX = 0;
        var maxY = 0;
        for (let point of getAllPoints()) {
            var x = parseInt(point.style.left);
            var y = parseInt(point.style.top);
            minX = (minX == 0) ? x : (minX > x) ? x : minX;
            minY = (minY == 0) ? y : (minY > y) ? y : minY;
            maxX = (maxX == 0) ? x : (maxX < x) ? x : maxX;
            maxY = (maxY == 0) ? y : (maxY < y) ? y : maxY;
        }
        var modifiedGrid = [];
        var _canvasWidth = maxX - minX;
        var _canvasHeight = maxY - minY;
        for (var i = 0; i < points.length; i++) {
            var row = points[i];
            var _row = [];
            for (var j = 0; j < row.length; j++) {
                var point = points[i][j];
                var x = parseInt(point.style.left);
                var y = parseInt(point.style.top);
                var percentX = (x - minX) / _canvasWidth;
                var percentY = (y - minY) / _canvasHeight;
                _row.push([percentX, percentY]);
            }
            modifiedGrid.push(_row);
        }
        /*console.log(minX,minY,maxX,maxY);
        console.log(pattern);
        console.log(modifiedGrid);*/
    });

    function getXY(obj) {
        var _coords = [];
        _coords.push(parseInt(obj.style.left) );
        _coords.push(parseInt(obj.style.top)  );
        return _coords;
    }

    // Считает оптимальный для экрана размер канваса
    function calculateGridSize () {
        //global gridHeight, gridWidth;
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        /*var srcWidth = imgsrc.naturalWidth;
        var srcHeight = imgsrc.naturalHeight;*/
        var ratio = imgsrc.naturalWidth / imgsrc.naturalHeight;
        if (w > h) {
            var effectiveHeight = parseInt(h * 0.8);
            var effectiveWidth = parseInt( effectiveHeight * ratio );
        }
        else {
            var effectiveWidth = w ;  
            var effectiveHeight = w / ratio; 
        }
 
        imgcanvas.width = effectiveWidth;
        imgcanvas.height = effectiveHeight;
        container.width = effectiveWidth;
        container.height = effectiveHeight;
        container.style.width = effectiveWidth + "px";
        canvas.width = effectiveWidth;
        canvas.height = effectiveHeight;
        canvas2.width = effectiveWidth;
        canvas2.height = effectiveHeight;
        imgsrc.width = effectiveWidth;
        imgsrc.height = effectiveHeight;

        gridHeight = effectiveHeight;
        gridWidth = effectiveWidth;
    }
   

   drawGrid();
   imgcontext.drawImage(imgsrc,0,0,gridWidth,gridHeight);

});