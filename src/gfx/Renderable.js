(function(window, document, undefined) {
'use strict';
window.Renderable = function(gl_, bufferSize) {
    this.gl = gl_;
    this.vertexArray = new Float32Array(bufferSize);
    this.vertexArrayIndex = 0;

    this.vertexCount = 0;
    this.quadArray = [];
    this.quadCount = 0;

    this.buffer = null;
    this.length = 0;
}

Renderable.prototype.addVertex = function(x, y, z, r, g, b, u, v) {
    this.vertexArray[this.vertexArrayIndex++] = x;
    this.vertexArray[this.vertexArrayIndex++] = y;
    this.vertexArray[this.vertexArrayIndex++] = z;
    this.vertexArray[this.vertexArrayIndex++] = r;
    this.vertexArray[this.vertexArrayIndex++] = g;
    this.vertexArray[this.vertexArrayIndex++] = b;
    this.vertexArray[this.vertexArrayIndex++] = u;
    this.vertexArray[this.vertexArrayIndex++] = v;

    this.length++;
}

Renderable.prototype.addQuad = function(x, y, z, r, g, b, u, v) {
    this.quadArray.push([x, y, z, r, g, b, u, v]);
    this.quadCount++;

    if (this.quadCount == 4) {
        this.quadCount = 0;
        this.addVertex(this.quadArray[0][0], this.quadArray[0][1], this.quadArray[0][2], this.quadArray[0][3], this.quadArray[0][4], this.quadArray[0][5], this.quadArray[0][6], this.quadArray[0][7]);
        this.addVertex(this.quadArray[1][0], this.quadArray[1][1], this.quadArray[1][2], this.quadArray[1][3], this.quadArray[1][4], this.quadArray[1][5], this.quadArray[1][6], this.quadArray[1][7]);
        this.addVertex(this.quadArray[2][0], this.quadArray[2][1], this.quadArray[2][2], this.quadArray[2][3], this.quadArray[2][4], this.quadArray[2][5], this.quadArray[2][6], this.quadArray[2][7]);
        this.addVertex(this.quadArray[0][0], this.quadArray[0][1], this.quadArray[0][2], this.quadArray[0][3], this.quadArray[0][4], this.quadArray[0][5], this.quadArray[0][6], this.quadArray[0][7]);
        this.addVertex(this.quadArray[2][0], this.quadArray[2][1], this.quadArray[2][2], this.quadArray[2][3], this.quadArray[2][4], this.quadArray[2][5], this.quadArray[2][6], this.quadArray[2][7]);
        this.addVertex(this.quadArray[3][0], this.quadArray[3][1], this.quadArray[3][2], this.quadArray[3][3], this.quadArray[3][4], this.quadArray[3][5], this.quadArray[3][6], this.quadArray[3][7]);
        this.quadArray = [];
    }
}

Renderable.prototype.finish = function() {
    if (this.length > 0) {
        var gl = this.gl;
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray.subarray(0, this.length * 8), gl.STATIC_DRAW);
    }

    this.vertexArray = null;
}

Renderable.prototype.destroy = function() {
    if (this.buffer != null) {
        this.gl.deleteBuffer(this.buffer);
    }
}

})(window, document);