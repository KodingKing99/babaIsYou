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
        e.preventDefault();
        // console.log(e.key);
        keysDown[e.key] = e.timeStamp;
    }

    function keyRelease(e) {
        delete keysDown[e.key];
    }
    function keyRelease2(key) {
        delete keysDown[key];
    }


    // function
    function moveAll(entities, key, input) {
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components.movable) {
                entity.components.movable.facing = input.keys[key];
                entity.components.movable.moveDirection = input.keys[key];
            }
        }
    }
    function setUndo(entity, action){
        entity.addComponent(MyGame.components.Undo({type: action}));
    }
    function doMove(entities) {
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components['keyboard-controlled']) {
                let input = entity.components['keyboard-controlled'];
                for (let key in input.keys) {
                    if (keysDown[key]) {
                        // MyGame.assets['moveSound'].play();
                        let sound = new Audio();
                        sound.src = 'assets/moveSound.mp3';
                        sound.play();
                        moveAll(entities, key, input);
                        keyRelease2(key);
                    }
                }
            }
            else if (entity.components['undo-keyboard-controlled']) {
                let input = entity.components['undo-keyboard-controlled'];
                // console.log(entity);
                
                for (let key in input.keys) {
                    if (keysDown[key]) {
                        setUndo(entity, input.keys[key]);
                        keyRelease2(key);
                    }
                }
            }
        }
    }

    // --------------------------------------------------------------
    //
    // Public interface used to update entities based on keyboard input.
    //
    // --------------------------------------------------------------
    function update(elapsedTime, entities) {
        doMove(entities);
    }

    window.addEventListener('keydown', keyPress);
    // window.addEventListener('keyup', keyRelease);

    let api = {
        update: update
    };

    return api;
}());
