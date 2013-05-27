(function(window, undefined) {
'use strict';

window.Chunk = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.renderable = null;
    this.needsUpdate = true;
    this.empty = false;
}

Chunk.prototype.build = function(gl, world) {
    // log('Building chunk');

    this.needsUpdate = false;

    if (this.renderable != null) {
        this.renderable.destroy();
        this.renderable = null;
    }

    this.renderable = new Renderable(gl, 200000);

    var r = this.renderable;

    for (var x1 = 0; x1 < 16; x1++) {
        for (var y1 = 0; y1 < 16; y1++) {
            for (var z1 = 0; z1 < 16; z1++) {
                var ax = (this.x * 16) + x1,
                    ay = (this.y * 16) + y1,
                    az = (this.z * 16) + z1;

                var tile = world.getTileId(ax, ay, az);
                if (tile != 0) {
                    if (world.getTileId(ax - 1, ay, az) == 0 || world.getTileId(ax - 1, ay, az) == null ) {
                        buildLeft(r, x1, y1, z1, Block.byId[tile].getTexture(0)[0], Block.byId[tile].getTexture(0)[1]);
                    }

                    if (world.getTileId(ax + 1, ay, az) == 0 || world.getTileId(ax + 1, ay, az) == null ) {
                        buildRight(r, x1, y1, z1, Block.byId[tile].getTexture(1)[0], Block.byId[tile].getTexture(1)[1]);
                    }

                    if (world.getTileId(ax, ay - 1, az) == 0 || world.getTileId(ax, ay - 1, az) == null ) {
                        buildBottom(r, x1, y1, z1, Block.byId[tile].getTexture(2)[0], Block.byId[tile].getTexture(2)[1]);
                    }

                    if (world.getTileId(ax, ay + 1, az) == 0 || world.getTileId(ax, ay + 1, az) == null ) {
                        buildTop(r, x1, y1, z1, Block.byId[tile].getTexture(3)[0], Block.byId[tile].getTexture(3)[1]);
                    }

                    if (world.getTileId(ax, ay, az - 1) == 0 || world.getTileId(ax, ay, az - 1) == null ) {
                        buildBack(r, x1, y1, z1, Block.byId[tile].getTexture(4)[0], Block.byId[tile].getTexture(4)[1]);
                    }

                    if (world.getTileId(ax, ay, az + 1) == 0 || world.getTileId(ax, ay, az + 1) == null ) {
                        buildFront(r, x1, y1, z1, Block.byId[tile].getTexture(5)[0], Block.byId[tile].getTexture(5)[1]);
                    }
                }
            }
        }
    }

    if (r.length == 0) {
        this.empty = true;
        // log('Empty chunk.');
    } else {
        this.empty = false;
    }
    r.finish();
}

Chunk.prototype.render = function() {
    if (this.empty) return;

    Renderer.pushMatrix();

    Renderer.translate([this.x * 16, this.y * 16, this.z * 16]);
    Renderer.render(this.renderable);

    Renderer.popMatrix();
}


var buildTop = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 0, y + 1, z + 1, 1, 1, 1, (0 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 1, y + 1, z + 1, 1, 1, 1, (1 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 1, y + 1, z + 0, 1, 1, 1, (1 + u) / 16, (0 + v) / 16);
    renderable.addQuad(x + 0, y + 1, z + 0, 1, 1, 1, (0 + u) / 16, (0 + v) / 16);
}

var buildBottom = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 0, y + 0, z + 0, 0.4, 0.4, 0.4, (0 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 1, y + 0, z + 0, 0.4, 0.4, 0.4, (1 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 1, y + 0, z + 1, 0.4, 0.4, 0.4, (1 + u) / 16, (0 + v) / 16);
    renderable.addQuad(x + 0, y + 0, z + 1, 0.4, 0.4, 0.4, (0 + u) / 16, (0 + v) / 16);
}

var buildLeft = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 0, y + 0, z + 0, 0.8, 0.8, 0.8, (0 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 0, y + 0, z + 1, 0.8, 0.8, 0.8, (1 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 0, y + 1, z + 1, 0.8, 0.8, 0.8, (1 + u) / 16, (0 + v) / 16);
    renderable.addQuad(x + 0, y + 1, z + 0, 0.8, 0.8, 0.8, (0 + u) / 16, (0 + v) / 16);
}

var buildRight = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 1, y + 0, z + 1, 0.8, 0.8, 0.8, (0 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 1, y + 0, z + 0, 0.8, 0.8, 0.8, (1 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 1, y + 1, z + 0, 0.8, 0.8, 0.8, (1 + u) / 16, (0 + v) / 16);
    renderable.addQuad(x + 1, y + 1, z + 1, 0.8, 0.8, 0.8, (0 + u) / 16, (0 + v) / 16);
}

var buildFront = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 0, y + 0, z + 1, 0.6, 0.6, 0.6, (0 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 1, y + 0, z + 1, 0.6, 0.6, 0.6, (1 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 1, y + 1, z + 1, 0.6, 0.6, 0.6, (1 + u) / 16, (0 + v) / 16);
    renderable.addQuad(x + 0, y + 1, z + 1, 0.6, 0.6, 0.6, (0 + u) / 16, (0 + v) / 16);
}

var buildBack = function(renderable, x, y, z, u, v) {
    renderable.addQuad(x + 1, y + 0, z + 0, 0.6, 0.6, 0.6, (0 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 0, y + 0, z + 0, 0.6, 0.6, 0.6, (1 + u) / 16, (1 + v) / 16);
    renderable.addQuad(x + 0, y + 1, z + 0, 0.6, 0.6, 0.6, (1 + u) / 16, (0 + v) / 16);
    renderable.addQuad(x + 1, y + 1, z + 0, 0.6, 0.6, 0.6, (0 + u) / 16, (0 + v) / 16);
}

})(window);