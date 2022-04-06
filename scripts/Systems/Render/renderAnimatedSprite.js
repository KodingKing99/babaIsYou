// --------------------------------------------------------------
//
// Renders an animated object
//
// --------------------------------------------------------------
MyGame.systems.render.renderAnimatedSprite =  function (graphics, assets) {
    'use strict';
    //------------------------------------------------------------------
    //
    // Update the state of the animation
    // since this is the static renderer, the update logic will be based on a function
    // of the model's.
    //
    //------------------------------------------------------------------
    function update(elapsedTime, entities) {
        render(entities)
    }

    function getSubImageWidth(spriteComponenet, asset){

    }
    //------------------------------------------------------------------
    //
    // Render the specific sub-texture animation frame
    //
    //------------------------------------------------------------------
    // function render(spriteComponenet, positionComponent, sizeComponent, rotationComonenet, assetId) {
    //     if (isReady) {
    //         let sxOffset = Math.floor(subImageWidth * offsetSpriteCount.x) // how many pixels to go before your sprite
    //         let subSpriteWidth = subImageWidth;
    //         if (spec.halfSize) {
    //             subSpriteWidth = subImageWidth / 2 // divide the sprite by 2 if it's half size
    //             // subImageIndex = subImageIndex / 2
    //         }
    //         let sx = (subSpriteWidth * subImageIndex) + sxOffset// where to start clippin
    //         let sy = subImageHeight * spec.offsetSpriteCount.y// # of pixels before your image
    //         if (spec.log) {
    //             console.log(`sx is: ${sx} sy is: ${sy}, offset is ${sxOffset}, sprite width is ${subSpriteWidth}, spriteHeight is ${subImageHeight}`)
    //             spec.log = false;
    //         }
    //         graphics.drawSubTexture(image, sx, sy, subSpriteWidth - spec.extraOffset.x, subImageHeight - spec.extraOffset.y, model.center, model.rotation, model.size);
    //     }
    //     let subImageWidth = getSubImageWidth()
    // }
    /////////
    // Currently trying to draw one image, the first bunny.
    ////////
    function render(entities) {
        graphics.clear();
        for(let key in entities){
            let entity = entities[key];
            if(entity.components.position && entity.components.sprite && entity.components.size && entity.components.rotation){
                // console.log(MyGame.assets)
                // console.log(entity.components.sprite.key)
                let mImage = MyGame.assets[entity.components.sprite.key];
                // console.log(mImage)
                let sx = 0;
                let sy = 0;
                let subImageWidth = mImage.width / 15;
                let subImageHeight = mImage.height;
                graphics.drawSubTexture(mImage, sx, sy, subImageWidth, subImageHeight, entity.components.position, entity.components.rotation.rotation, entity.components.size)
            }
        }
    }


    let api = {
        update: update,
    };

    return api;
}(MyGame.systems.render.graphics, MyGame.assets);
