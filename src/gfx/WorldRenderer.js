(function(window, undefined) {
'use strict';
var gl;
window.WorldRenderer = {
    chunkList: [],
    numberOfUpdates: 0,
    numberOfChunks: 0,

    width: 0,
    height: 0,
    depth: 0,
}

WorldRenderer.setGl = function(gl_) {
    gl = gl_;
}

WorldRenderer.setDimensions = function(width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.chunkList = new Array((width / 16) * (height / 16) * (depth / 16));
    for (var i = 0; i < this.chunkList.length; i++) {
        this.chunkList[i] = null;
    }

    this.numberOfChunks = this.chunkList.length;
}

WorldRenderer.renderLoop = function(world) {
    for (var i = 0; i < 50; i++) {
        this.buildChunk(world);
    }

    Renderer.pushMatrix();
    Renderer.resetMatrix();

    var c = this.camera;
    Renderer.rotateZ(c.roll);
    Renderer.rotateX(c.pitch);
    Renderer.rotateY(c.yaw);

    Renderer.translate([-c.x, -c.y, -c.z]);

    var list = this.chunkList;
    for (var i = 0; i < list.length; i++) {
        var chunk = list[i];
        if (chunk != undefined) {
            chunk.render();
        }   
    }

    this.renderSelection();

    Renderer.popMatrix();
}

WorldRenderer.selectionPos = null;
WorldRenderer.renderSelection = function() {
    if (this.selectionPos != null) Renderer.renderLineBox(this.selectionPos);
}

WorldRenderer.setChunkNeedsUpdate = function(world, x1, y1, z1) {
    var width = this.width / 16,
        height = this.height / 16,
        depth = this.depth / 16;

    var x = Math.floor(x1 / 16),
        y = Math.floor(y1 / 16),
        z = Math.floor(z1 / 16);

    this.setChunkUpdateStatus(x, y, z);

    if (x1 % 16 == 0)  this.setChunkUpdateStatus(x - 1, y, z);
    if (x1 % 16 == 15) this.setChunkUpdateStatus(x + 1, y, z);
    if (y1 % 16 == 0)  this.setChunkUpdateStatus(x, y - 1, z);
    if (y1 % 16 == 15) this.setChunkUpdateStatus(x, y + 1, z);
    if (z1 % 16 == 0)  this.setChunkUpdateStatus(x, y, z - 1);
    if (z1 % 16 == 15) this.setChunkUpdateStatus(x, y, z + 1);
}

WorldRenderer.setChunkUpdateStatus = function(x, y, z) {
    var width = this.width / 16,
        height = this.height / 16,
        depth = this.depth / 16;

    var id = (y * width * depth) + (z * width) + x;
    if (id >= 0 && id < this.chunkList.length) this.chunkList[id].needsUpdate = true;
}

WorldRenderer.buildChunk = function(world) {
    var width = this.width / 16,
        height = this.height / 16,
        depth = this.depth / 16;

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            for (var z = 0; z < depth; z++) {
                var id = (y * width * depth) + (z * width) + x;
                if (this.chunkList[id] == null) {
                    this.chunkList[id] = new Chunk(x, y, z);
                }

                if (this.chunkList[id].needsUpdate == true) {
                    this.chunkList[id].build(gl, world);

                    this.numberOfUpdates++;
                    return;
                }
            }
        }
    }
}

WorldRenderer.camera = {
    x: 0,
    y: 80,
    z: 0,
    yaw: 2.2,
    pitch: 0.5,
    roll: 0
}

WorldRenderer.setCamera = function(x, y, z, yaw, pitch, roll) {
    var c = WorldRenderer.camera;
    c.x = x;
    c.y = y;
    c.z = z;
    c.yaw = yaw;
    c.pitch = pitch;
    c.roll = roll;
}

})(window);