(function(window, undefined) {
'use strict';
window.Input = {};
Input.keyboard = {
    0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,
    a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,
    m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,
    y:89,z:90,space:32,del:46,enter:13,shift:16,backspace:8,

    /*5:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',72:'h',73:'i',
    74:'j',75:'k',76:'l',77:'m',78:'n',79:'o',80:'p',81:'q',82:'r',
    83:'s',84:'t',85:'u',86:'v',87:'w',88:'x',89:'y',90:'z',32:' ',
    49:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9,48:0,
    46:'del', 13:'enter', 16: 'shift',*/

    pressed: {},
    onDown: function(event) {
        var self = Input.keyboard;
        // log(event.keyCode);
        self.pressed[event.keyCode] = true;

        if (event.keyCode == self.space) {
            event.preventDefault();
        }
    },
    onUp: function(event) {
        var self = Input.keyboard;
        delete self.pressed[event.keyCode];
    },
    isDown: function(key) {
        var self = Input.keyboard;
        return self.pressed[key] == undefined ? false : true;
    },
}

Input.mouse = {
    leftPressed: false,
    rightPressed: false,
    locked: false,
    fullscreen: false,
    pointerLockRequiresFullscreen: false,
    x: 0,
    y: 0,
    moveX: 0,
    moveY: 0,
    element: null,
    container: null,
    setElement: function(element, container) {
        this.element = element;
        this.container = container;

        this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock;
        this.container.requestFullscreen = this.container.requestFullscreen || this.container.mozRequestFullscreen || 
            this.container.mozRequestFullScreen || this.container.webkitRequestFullscreen;

        container.addEventListener('mousedown', Input.mouse.onDown);
        container.addEventListener('click', function(event) {
            if (!Input.mouse.locked) Input.mouse.requestPointerLock();
        });
    },
    onMove: function(event) {
        // log(event);
        var self = Input.mouse;
        if (self.locked) {
            if (event.webkitMovementX != undefined) {
                self.moveX += event.webkitMovementX;
                self.moveY += event.webkitMovementY;
            } else if (event.mozMovementX != undefined) {
                self.moveX += event.mozMovementX;
                self.moveY += event.mozMovementY;
            } else if (event.movementX != undefined) {
                self.moveX += event.movementX;
                self.moveY += event.movementY;
            }
        } else {
            var element = self.element;
            if (element == null) return;
            var bb = element.getBoundingClientRect();
            var x = event.pageX - bb.left;
            var y = event.pageY - bb.top;

            self.moveX = x - self.x;
            self.moveY = y - self.y;
            self.x = x;
            self.y = y;
        }
    },
    onDown: function(event) {
        // log(event);
        var self = Input.mouse;
        if (event.button == 0) {
            self.leftPressed = true;
        } else if (event.button == 2) {
            self.rightPressed = true;
        }
    },
    onUp: function(event) {
        // log(event);
        var self = Input.mouse;
        if (event.button == 0) {
            self.leftPressed = false;
        } else if (event.button == 2) {
            self.rightPressed = false;
        }
    },
    requestPointerLock: function() {
        if (this.locked) return;

        var elem = this.element;

        if (this.pointerLockRequiresFullscreen) {
            this.requestFullscreen();
        } else {
            elem.requestPointerLock();
        }
    },
    requestFullscreen: function() {
        this.container.requestFullscreen();
    },
    fullscreenChange: function(event) {
        var elem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.mozFullScreenElement;
        if (!elem) {
            this.fullscreen = false;
        } else {
            this.fullscreen = true;
            elem.requestPointerLock = elem.requestPointerLock || elem.mozRequestPointerLock || elem.webkitRequestPointerLock;
            elem.requestPointerLock();
        }
    },
    lockChange: function() {
        var element = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
        var self = Input.mouse;

        if (!element) {
            log('Lock lost');
            self.locked = false;

            self.element.width = Main.width;
            self.element.height = Main.height;
            Renderer.updateViewport();
        } else {
            log('Locked');
            self.locked = true;

            var width = self.container.clientWidth,
                height = self.container.clientHeight;

            self.element.width = width;
            self.element.height = height;
            Renderer.updateViewport();
        }
    },
    pointerLockError: function(event) {
        log('Error locking pointer');
        log(event);

        // Try with fullscreen next time
        Input.mouse.pointerLockRequiresFullscreen = true;
    },
    onContextMenu: function(event) {
        event.preventDefault();
    }
}

window.addEventListener('keydown', Input.keyboard.onDown);
window.addEventListener('keyup',   Input.keyboard.onUp);
window.addEventListener('mousemove', Input.mouse.onMove);
window.addEventListener('mouseup', Input.mouse.onUp);
window.addEventListener('contextmenu', Input.mouse.onContextMenu);

document.addEventListener('pointerlockchange', Input.mouse.lockChange);
document.addEventListener('mozpointerlockchange', Input.mouse.lockChange);
document.addEventListener('webkitpointerlockchange', Input.mouse.lockChange);

document.addEventListener('pointerlockerror', Input.mouse.pointerLockError);
document.addEventListener('mozpointerlockerror', Input.mouse.pointerLockError);
document.addEventListener('webkitpointerlockerror', Input.mouse.pointerLockError);

document.addEventListener('fullscreenchange', Input.mouse.fullscreenChange);
document.addEventListener('mozfullscreenchange', Input.mouse.fullscreenChange);
document.addEventListener('webkitfullscreenchange', Input.mouse.fullscreenChange);

})(window);