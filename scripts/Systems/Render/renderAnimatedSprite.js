// --------------------------------------------------------------
//
// Renders an animated object
//
// --------------------------------------------------------------

MyGame.systems.render.renderAnimatedSprite = function (graphics) {
    'use strict';
    // let extraAnimationDuration;
    function subAnimationTime(howMuch, componenet) {
        componenet.animationTime -= howMuch;
    }
    function subExtraDuration(howMuch, component) {
        component.extraAnimationDuration -= howMuch;
    }
    function incrementSubImageIndex(componenet) {
        componenet.subImageIndex += 1;
        componenet.subImageIndex = componenet.subImageIndex % componenet.spritesToAnimate;
    }
    function animateExtra(entity, howMany, newAnimationTime) {
        let sprite = entity.components.sprite;
        // spriteCountBefore = sprite.spritesToAnimate;
        // let animationTimeBefore = sprite.animationTime;
        if (newAnimationTime) {
            sprite.animationTime = newAnimationTime;
        }
        // let duration = howMany * sprite.animationTime;
        sprite.spritesToAnimate = howMany;
        sprite.animateExtra = false;
        sprite.animationTime = newAnimationTime;
        sprite.animationTimeCopy = newAnimationTime;
        // set the sprite to animate that extra animation for the full duration needed
        sprite.extraAnimationDuration = sprite.animationTime * sprite.spritesToAnimate;

    }
    //------------------------------------------------------------------
    //
    // Update the state of the animation
    // since this is the static renderer, the update logic will be based on a function
    // of the model's.
    //
    //------------------------------------------------------------------
    function update(elapsedTime, entities) {
        render(entities)
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.sprite) {
                let component = entity.components.sprite;
                subAnimationTime(elapsedTime, component);
                if (component.animationTime <= 0) {
                    incrementSubImageIndex(component);
                    component.resetAnimationFrame();
                }
                if (component.animateExtra) {
                    console.log("queing walking animation")
                    animateExtra(entity, 15, 50);

                }
                if (component.extraAnimationDuration || component.extraAnimationDuration != null) {
                    subExtraDuration(elapsedTime, component)
                    if (component.extraAnimationDuration <= 0) {
                        component.resetAnimationToOriginal();
                        component.extraAnimationDuration = null;
                    }
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
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.position && entity.components.sprite && entity.components.size && entity.components.rotation) {
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
}(MyGame.systems.render.graphics);
