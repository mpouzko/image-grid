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
    context = canvas.getContext("2d");
    var imgsrc = document.getElementById("imgsrc");
    var canvas2 = document.getElementById("canvas2");
    var context2 = canvas2.getContext("2d");
    var imgcanvas = document.getElementById("imgcanvas");
    var imgcontext = imgcanvas.getContext("2d");
    context.lineWidth = 2;
    context.strokeStyle = 'lime';
    var container = document.getElementById("container");
    var points = [];
    var pieces = [];
    var rowCount = pattern.length; //4
    var colCount = pattern[0].length; //3
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
                var s = e.target.style;
                s.borderRadius = '0px';
            }
            newEl.ondrag = function(e) {}
            newEl.ondragend = function(e) {
                var s = e.target.style;
                s.borderRadius = '50px'
                var newX = e.pageX;
                var newY = e.pageY;
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
                /*console.log(minX,minY,maxX,maxY);
                console.log(newX,newY);*/
                if ((newX > minX) && (newX < maxX) && (newY > minY) && (newY < maxY)) {
                    history.push([rowIndex, colIndex, parseInt(s.left), parseInt(s.top)]);
                    s.top = newY - 10 + "px";
                    s.left = newX - 10 + "px";
                    //console.log("OK");
                }
                drawGrid();
            }
            container.insertBefore(newEl, canvas);
            newEl.style.left = toWidth(canvas, row[j][0]) + 10 + "px";
            newEl.style.top = toHeight(canvas, row[j][1]) + 10 + "px";
            points[i][j] = newEl;
            if (i < (rowCount - 1) && j < (colCount - 1)) {
                // if ( i == 1 &&  j== 1 ) {
                var newImage = new Image();
                newImage.width = toWidth(canvas, pattern[i + 1][j][0] - row[j][0]);
                newImage.height = toHeight(canvas, row[j + 1][1] - row[j][1]);
                canvas2.width = newImage.width;
                canvas2.height = newImage.height;
                context2.clearRect(0, 0, canvas2.width, canvas2.height);
                context2.drawImage(imgsrc, toWidth(canvas, row[j][0]), toHeight(canvas, row[j][1]), imgsrc.width, imgsrc.height, 0, 0, imgsrc.width, imgsrc.height);
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
        //drawImage();
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
                }
            }
        }
        context.stroke();
        reDraw();
    }

    function reDraw() {
        imgcontext.clearRect(0, 0, 1200, 800);
        for (var i = 0; i < (pattern.length - 1); i++) {
            var row = pattern[i];
            for (var j = 0; j < (row.length - 1); j++) {
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

    function drawImage() {
        var imgcanvas = document.getElementById("imgcanvas");
        var imgcontext = imgcanvas.getContext('2d');
        var imgsrc = document.getElementById("imgsrc");
        var canvas2 = document.getElementById("canvas2");
        var ctx2 = canvas2.getContext('2d');
        // проходимся по исходному паттерну
        // преобразуем относительные размеры в абсолютные, исходя из размера канвы
        // ренденрим кусочки изображения на тмп канве
        // преобразуем их в объект image
        // берем координаты измененных точек
        // рисуем на канве перспективу
        for (var i = 0; i < (pattern.length - 1); i++) {
            var col = pattern[i];
            for (var j = 0; j < (col.length - 1); j++) {
                var x1 = toWidth(imgsrc, pattern[i][j][0]);
                var y1 = toHeight(imgsrc, pattern[i][j][1]);
                var x2 = toWidth(imgsrc, pattern[i + 1][j + 1][0]);
                var y2 = toHeight(imgsrc, pattern[i + 1][j + 1][1]);
                //console.log(x1,y1,x2,y2);
                canvas2.width = x2 - x1;
                canvas2.height = y2 - y1;
                ctx2.clearRect(0, 0, imgsrc.width, imgsrc.height);
                ctx2.drawImage(imgsrc, x1, y1, (imgsrc.width - x1), (imgsrc.height - y1));
                //imgcontext.drawImage(imgsrc, 0,0,imgsrc.width,imgsrc.width );           
                var image = new Image();
                image.src = canvas2.toDataURL("image/png");
                var p = new Perspective(imgcontext, image);
                var _coords = [];
                _coords.push([toWidth(imgsrc, pattern[i][j][0]), toHeight(imgsrc, pattern[i][j][1])]);
                _coords.push([toWidth(imgsrc, pattern[i + 1][j][0]), toHeight(imgsrc, pattern[i + 1][j][1])]);
                _coords.push([toWidth(imgsrc, pattern[i + 1][j + 1][0]), toHeight(imgsrc, pattern[i + 1][j + 1][1])]);
                _coords.push([toWidth(imgsrc, pattern[i][j + 1][0]), toHeight(imgsrc, pattern[i][j + 1][1])]);
                p.draw(_coords);
            }
        }
    };

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
        return res;
    }

    function toHeight(obj, val) {
        var res = obj.height * val;
        return res;
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
        _coords.push(parseInt(obj.style.left));
        _coords.push(parseInt(obj.style.top));
        return _coords;
    }
    /*window.test = function(){
        var imgcanvas = document.getElementById("imgcanvas");
        var canvas2 = document.getElementById("canvas2");
        var imgctx = imgcanvas.getContext('2d');
        var ctx2 = canvas2.getContext('2d');
        var imgsrc = document.getElementById("imgsrc"); 
        canvas2.width=400;
        canvas2.height=400;
        ctx2.drawImage(imgsrc, 0,0,1200,800 );
        imgctx.drawImage(imgsrc, 0,0,1200,800 );
     
        var image = new Image();
        image.src = canvas2.toDataURL("image/png");
        var p = new Perspective(imgctx, image);
        var _coords = [];
        _coords.push(getXY(points[0][0]));
        _coords.push(getXY(points[1][0]));
        _coords.push(getXY(points[1][1]));
        _coords.push(getXY(points[0][1]));
        
        p.draw(_coords);          
        setTimeout(function(){
        var _coords = [];
        _coords.push(getXY(points[2][2]));
        _coords.push(getXY(points[2][3]));
        _coords.push(getXY(points[3][3]));
        _coords.push(getXY(points[3][2]));
        var p2 = new Perspective(imgctx, image);
        p2.draw(_coords);     
        },1000);     

    }
    */
    drawGrid();
});