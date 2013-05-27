(function(window, undefined) {
'use strict';
window.Entity = function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.xa = 0;
    this.ya = 0;
    this.za = 0;

    this.bb = new AABB(0, 0, 0, 0, 0, 0);

    this.width = 1;
    this.height = 1;
    this.depth = 1;

    this.onGround = false;
    this.collidedX = false;
    this.collidedY = false;
    this.collidedZ = false;

    this.moved = 0;
    this.movedTotal = 0;

    this.removed = false;
}

Entity.prototype.tick = function(world) {
    if (Math.abs(this.xa) < 0.0005) this.xa = 0;
    if (Math.abs(this.ya) < 0.0005) this.ya = 0;
    if (Math.abs(this.za) < 0.0005) this.za = 0;

    var lx = this.x,
        lz = this.z;

    this.move(world, this.xa, this.ya, this.za);

    var dx = this.x - lx,
        dz = this.z - lz;

    this.movedTotal += Math.sqrt(dx * dx + dz * dz);
    this.moved = Math.sqrt(dx * dx + dz * dz);
}

Entity.prototype.move = function(world, xa, ya, za) {
    var xo = xa,
        yo = ya,
        zo = za;

    var boundingBoxes = world.getCollidingBoundingBoxes(this.bb.expand(xa, ya, za));
    
    for (var i = 0; i < boundingBoxes.length; i++) {
        za = boundingBoxes[i].solveZ(za, this.bb);
    }
    this.bb.offset(0, 0, za);

    for (var i = 0; i < boundingBoxes.length; i++) {
        xa = boundingBoxes[i].solveX(xa, this.bb);
    }
    this.bb.offset(xa, 0, 0);

    for (var i = 0; i < boundingBoxes.length; i++) {
        ya = boundingBoxes[i].solveY(ya, this.bb);
    }
    this.bb.offset(0, ya, 0);

    this.onGround = (yo != ya && yo < 0) ? true : false;

    this.collidedX = xo != xa;
    this.collidedY = yo != ya;
    this.collidedZ = zo != za;

    if (this.collidedX) this.xa = 0;
    if (this.collidedY) this.ya = 0;
    if (this.collidedZ) this.za = 0;

    this.x = this.bb.minX + (this.width / 2);
    this.y = this.bb.minY + this.height;
    this.z = this.bb.minZ + (this.depth / 2);
}

Entity.prototype.remove = function() {
    this.removed = true;
}

})(window);