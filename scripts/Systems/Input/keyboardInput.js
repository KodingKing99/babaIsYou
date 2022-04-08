// --------------------------------------------------------------
//
// This system knows how to accept keyboard input and use that
// to move an entity, based on the entities 'keyboard-controlled'
// component settings.
//
// --------------------------------------------------------------
MyGame.systems.keyboardInput = (function () {
    'use strict';
    let keysDown = {};

    function keyPress(e) {
        keysDown[e.key] = e.timeStamp;
    }
    
    function keyRelease(e) {
        delete keysDown[e.key];
    }

    // --------------------------------------------------------------
    //
    // Public interface used to update entities based on keyboard input.
    //
    // --------------------------------------------------------------
    function update(elapsedTime, entities) {
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components['keyboard-controlled']) {
                let input = entity.components['keyboard-controlled'];
                for (let key in input.keys) {
                    if (keysDown[key]) {
                        entity.components.movable.facing = input.keys[key];
                        entity.components.movable.moveDirection = input.keys[key];
                        console.log(`Setting baba to face ${input.keys[key]} and move ${input.keys[key]}`)
                    }
                }
            }
        }
    }

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    let api = {
        update: update
    };

    return api;
}());
