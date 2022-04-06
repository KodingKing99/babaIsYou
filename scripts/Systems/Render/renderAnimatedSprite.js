// --------------------------------------------------------------
//
// Renders an animated object
//
// --------------------------------------------------------------
MyGame.systems.render.renderAnimatedSprite =  function (graphics) {
    'use strict';
    //------------------------------------------------------------------
    //
    // Update the state of the animation
    // since this is the static renderer, the update logic will be based on a function
    // of the model's.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
    //     animationTime += elapsedTime;
    //     //
    //     // Check to see if we should update the animation frame
    //     if (animationTime >= spec.spriteTime[subImageIndex]) {

    //         subImageIndex += 1;
    //         // console.log(subImageIndex);
    //         //
    //         // Wrap around from the last back to the first sprite as needed
    //         subImageIndex = subImageIndex % spec.spriteCount;
    //     }
    }

    function getSubImageWidth(spriteComponenet, asset){

    }
    //------------------------------------------------------------------
    //
    // Render the specific sub-texture animation frame
    //
    //------------------------------------------------------------------
    function render(spriteComponenet, positionComponent, sizeComponent, rotationComonenet, assetId) {
        if (isReady) {
            let sxOffset = Math.floor(subImageWidth * offsetSpriteCount.x) // how many pixels to go before your sprite
            let subSpriteWidth = subImageWidth;
            if (spec.halfSize) {
                subSpriteWidth = subImageWidth / 2 // divide the sprite by 2 if it's half size
                // subImageIndex = subImageIndex / 2
            }
            let sx = (subSpriteWidth * subImageIndex) + sxOffset// where to start clippin
            let sy = subImageHeight * spec.offsetSpriteCount.y// # of pixels before your image
            if (spec.log) {
                console.log(`sx is: ${sx} sy is: ${sy}, offset is ${sxOffset}, sprite width is ${subSpriteWidth}, spriteHeight is ${subImageHeight}`)
                spec.log = false;
            }
            graphics.drawSubTexture(image, sx, sy, subSpriteWidth - spec.extraOffset.x, subImageHeight - spec.extraOffset.y, model.center, model.rotation, model.size);
        }
        let subImageWidth = getSubImageWidth()
    }

    let api = {
        update: update,
        render: render
    };

    return api;
}(MyGame.systems.render.graphics);
