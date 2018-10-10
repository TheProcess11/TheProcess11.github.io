"use strict";
var canvas;
var gl;
//6 square faces // = 12 triangular polys // = 36 vertices
var numVertices = 36;
var points = [];
var colors = [];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var flag = true;
var HSRflag = true;
var theta = [ 45.0, 45.0, 45.0 ];
var thetaLoc;
// If our JS file containing the graphic part
// of our application. The error we always see
// - All the "action" is within function such as init() and render ()
// - Consequently, if these functions are never executed and the result is
// nothing will show up in the canvas
// "Solution provided"- Use "window.onload" function to
// initiate execution of the init function. For example:
// - Onload event occurs when all files read
// - Window.onload=init; (init must be a function)
window.onload = function ()
{
 canvas = document.getElementById( "gl-canvas" );
 gl = WebGLUtils.setupWebGL( canvas );
 if ( !gl ) { alert( "WebGL isn't available" ); }
 colorCube();
 gl.viewport( 0, 0, canvas.width, canvas.height );
 gl.clearColor( 0.5,0.5, 0.5, 1.0 );
 gl.enable(gl.DEPTH_TEST);
 gl.enable(gl.BLEND);
 gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  //
 // 1) Load shaders and initialize attribute buffers (Value sets)
 // 2) Buffer is an area of a physical memory storage used to the store data
 // 3) Buffer are used when moving data between processes within a computer
 // 4) Depth Buffer is an algorithm used in 3-D graphics to determine which object,
 // or parts of objects, are visible and which are hidden behind other objects.
 // 5) Famous use Algorithm
 // a)A Buffer is known as anti-aliased (Smoothing-make the edges smooth)
 // usually in transparent, and intersecting objects.
 // b)Z Buffer is known as Visual Surface Determination (VSD) algorithm. 
  // It's works by testing pixel depth and comparing the current position ( z coordinate )
// with stored data in a buffer (Z-buffer ) that holds information about each pixel's last
// position
 var program = initShaders( gl, "vertex-shader", "fragment-shader" );
 gl.useProgram( program );
// A JS array is an object with attributes and methods such as length, push () and pop ()
// Use flatten() function to extract data from JS array
// Associate shader variables with the vertex array
 var cBuffer = gl.createBuffer();
 gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
 gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
// Load data into Vertex Buffer Object (VBO) using (four points)
 var vColor = gl.getAttribLocation( program, "vColor" );
 gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
 gl.enableVertexAttribArray( vColor );
 var vBuffer = gl.createBuffer();
 gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
 gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
 var vPosition = gl.getAttribLocation( program, "vPosition" );
 gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
 gl.enableVertexAttribArray( vPosition );
 thetaLoc = gl.getUniformLocation(program, "theta");
 document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
 document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
 document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
 document.getElementById("ButtonT").onclick = function(){flag = !flag;};
 document.getElementById("ButtonH").onclick = function(){
 if(HSRflag) gl.enable(gl.DEPTH_TEST);
 else gl.disable(gl.DEPTH_TEST);

 // Note that we must clear both fame buffer and the depth buffering
 // Depth Buffer are used for hidden surface removal by enable the HSR function
 // " if(HSRflag) gl.enable(gl.DEPTH_TEST);"
 HSRflag = !HSRflag;
 };
 render();
}
// To simplify generating of the cube geometry, we use a
// convenience function quad()
// This is to create 2 triangles for each face and assigns
// color to the vertices
function colorCube()
{
 quad( 1, 0, 3, 2 );
 quad( 2, 3, 7, 6 );
 quad( 3, 0, 4, 7 );
 quad( 6, 5, 1, 2 );
 quad( 4, 5, 6, 7 );
 quad( 5, 4, 0, 1 );
}
// Vertices of a unit cube centered at origin
// sides aligned with axes
function quad(a, b, c, d)
{
 var vertices = [
 vec3( -0.5, -0.5, 0.5 ),
 vec3( -0.5, 0.5, 0.5 ),
 vec3( 0.5, 0.5, 0.5 ),
 vec3( 0.5, -0.5, 0.5 ),
 vec3( -0.5, -0.5, -0.5 ),
 vec3( -0.5, 0.5, -0.5 ),
 vec3( 0.5, 0.5, -0.5 ),
 vec3( 0.5, -0.5, -0.5 )
 ];

 // We also set up an array of RGBA color
// RGBA stand for Red, Green, Blue, Alpha
// It describe as color space where the combination of
// RGB color model with an extra 4th alpha channel color
// We can use Vec3 or Vec4 or just JS array
 var vertexColors = [
 [ 0.0, 0.0, 0.0, 0.1 ], // black
 [ 1.0, 0.6, 0.6, 1.0 ], // red
 [ 0.8, 0.0, 0.8, 0.8 ], // yellow
 [ 0.0, 1.0, 0.2, 0.4 ], // green
 [ 0.7, 0.9, 0.0, 0.7 ], // blue
 [ 0.5, 0.3, 0.5, 0.9 ], // magenta
 [ 0.0, 1.0, 0.3, 1.0 ], // cyan
 [ 1.0, 0.6, 0.1, 0.5 ] // white
 ];

  // We need to partition the quad into two triangles in order for
 // WebGL to be able to render it. In this case, we create two
// triangles from the quad.
 var indices = [ a, b, c, a, c, d ];
 for ( var i = 0; i < indices.length; ++i ) {
 points.push( vertices[indices[i]] );
 colors.push( vertexColors[a] );
 }
}
// Randering- Convert geometric/ methematical object description into shapes
// it can rander geometric primitives, bitmap images and others.
// For contiguous (sequence) group of vertices, we can simple
// the render function by apply code below:
function render()
{
 gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 if(flag) theta[axis] += 2.0;
 gl.uniform3fv(thetaLoc, theta);
 //Initiates vertex shader
 gl.drawArrays( gl.TRIANGLES, 0, numVertices );
 //Needed for redrawing if anything is changing
 requestAnimFrame( render );

}