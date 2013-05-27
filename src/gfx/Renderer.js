(function(window, undefined) {
'use strict';
window.Renderer = {};
var gl, width, height, mView, mProj, program, lineBoxBuffer;

Renderer.renderLoop = function(world) {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.clearColor( 0.7, 0.8, 1.0, 1.0 );

    WorldRenderer.renderLoop(world);
}

var floatSize = Float32Array.BYTES_PER_ELEMENT;
Renderer.render = function(renderable) {
    gl.uniformMatrix4fv(program.mView, false, mView);

    gl.bindBuffer(gl.ARRAY_BUFFER, renderable.buffer);

    gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 8 * floatSize, 0 * floatSize);
    gl.vertexAttribPointer(program.aColor,    3, gl.FLOAT, false, 8 * floatSize, 3 * floatSize);
    gl.vertexAttribPointer(program.aTexture,  2, gl.FLOAT, false, 8 * floatSize, 6 * floatSize);
    
    gl.drawArrays(gl.TRIANGLES, 0, renderable.length);
}

Renderer.createLineBox = function() {
    var p = 0.0025;

    var vertices = [
            -p,  1 + p,     -p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,  1 + p,     -p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,  1 + p,     -p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,  1 + p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,  1 + p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
            -p,  1 + p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
            -p,  1 + p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
            -p,  1 + p,     -p, 0.3, 0.3, 0.3, 0, 0,
            -p,  1 + p,     -p, 0.3, 0.3, 0.3, 0, 0,
            -p,     -p,     -p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,  1 + p,     -p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,     -p,     -p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,  1 + p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,     -p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
            -p,  1 + p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
            -p,     -p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
            -p,     -p,     -p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,     -p,     -p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,     -p,     -p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,     -p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
         1 + p,     -p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
            -p,     -p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
            -p,     -p,  1 + p, 0.3, 0.3, 0.3, 0, 0,
            -p,     -p,     -p, 0.3, 0.3, 0.3, 0, 0,
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    lineBoxBuffer = buffer;
}

Renderer.renderLineBox = function(pos) {
    this.pushMatrix();
        this.translate(pos);

        gl.uniformMatrix4fv(program.mView, false, mView);

        gl.bindBuffer(gl.ARRAY_BUFFER, lineBoxBuffer);

        gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 8 * floatSize, 0 * floatSize);
        gl.vertexAttribPointer(program.aColor,    3, gl.FLOAT, false, 8 * floatSize, 3 * floatSize);
        gl.vertexAttribPointer(program.aTexture,  2, gl.FLOAT, false, 8 * floatSize, 6 * floatSize);

        gl.drawArrays(gl.LINES, 0, 24);
    this.popMatrix();
}

Renderer.translate = function(vec) {
    mat4.translate(mView, vec);
}

Renderer.rotateX = function(amount) {
    mat4.rotateX(mView, amount);
}

Renderer.rotateY = function(amount) {
    mat4.rotateY(mView, amount);
}

Renderer.rotateZ = function(amount) {
    mat4.rotateZ(mView, amount);
}

Renderer.resetMatrix = function() {
    mat4.identity(mView);
}

var viewMatrixStack = [];
Renderer.pushMatrix = function() {
    viewMatrixStack.push(mat4.create(mView));
    mView = viewMatrixStack[viewMatrixStack.length - 1];
}

Renderer.popMatrix = function() {
    viewMatrixStack.pop();
    mView = viewMatrixStack[viewMatrixStack.length - 1];
}

Renderer.setup = function(gl_) {
    WorldRenderer.setGl(gl_);
    gl = gl_;

    var vs = createShader(shaderSources.vs, gl.VERTEX_SHADER);
    var fs = createShader(shaderSources.fs, gl.FRAGMENT_SHADER);

    program = createProgram(vs, fs);
    gl.useProgram(program);
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    program.aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(program.aPosition);

    program.aColor = gl.getAttribLocation(program, 'aColor');
    gl.enableVertexAttribArray(program.aColor);

    program.aTexture = gl.getAttribLocation(program, 'aTexture');
    gl.enableVertexAttribArray(program.aTexture);
    
    program.uSampler = gl.getUniformLocation(program, 'uSampler');

    program.mView = gl.getUniformLocation(program, 'mView');
    program.mProj = gl.getUniformLocation(program, 'mProj');

    mView = mat4.identity();
    this.pushMatrix();
    this.updateViewport();

    var terrain = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(program.uSampler, 0);

    gl.bindTexture(gl.TEXTURE_2D, terrain);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, window.textures.terrainImage);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    this.createLineBox();
}

Renderer.updateViewport = function() {
    width = gl.drawingBufferWidth;
    height = gl.drawingBufferHeight;

    mProj = mat4.perspective(70, width / height, 0.01, 1000);
    gl.uniformMatrix4fv(program.mProj, false, mProj);
    gl.viewport(0, 0, width, height);
}

var createShader = function(src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == false) {
        throw (gl.getShaderInfoLog(shader));
    }
    return shader;
}

var createProgram = function(vs, fs) {
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    return program;
}

})(window, undefined);