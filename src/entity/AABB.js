(function(window, undefined) {
'use strict';
window.AABB = function(minX, minY, minZ, maxX, maxY, maxZ) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.minZ = minZ;
    this.maxZ = maxZ;
}

AABB.prototype.intersects = function(minX, minY, minZ, maxX, maxY, maxZ) {
    if (this.maxX <= minX || this.maxY <= minY || this.maxZ <= minZ) return false;
    if (this.minX >= maxX || this.minY >= maxY || this.minZ >= maxZ) return false;
    return true;
}

AABB.prototype.expand = function(x, y, z) {
    var minX = this.minX,
        minY = this.minY,
        minZ = this.minZ,
        maxX = this.maxX,
        maxY = this.maxY,
        maxZ = this.maxZ;

    if (x < 0) minX += x;
    if (x > 0) maxX += x;
    if (y < 0) minY += y;
    if (y > 0) maxY += y;
    if (z < 0) minZ += z;
    if (z > 0) maxZ += z;
    return new AABB(minX, minY, minZ, maxX, maxY, maxZ);
}

AABB.prototype.offset = function(x, y, z) {
    this.minX += x;
    this.maxX += x;
    this.minY += y;
    this.maxY += y;
    this.minZ += z;
    this.maxZ += z;
}

AABB.prototype.solveX = function(x, bb) {
    // Solve me (the tile) with bb (the entity)
    if (bb.maxZ <= this.minZ || bb.minZ >= this.maxZ) {
        return x;
    }
    if (bb.maxY <= this.minY || bb.minY >= this.maxY) {
        return x;
    }
    if (x > 0 && bb.maxX <= this.minX) {
        var amount = this.minX - bb.maxX;
        if (amount < x) { 
            x = amount;
        }
    }
    if (x < 0 && bb.minX >= this.maxX) {
        var amount = this.maxX - bb.minX;
        if (amount > x) {
            x = amount;
        }
    }
    return x;
}

AABB.prototype.solveY = function(y, bb) {
    if (bb.maxX <= this.minX || bb.minX >= this.maxX) {
        return y;
    }
    if (bb.maxZ <= this.minZ || bb.minZ >= this.maxZ) {
        return y;
    }
    if (y > 0 && bb.maxY <= this.minY) {
        var amount = this.minY - bb.maxY;
        if (amount < y) {
            y = amount;
        }
    }
    if (y < 0 && bb.minY >= this.maxY) {
        var amount = this.maxY - bb.minY;
        if (amount > y) {
            y = amount;
        }
    }
    return y;
}

AABB.prototype.solveZ = function(z, bb) {
    if (bb.maxX <= this.minX || bb.minX >= this.maxX) {
        return z;
    }
    if (bb.maxY <= this.minY || bb.minY >= this.maxY) {
        return z;
    }
    if (z > 0 && bb.maxZ <= this.minZ) {
        var amount = this.minZ - bb.maxZ;
        if (amount < z) {
            z = amount;
        }
    }
    if (z < 0 && bb.minZ >= this.maxZ) {
        var amount = this.maxZ - bb.minZ;
        if (amount > z) {
            z = amount;
        }
    }
    return z;
}

})(window);