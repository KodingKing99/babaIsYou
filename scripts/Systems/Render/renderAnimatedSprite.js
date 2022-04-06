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
        for(let key in entities){
            let entity = entities[key];
            if(entity.components.sprite){
                let component = entity.components.sprite;
                component.subAnimationTime(elapsedTime);
                if(component.animationTime <= 0){
                    component.incrementSubImageIndex();
                    component.resetAnimationTime();
                }
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Render the specific sub-texture animation frame
    //
    //------------------------------------------------------------------
    /////////
    // Currently trying to draw one image, the first bunny.
    ////////
    function render(entities) {
        graphics.clear();
        for(let key in entities){
            let entity = entities[key];
            if(entity.components.position && entity.components.sprite && entity.components.size && entity.components.rotation){
                let mImage = MyGame.assets[entity.components.sprite.key];
                let subImageWidth = mImage.width / entity.components.sprite.spriteCount;
                let subImageHeight = mImage.height;
                let sx = subImageWidth * entity.components.sprite.subImageIndex;
                let sy = 0;
                graphics.drawSubTexture(mImage, sx, sy, subImageWidth, subImageHeight, entity.components.position, entity.components.rotation.rotation, entity.components.size)
            }
        }
    }


    let api = {
        update: update,
    };

    return api;
}(MyGame.systems.render.graphics, MyGame.assets);
