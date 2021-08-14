// POINT CLASS
// Cartersian location of where mouse location
// was previously at. 
// Used to draw arcs between Points.
class Point {

    // Define class constructor
    constructor(x, y, lifetime, flip) {
        this.x = x;
        this.y = y;
        this.lifetime = lifetime;
        this.flip = flip;
    }

    // Get the distance between a & b
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Get the mid point between a & b
    static midPoint(a, b) {
        const mx = a.x + (b.x - a.x) * 0.5;
        const my = a.y + (b.y - a.y) * 0.5;
        return new Point(mx, my);
    }

    // Get the angle between a & b
    static angle(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.atan2(dy, dx);
    }

    // Simple getter for printing
    get pos() {
        return this.x + "," + this.y;
    }
}

export class MouseTrail {

    // constructor 
    constructor(canvas, options) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');

        //////////////////////////
        // Variable definitions //
        //////////////////////////

        this.canvas;
        this.context;

        options = options || {}
        
        this.active = options.active || true;
        this.keyboardEnabled = options.keyboardEnabled || true;

        this.mode = options.mode || 1;
        this.pathMode = options.pathMode || 1;
        this.spread = options.spread || 2;

        // this.lineColor = options.lineColor || 'rgb(237, 184, 131)';
        this.lineColorStart = options.lineColorStart || {
            r: 244,
            g: 255,
            b: 36,
        }
        this.lineColorEnd = options.lineColorEnd || {
            r: 0,
            g: 208,
            b: 255,
        }
        this.lineDuration = options.lineDuration || 2;
        this.lineFadeLinger = options.lineFadeLinger || 1;
        this.lineWidthStart = options.lineWidthStart || 5;
        this.fadeDuration = options.fadeDuration || 50;
        this.drawEveryFrame = options.drawEveryFrame || 1; // Only adds a Point after these many 'mousemove' events

        this.clickCount = 0;
        this.frame = 0;
        this.flipNext = true;
        this.points = new Array();

        // RequestAnimFrame definition
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        this.setup();
    }

    setup() {
        this.enableListeners();
        this.resizeCanvas();
        this.active && this.draw();
    }

    // Update canvas dimensions based on window
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addPoint(x, y) {
        this.flipNext = !this.flipNext;
        var point = new Point(x, y, 0, this.flipNext);
        this.points.push(point);
    }


    /* LISTENERS */

    enableListeners() {
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.keyboardEnabled && document.addEventListener('keypress', this.handleKeyPress.bind(this));
        window.addEventListener("resize", this.resizeCanvas.bind(this));
    }
    
    removeListeners() {
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('keypress', this.handleKeyPress);
        window.removeEventListener("resize", this.resizeCanvas);
    }

    handleMouseMove(e) {
        if (this.frame === this.drawEveryFrame) {
            this.addPoint(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
            this.frame = 0;
        }
        this.frame++;
    }
    
    handleKeyPress(event) {
        if (event.key === "1") this.mode = 1;
        if (event.key === "2") this.mode = 2;

        if (event.key == "q") this.spread = 1;
        if (event.key == "w") this.spread = 2;

        if (event.key == "a") this.pathMode = 1;
        if (event.key == "s") this.pathMode = 2;

        if (event.key == "z") {
            if (this.lineWidthStart < 100) this.lineWidthStart++;
        }
        if (event.key == "x") {
            if (this.lineWidthStart > 1) this.lineWidthStart--;
        }

        // if (event.key == "g") {

        //     var poopx = new Array();
        //     var poopy = new Array();

        //     this.asd(poopx, poopy);
        // }
    }

    // spawn(poopx, poopy) {
    //     var gap = 10;
    //     var rows = 10;
    //     var cols = 3;

    //     var width = this.canvas.width;
    //     var height = this.canvas.height;

    //     for (var i = (width / 2) - (gap * rows); i < (width / 2) + (gap * rows); i = i + gap) {
    //         if (i % (gap * 2) === 0) {
    //             for (var j = (height / 2) - (gap * cols); j < (height / 2) + (gap * cols); j = j + gap) {                            
    //                 poopx.push(i);
    //                 poopy.push(j);
    //             }
    //         } else {
    //             for (var j2 = (height / 2) + (gap * cols) - gap; j2 > (height / 2) - (gap * cols) - gap; j2 = j2 - gap) {
    //                 poopx.push(i);
    //                 poopy.push(j2);
    //             }
    //         }
    //     }
    // }

    // asd(poopx, poopy) {
    //     if (poopx.length <= 0) {
    //         this.spawn(poopx, poopy);
    //     }

    //     var x = poopx.pop();
    //     var y = poopy.pop();

    //     this.addPoint(x, y);
        
    //     setTimeout(() => {
    //         this.asd()
    //     }, 10);
    // }


    /* RENDER */

    start() {
        this.active = true;
        this.draw();
    }

    stop() {
        this.active = false;
    }

    // Draw current state
    draw() {
        if (this.active) {
            this.animatePoints();
            window.requestAnimFrame(this.draw.bind(this));
        }
    }

    // Update mouse positions
    animatePoints() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        var duration = this.lineDuration * 1000 / 60;
        var point, lastPoint;

        if (this.pathMode === 2) {
            this.context.beginPath();
        }

        for (var i = 0; i < this.points.length; i++) {
            point = this.points[i];

            if (this.points[i - 1] !== undefined) {
                lastPoint = this.points[i - 1];
            } else {
                lastPoint = this.points[i];
            }

            point.lifetime += 1;

            if (point.lifetime > duration) {
                this.points.splice(i, 1);
                continue;
            }

            // Begin drawing stuff!
            var inc = (point.lifetime / duration); // 0 to 1 over lineDuration
            // var dec = 1 - inc;

            var spreadRate;
            if (this.spread === 1) {
                spreadRate = this.lineWidthStart / (point.lifetime * 2);
            } // Lerp Decrease
            if (this.spread === 2) {
                spreadRate = this.lineWidthStart * (1 - inc);
            } // Linear Decrease

            //context.strokeStyle = this.lineColor;
            this.context.lineJoin = "round";
            this.context.lineWidth = spreadRate;
            // this.context.strokeStyle = 'rgb(' + Math.floor(255) + ',' + Math.floor(200 - (255 * dec)) + ',' + Math.floor(200 - (255 * inc)) + ')';

            var r = this.lineColorStart.r + ((this.lineColorEnd.r - this.lineColorStart.r) * inc);
            var g = this.lineColorStart.g + ((this.lineColorEnd.g - this.lineColorStart.g) * inc);
            var b = this.lineColorStart.b + ((this.lineColorEnd.b - this.lineColorStart.b) * inc);
            this.context.strokeStyle = `rgb(${r}, ${g}, ${b})`;

            var distance = Point.distance(lastPoint, point);
            var midpoint = Point.midPoint(lastPoint, point);
            var angle = Point.angle(lastPoint, point);

            if (this.pathMode === 1) {
                this.context.beginPath();
            }

            if (this.mode === 1) {
                this.context.arc(midpoint.x, midpoint.y, distance / 2, angle, (angle + Math.PI), point.flip);
            } else if (this.mode === 2) {
                this.context.moveTo(lastPoint.x, lastPoint.y);
                this.context.lineTo(point.x, point.y);
            }

            if (this.pathMode === 1) {
                this.context.stroke();
                this.context.closePath();
            }
        }

        if (this.pathMode === 2) {
            this.context.stroke();
            this.context.closePath();
        }

        //if (points.length > 0) { console.log(spreadRate + "|" + points.length + " points alive."); }
    }

}