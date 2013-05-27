(function(window, undefined) {
'use strict';
window.World = function(width, height, depth) {
    this.width = width * 16;
    this.height = height * 16;
    this.depth = depth * 16;

    this.tileArray = new window.Uint8Array(this.width * this.height * this.depth);

    this.generate();

    this.entityList = [];
}

World.prototype.tick = function() {

    this.removeEntities();

    this.tickEntities();
}

World.prototype.tickEntities = function() {
    var list = this.entityList;
    for (var i = 0; i < list.length; i++) {
        list[i].tick(this);
    }
}

World.prototype.removeEntities = function() {
    var list = this.entityList;
    for (var i = 0; i < list.length; i++) {
        if (list[i].removed == true) {
            list.splice(i, 1);
        }
    }
}

World.prototype.addEntity = function(e) {
    this.entityList.push(e);
}

World.prototype.rayTrace = function(x0, y0, z0, x1, y1, z1) {
    var interpolate = function(a, b, x) {
        return a + ( (b - a) * x);
    }

    var detail = 200,
        block = Block;

    for (var i = 0; i < detail; i++) {
        var x = interpolate(x0, x1, (i / detail)),
            y = interpolate(y0, y1, (i / detail)),
            z = interpolate(z0, z1, (i / detail));

        var tile = this.getTileId(Math.floor(x), Math.floor(y), Math.floor(z));
        if (tile != null && block.byId[tile].passable == false) {
            var side = -1;
            var distance = 0.5;
            if (Math.ceil(x) - x < distance) {
                distance = Math.ceil(x) - x;
                side = 1;
            }

            if (x - Math.floor(x) < distance) {
                distance = x - Math.floor(x);
                side = 0;
            }

            if (Math.ceil(y) - y < distance) {
                distance = Math.ceil(y) - y;
                side = 3;
            }

            if (y - Math.floor(y) < distance) {
                distance = y - Math.floor(y);
                side = 2;
            }

            if (Math.ceil(z) - z < distance) {
                distance = Math.ceil(z) - z;
                side = 5;
            }

            if (z - Math.floor(z) < distance) {
                distance = z - Math.floor(z);
                side = 4;
            }

            return {
                x: Math.floor(x), 
                y: Math.floor(y), 
                z: Math.floor(z),
                side: side,
            }
        }
    }

    return null;
}

World.prototype.getCollidingBoundingBoxes = function(bb) {
    var boundingBoxes = [],
        minX = Math.floor( bb.minX ),
        minY = Math.floor( bb.minY ),
        minZ = Math.floor( bb.minZ ),
        maxX = Math.floor( bb.maxX + 1),
        maxY = Math.floor( bb.maxY + 1),
        maxZ = Math.floor( bb.maxZ + 1);

    for ( var x = minX; x < maxX; x++ ) {
        for ( var y = minY; y < maxY; y++ ) {
            for ( var z = minZ; z < maxZ; z++ ) {
                var tile = this.getTileId(x, y, z);
                if ( ( x < 0 || y < 0 || z < 0 || x >= this.width || z >= this.depth ) || tile != null && Block.byId[tile].passable == false) {
                    boundingBoxes.push(new AABB(x, y, z, x + 1, y + 1, z + 1));
                }
            }
        }
    }

    return boundingBoxes;
}

World.prototype.getTileId = function(x, y, z) {
    if (x < 0 || y < 0 || z < 0 || x >= this.width || y >= this.height || z >= this.depth) return null;
    return this.tileArray[(y * this.width * this.depth) + (z * this.width) + x];
}

World.prototype.setTileId = function(x, y, z, id) {
    if (x < 0 || y < 0 || z < 0 || x >= this.width || y >= this.height || z >= this.depth) return false;
    this.tileArray[(y * this.width * this.depth) + (z * this.width) + x] = id;
    return true;
}

World.prototype.setTileIdWithUpdate = function(x, y, z, id) {
    this.setTileId(x, y, z, id);

    WorldRenderer.setChunkNeedsUpdate(this, x, y, z);
}

World.prototype.generate = function() {
    var width = this.width,
        height = this.height,
        depth = this.depth;

    for (var x = 0; x < width; x++) {
        for (var z = 0; z < depth; z++) {
            for (var y = 0; y < height; y++) {
                if (y == height - 50) this.setTileId(x, y, z, Block.GRASS.id);
                if (y < height - 50) this.setTileId(x, y, z, Block.DIRT.id);
                if (y < height - 55) this.setTileId(x, y, z, Block.STONE.id);
            }
        }
    }
}

World.prototype.toString = function() {
    return '[object World]';
}

})(window);