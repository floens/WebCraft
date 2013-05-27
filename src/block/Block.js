(function(window, undefined) {
'use strict';

window.Block = function(id) {
    if (Block.byId[id] != undefined) {
        throw new TypeError('Block id ' + id + ' is already occupied by ' + Block.byId[id] + '.');
    } else {
        Block.byId[id] = this;
        this.id = id;
    }

    this.passable = false;
}

Block.prototype.getTexture = function(side) {
    return [0, 0];
}

Block.byId = [];

// Air block
//
var BlockAir = function(id) {
    Block.call(this, id);

    this.passable = true;
}
BlockAir.prototype = Object.create(Block.prototype);


var BlockStone = function(id) {
    Block.call(this, id);

    this.passable = false;
}
BlockStone.prototype = Object.create(Block.prototype);
BlockStone.prototype.getTexture = function(side) {
    return [1, 0];
}


var BlockCobblestone = function(id) {
    Block.call(this, id);

    this.passable = false;
}
BlockCobblestone.prototype = Object.create(Block.prototype);
BlockCobblestone.prototype.getTexture = function(side) {
    return [0, 1];
}


var BlockGrass = function(id) {
    Block.call(this, id);

    this.passable = false;
}
BlockGrass.prototype = Object.create(Block.prototype);
BlockGrass.prototype.getTexture = function(side) {
    if (side == 3) return [0, 0];
    if (side == 2) return [2, 0];
    return [3, 0];
}


var BlockDirt = function(id) {
    Block.call(this, id);

    this.passable = false;
}
BlockDirt.prototype = Object.create(Block.prototype);
BlockDirt.prototype.getTexture = function(side) {
    return [2, 0];
}


Block.AIR = new BlockAir(0);
Block.STONE = new BlockStone(1);
Block.COBBLESTONE = new BlockCobblestone(2);
Block.GRASS = new BlockGrass(3);
Block.DIRT = new BlockDirt(4);

})(window);