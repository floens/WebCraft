(function(window, undefined) {
'use strict';
window.EntityPlayer = function() {
    Entity.call(this);

    this.y = 200;
    this.x = 2;
    this.z = 2;

    this.width = 0.6,
    this.height = 1.8;
    this.depth = 0.6;

    this.bb = new AABB(this.x, this.y, this.z, this.x + this.width, this.y + this.height, this.z + this.depth);

    this.yaw = 2;
    this.pitch = 0.5;
    this.motionX = 0;
    this.motionY = 0;
    this.motionZ = 0;

    this.jumpSpeed = 0.124;
    this.speed = 0.010;
    this.maxSpeed = 0.058;
    this.stopSpeed = 0.85;

    this.tileChangeTimeout = 0;
}
EntityPlayer.prototype = Object.create(Entity.prototype);

EntityPlayer.prototype.tick = function(world) {
    this.doMove(world);

    this.doLook(world);

    this.doTilePlacement(world);
}

EntityPlayer.prototype.doTilePlacement = function(world) {
    var m = Input.mouse;

    this.tileChangeTimeout--;

    var tile = this.pick(world);

    if (m.leftPressed == true && this.tileChangeTimeout <= 0 && tile != null) {
        world.setTileIdWithUpdate(tile.x, tile.y, tile.z, Block.AIR.id);
        this.tileChangeTimeout = 15;
    } else if (m.rightPressed == true && this.tileChangeTimeout <= 0 && tile != null) {
        var tx = tile.x,
            ty = tile.y,
            tz = tile.z;

        switch (tile.side) {
            case 0:
                tx--;
                break;
            case 1:
                tx++;
                break;
            case 2:
                ty--;
                break;
            case 3:
                ty++;
                break;
            case 4:
                tz--;
                break;
            case 5:
                tz++;
                break;
        }


        if (!this.bb.intersects(tx, ty, tz, tx + 1, ty + 1, tz + 1) && world.getTileId(tx, ty, tz) == 0) {
            world.setTileIdWithUpdate(tx, ty, tz, Block.DIRT.id);

            this.tileChangeTimeout = 15;
        }
    }
}

EntityPlayer.prototype.pick = function(world) {
    var reach = 4;

    var y1 = -Math.cos(-this.pitch);
    var x = this.x + ((Math.sin(-this.yaw) * reach) * y1);
    var y = this.y + (Math.sin(-this.pitch) * reach);
    var z = this.z + ((Math.cos(-this.yaw) * reach) * y1);

    var tile = world.rayTrace(this.x, this.y, this.z, x, y, z);

    if (tile != null) {
        WorldRenderer.selectionPos = [tile.x, tile.y, tile.z];
    } else {
        WorldRenderer.selectionPos = null;
    }
    return tile;
}

EntityPlayer.prototype.doMove = function(world) {
    this.ya -= 0.007;
    this.xa = 0;
    this.za = 0;

    var k = Input.keyboard;

    var forward = k.isDown(k.w),
        left = k.isDown(k.a),
        right = k.isDown(k.d),
        back = k.isDown(k.s),
        jump = k.isDown(k.space);

    if (forward && !back) {
        this.motionZ -= this.speed;
    }

    if (back && !forward) {
        this.motionZ += this.speed;
    }

    if ((!forward && !back) || (forward && back)) {
        this.motionZ *= this.stopSpeed;
    }

    if (this.motionZ < -this.maxSpeed) this.motionZ = -this.maxSpeed;
    if (this.motionZ > this.maxSpeed) this.motionZ = this.maxSpeed;

    this.xa += -Math.sin(this.yaw) * this.motionZ;
    this.za +=  Math.cos(this.yaw) * this.motionZ;

    if (left && !right) {
        this.motionX -= this.speed;
    }

    if (right && !left) {
        this.motionX += this.speed;
    }

    if ((!left && !right) || (left && right)) {
        this.motionX *= this.stopSpeed;
    }

    if (this.motionX < -this.maxSpeed) this.motionX = -this.maxSpeed;
    if (this.motionX > this.maxSpeed) this.motionX = this.maxSpeed;

    this.xa += Math.cos(this.yaw) * this.motionX;
    this.za += Math.sin(this.yaw) * this.motionX;

    if (jump && this.onGround) {
        this.ya = this.jumpSpeed;
    }

    Entity.prototype.tick.call(this, world);

    if (!this.onGround) this.movedTotal = 0;
    this.movedTotal *= Math.min(1, this.moved * 100);
}

EntityPlayer.prototype.doLook = function(world) {
    var m = Input.mouse,
        delay = 400;

    if (m.locked) {
        this.yaw += m.moveX / delay;
        this.pitch += m.moveY / delay;
        m.moveX = 0;
        m.moveY = 0;
    }

    if (this.pitch > Math.PI / 2) {
        this.pitch = Math.PI / 2;
    }

    if (this.pitch < -Math.PI / 2) {
        this.pitch = -Math.PI / 2;
    }

    if (this.yaw > Math.PI * 2) this.yaw -= Math.PI * 2;
    if (this.yaw < 0) this.yaw += Math.PI * 2;

    WorldRenderer.setCamera(this.x, this.y - 0.1, this.z, this.yaw, this.pitch, 0);
}

})(window);