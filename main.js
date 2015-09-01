//Self executign anonymous function
(function(){
	'use strict';
	
	var canvas = document.getElementById('game');
	var ctx = canvas.getContext('2d');

//FILE TAB
	//File New
	var fnew = function(){
		var r = confirm("Are you sure you would like to start a new drawing?");
		if (r == true) {
		   ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
		} 
		shapecount = 0;
		shapes = [];
	}
	//File Save
	var fsave = function(){
		var r = confirm("Save drawing?");
		if (r == true) {
			var img  = canvas.toDataURL("image/png");
			var a = document.createElement('a');
			a.href = img;
			a.download = "yourDrawing.png";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		} 
	}
	//File Save As
	var fsaveAs = function(){
		var fileName = prompt("Enter A File Name and Press OK to Save","myPicture");
		if (fileName!=null) {
			var img  = canvas.toDataURL("image/png");
			var a = document.createElement('a');
			a.href = img;
			a.download = fileName+".png";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		} 
	}
	document.getElementById('new').addEventListener('click',fnew);
	document.getElementById('save').addEventListener('click',fsave);
	document.getElementById('saveas').addEventListener('click',fsaveAs);

	
	var shape;
	//VARIABLES
	//SETTING OUR SHAPE
		var sRectangle = function(){
			shape = "Rectangle";
		}
	
		var sCircle = function(){
			shape = "Circle";
		}
	
		var sLine = function(){
			shape = "Line";
		}
	document.getElementById('Rectangle').addEventListener('click',sRectangle);
	document.getElementById('Circle').addEventListener('click',sCircle);
	document.getElementById('Line').addEventListener('click',sLine);

	var startX;
	var startY;
	var currentX;
	var currentY;
	var mouseDown = false;

	var getStart = function(event){
		mouseDown = true;
		startX = event.pageX-210;
		startY = event.pageY-16;
	}
	document.getElementById('game').addEventListener('mousedown',getStart);


	var stopDraw = function(event){
		if(isMoving == false){
		mouseDown = false;
		setColors();
		if(shape == 'Line'){
			ctx.moveTo(startX,startY);
			getXY(event);
			ctx.lineTo(currentX,currentY);
			ctx.stroke();
			shapes[shapecount] = {Shape:"Line", X1:startX, X2:currentX, Y1:startY, Y2:currentY, outColor:OutlineColor, inColor:FillColor };
			shapecount++;
		}
		else
			if(shape == 'Rectangle'){
				getXY(event);
				var rect= [startX,startY,(currentX-startX),(currentY-startY)];
				ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
				ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
				shapes[shapecount] = {Shape:"Rectangle", X1:startX, X2:currentX, Y1:startY, Y2:currentY, outColor:OutlineColor, inColor:FillColor, Width:LineWidth};
				if(Math.abs(currentX - startX) >1)
					shapecount++;	
			}
		else
			if(shape == 'Circle'){
				getXY(event);
				ctx.beginPath();
				ctx.arc(startX, startY,Math.abs(currentX-startX),0, Math.PI*2, true); 
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				shapes[shapecount] = {Shape:"Circle", X1:startX, X2:currentX, Y1:startY, outColor:OutlineColor, inColor:FillColor};
				shapecount++;
			}
	}}
	document.getElementById('game').addEventListener('mouseup',stopDraw);

	var shapes = [];
	var shapecount = 0;
	var isMoving = false;

		var reDrawShapes = function(){
			for(var z = 0;z<shapecount;z++){
				if(z==shapecount-1){
					ctx.setLineDash([5]);
				}
					if(shapes[z].Shape == 'Line'){
						ctx.strokeStyle = shapes[z].outColor;
						ctx.fillStyle = shapes[z].inColor;
						ctx.moveTo(shapes[z].X1,shapes[z].Y1);
						ctx.lineTo(shapes[z].X2,shapes[z].Y2);
						ctx.stroke();
					}

					else
						if(shapes[z].Shape == 'Rectangle'){
							ctx.strokeStyle = shapes[z].outColor;
							ctx.fillStyle = shapes[z].inColor;
							ctx.lineWidth = shapes[z].Width;
							var rect= [shapes[z].X1,shapes[z].Y1,(shapes[z].X2-shapes[z].X1),(shapes[z].Y2-shapes[z].Y1)];
							ctx.fillRect(rect[0],rect[1],rect[2],rect[3]);
							ctx.strokeRect(rect[0],rect[1],rect[2],rect[3]);
						}
		}
	}
	var rearrange = function(x){
		var tempShape = shapes[shapecount-1];
		shapes[shapecount-1]=shapes[x];
		shapes[x] = tempShape;
		reDrawShapes();
		ctx.setLineDash([0]);
	}

	var selectShape = function(event){
		for(var x = 0; x<shapecount;x++){
			if(startX<=shapes[x].X2&&startX>=shapes[x].X1&&startY>=shapes[x].Y1&&startY<=shapes[x].Y2){//
				isMoving = true;
				ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
				rearrange(x);
				console.log(shapes[shapecount-1].inColor);
				isMoving = false;
				break;
		}
	}
}

document.getElementById('game').addEventListener('mousedown',selectShape);

var changeColor = function(){
	shapes[shapecount-1].inColor = prompt("Change Fill Color ","#");
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	reDrawShapes();
	ctx.setLineDash([0]);
}
document.getElementById('editFill').addEventListener('click',changeColor);

var changeOutColor = function(){
	shapes[shapecount-1].outColor = prompt("Change Outline Color ","#");
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	reDrawShapes();
	ctx.setLineDash([0]);
}
document.getElementById('editOutline').addEventListener('click',changeOutColor);

var changeLineWidth = function(){
	shapes[shapecount-1].Width = prompt("Change Outline Width ",LineWidth);
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	reDrawShapes();
	ctx.setLineDash([0]);
	ctx.lineWidth = LineWidth;
}
document.getElementById('editOutlineWidth').addEventListener('click',changeLineWidth);

	var getXY = function(event){
		currentX = event.pageX-210;
		currentY = event.pageY-16;	
	}

//Color Stuff
	var canvasFill = document.getElementById('fillcolor');
	var ctxFill = canvasFill.getContext('2d');
	var canvasStroke = document.getElementById('outlinecolor');
	var ctxStroke = canvasStroke.getContext('2d');

	var FillColor = "black";
	var OutlineColor = "red";

	var setColors = function(){
		ctx.fillStyle = ctxFill.fillStyle = FillColor;
		ctx.strokeStyle = ctxStroke.fillStyle = OutlineColor;

		ctxFill.fillRect(0,0,canvasFill.width,canvasFill.height);
		ctxStroke.fillRect(0,0,canvasStroke.width,canvasStroke.height);
	}

	var pickStrokeColor = function(event){
		var color = prompt("Enter Outline Color Name or Hex","#");
		OutlineColor = color;
		setColors();
	}
	document.getElementById('Outline').addEventListener('click',pickStrokeColor);
	document.getElementById('outlinecolor').addEventListener('click',pickStrokeColor);

	var pickFillColor = function(event){
		var color = prompt("Enter FILL Color Name or Hex","#");
		FillColor = color;
		setColors();
	}
	document.getElementById('Fill').addEventListener('click',pickFillColor);
	document.getElementById('fillcolor').addEventListener('click',pickFillColor);

//Outline Width
	var LineWidth = 5;
	ctx.lineWidth = LineWidth;
	var setOutlineWidth = function(){
		var lineWidth = prompt("Enter OUTLINE Width",LineWidth);
		LineWidth = lineWidth;
		ctx.lineWidth = LineWidth;
		setColors();
	}
	document.getElementById('outlineWidth').addEventListener('click',setOutlineWidth);

//Help Menu
	var about = function(){
		confirm("Cody Antcliffe, 2015.\nSN: 0473673\n\nExercise 2 - Drawing Game\n")
	}
	document.getElementById('about').addEventListener('click',about);
	var help = function(){
		var r = confirm("FILE\n       NEW: Start A New Drawing.\n       SAVE: Saves your drawing as 'yourDrawing.png'.\n       SAVE AS: Save with custom file name.\n\nSHAPE\n      RECTANGLE: Changes shape to rectangle.\n       CIRCLE: Changes shape to circle.\n       LINE: Changes shape to line.\n\nCOLORS\n       FILL: Allows you to change fill color.\n       OUTLINE: Allows you to change outline color.\n\nWIDTH\n       OUTLINE WIDTH: Change width of outline.\n\nEDIT\n       FILL: Change fill color of selected shape.\n       OUTLINE: Change outline color of selected shape.\n      OUTLINE WIDTH: Change outline width of selected.\n");

	}
	document.getElementById('help').addEventListener('click',help);

	setColors();
})();
