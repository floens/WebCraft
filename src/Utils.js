(function(window, undefined) {
'use strict';

window.log = function(e) {
    console.log(e);
}

window.requestAnimFrame = (function(){
    return window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame || 
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    }
})();

window.Random = {};
Random.int = function(max) {
    return Math.floor(Math.random() * max);
}

Random.float = function() {
    return Math.random();
}

})(window);