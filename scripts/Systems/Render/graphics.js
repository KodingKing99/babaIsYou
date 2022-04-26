// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
// initializing the render system object
MyGame.systems['render'] = {};

MyGame.systems.render.graphics = (function() {
    'use strict';

    let that = {};
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d')

    //------------------------------------------------------------------
    //
    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    //
    //------------------------------------------------------------------
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    that.clear = function() {
        context.clear();
    };

    //------------------------------------------------------------------
    //
    // Simple pass-through to save the canvas context.
    //
    //------------------------------------------------------------------
    that.saveContext = function() {
        context.save();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through the restore the canvas context.
    //
    //------------------------------------------------------------------
    that.restoreContext = function() {
        context.restore();
    }

    //------------------------------------------------------------------
    //
    // Rotate the canvas to prepare it for rendering of a rotated object.
    //
    //------------------------------------------------------------------
    that.rotateCanvas = function(center, rotation) {
        context.translate(center.x * canvas.width, center.y * canvas.width);
        context.rotate(rotation);
        context.translate(-center.x * canvas.width, -center.y * canvas.width);
    }

    //------------------------------------------------------------------
    //
    // Draw a square (with an optional border) into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    that.drawSquare = function(corner, size, fill, stroke) {
        // console.log("Drawing square");
        context.fillStyle = fill;
        context.fillRect(corner.x, corner.y, size, size);

        if (stroke) {
            context.strokeStyle = stroke;
            context.strokeRect(corner.x, corner.y, size, size);
        }
    }

    //------------------------------------------------------------------
    //
    // Draw a rectangle (with an optional border) into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    that.drawRectangle = function(corner, width, height, fill, stroke) {
        context.fillStyle = fill;
        context.fillRect(corner.x, corner.y, width, height);

        if (stroke) {
            context.strokeStyle = stroke;
            context.strokeRect(corner.x, corner.y, width, height);
        }
    }

    //------------------------------------------------------------------
    //
    // Draw a circle into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    that.drawCircle = function(center, radius, color) {
        // debugger;
        // console.log('drawing circle')
        context.beginPath();
        // context.arc(center.x * (canvas.width) , center.y * canvas.width, 2 * radius * canvas.width, 2 * Math.PI, false);
        // context.arc(center.x * canvas.width, center.y * canvas.width, 2 * radius * (canvas.width / 10), 2 * Math.PI, false);
        context.arc(center.x , center.y , 2 * radius, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }


    // --------------------------------------------------------------
    //
    // Draws a sub-texture to the canvas with the following specification:
    //    image: Image
    //    index: index of sub-texture to draw
    //    subTextureWidth: pixel width of the sub-texture to draw
    //    center: {x: , y: }
    //    rotation: radians
    //    size: { x: , y: } // Size (in pixels) to render the sub-texture
    //
    // --------------------------------------------------------------
    that.drawSubTexture = function(image, sx, sy, subTextureWidth, subTextureHeight, center, rotation, size) {
        this.saveContext(); 

        // this.rotateCanvas(center, rotation);
        //
        // Pick the selected sprite from the sprite sheet to render
        context.drawImage(
            image,
            sx, sy,      // Which sub-texture to pick out
            subTextureWidth, subTextureHeight,   // The size of the sub-texture
            center.x - size.x / 2,           // Where to draw the sub-texture
            center.y - size.y / 2,
            size.x, size.y);

        this.restoreContext();
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    rotation: radians
    //    size: { x: , y: }
    //
    // --------------------------------------------------------------
    that.drawTexture = function(image, center, rotation, size) {
        // debugger;
        this.saveContext(); 
        // console.log(rotation);
        // console.log(center);
        this.rotateCanvas(center, rotation);
        // console.log("drawing texture")
        // console.log(image.width);
        context.drawImage(
            image,
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);
        // console.log("drew texture")

        that.restoreContext();
    }

    //------------------------------------------------------------------
    //
    // Draw some text to the screen to indicate the game is over
    //
    //------------------------------------------------------------------
    that.drawText = function(spec) {
        context.save();

        context.font = spec.font,
        context.fillStyle = spec.fill;
        if (spec.hasOwnProperty('stroke')) {
            context.strokeStyle = spec.stroke;
        }
        context.textBaseline = 'top';

        context.fillText(spec.text, spec.position.x, spec.position.y);
        context.strokeText(spec.text, spec.position.x, spec.position.y);

        context.restore();
    }

    Object.defineProperty(that, 'width', {
        get: () => canvas.width
    });
    Object.defineProperty(that, 'height', {
        get: () => canvas.height
    });

    return that;
}());
