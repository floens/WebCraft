(function(window, undefined) {
'use strict';

window.Main = {
    width: 854,
    height: 480,
    container: null
}

var gl;

var init = function() {
    var canvas = document.getElementById('canvas');
    canvas.width = Main.width;
    canvas.height = Main.height;

    Main.container = document.getElementById('container');

    document.getElementById('wrapper').style.width = (Main.width) + 'px';

    Input.mouse.setElement(canvas, Main.container);

    log(window.navigator.userAgent);

    var options = {
        antialias: false,
        alpha: false,
    }

    gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
    if (!gl) {
        alert('This browser does not support WebGL.');
        return;
    }
    log(gl.getParameter(gl.VERSION) + ', ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

    loadFiles();
}

window.textures = {};
window.shaderSources = {};
var loadFiles = function() {
    var time = Date.now().toString();

    var image = new Image()
    image.onload = function() {
        window.textures.terrainImage = image;
        jQuery.get('src/shaders/shader.vs?v=' + time, function(data) {
            window.shaderSources.vs = data;
            jQuery.get('src/shaders/shader.fs?v=' + time, function(data) {
                window.shaderSources.fs = data;

                start();
            })
        })
    }
    image.src = 'res/terrain.png';
}

var world, renderer;
var start = function() {
    world = new World(4, 8, 4);
    var player = new EntityPlayer();
    world.addEntity(player);

    Renderer.setup(gl);
    WorldRenderer.setDimensions(world.width, world.height, world.depth);

    // Start the renderLoop
    renderLoop();
    // Start the tickloop
    tick.loop();
}

var renderLoop = function() {
    requestAnimFrame(renderLoop);
    // window.setTimeout(renderLoop, 0);

    Renderer.renderLoop(world);

    fps.loop();
}

var tickLoop = function() {
    world.tick();
}


var tick = {
    lastTime: Date.now(),
    unprocessed: 0,
    timesPerSecond: 60,
    timeout: 1000 / 60,
    loop: function() {
        var now = Date.now();
        tick.unprocessed += (now - tick.lastTime) / (1000 / tick.timesPerSecond);
        tick.lastTime = now;

        while(tick.unprocessed >= 1) {
            tick.unprocessed--;
            tickLoop();
            tick.frames++;
            if (Date.now() > tick.lastFrameTime + 1000) {
                tick.lastFrameTime = Date.now();
                tick.count = tick.frames;
                tick.frames = 0;
            }
        }

        setTimeout(tick.loop, tick.timeout);
    },
    lastFrameTime: Date.now(),
    frames: 0,
    count: 0,
}

var fps = {
    lastTime: Date.now(),
    frames: 0,
    count: 0,
    loop: function() {
        this.frames++;
        var now = Date.now();
        if (now - 1000 > this.lastTime) {
            // this.lastTime += 1000;
            this.lastTime = now;
            this.count = this.frames;
            this.frames = 0;
            
            document.getElementById('fps').innerHTML = this.count + ' fps, ' + WorldRenderer.numberOfUpdates + ' chunk updates<br>' + 
                WorldRenderer.numberOfChunks + ' chunks';
            // log(this.count + ' fps, ' + WorldRenderer.numberOfUpdates + ' chunk updates.');
            WorldRenderer.numberOfUpdates = 0;
        }
    }
}

window.addEventListener('load', init, false);
window.addEventListener('hashchange', function() {
    location.reload();
}, false);
})(window);