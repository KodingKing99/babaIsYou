// --------------------------------------------------------------
//
// This system knows how to accept keyboard input and use that
// to move an entity, based on the entities 'keyboard-controlled'
// component settings.
//
// --------------------------------------------------------------
MyGame.systems.keyboardInput = (function () {
    function addInputComponent(entity) {
        entity.addComponent(MyGame.components.KeyboardControlled({
            keys: {
                'ArrowUp': MyGame.constants.direction.UP,
                'ArrowDown': MyGame.constants.direction.DOWN,
                'ArrowLeft': MyGame.constants.direction.LEFT,
                'ArrowRight': MyGame.constants.direction.RIGHT,
            },
        }))
        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        entity.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
                facing: MyGame.constants.direction.RIGHT,
            }
        ))
    }
    'use strict';
    let keysDown = {};

    function keyPress(e) {
        e.preventDefault();
        keysDown[e.key] = e.timeStamp;
    }

    function keyRelease(e) {
        delete keysDown[e.key];
    }
    function keyRelease2(key) {
        delete keysDown[key];
    }

    // --------------------------------------------------------------
    //
    // Public interface used to update entities based on keyboard input.
    //
    // --------------------------------------------------------------
    function update(elapsedTime, entities) {
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components.properties) {
                if (entity.components.properties.is('YOU')) {
                    // console.log(entitycomponents.properties)
                    addInputComponent(entity);
                    if (entity.components['keyboard-controlled']) {
                        let input = entity.components['keyboard-controlled'];
                        for (let key in input.keys) {
                            if (keysDown[key]) {
                                entity.components.movable.facing = input.keys[key];
                                entity.components.movable.moveDirection = input.keys[key];
                                keyRelease2(key);
                            }
                        }
                    }
                }
                else {
                    if (entity.components['keyboard-controlled']) {
                        entity.removeComponent(entity.components['keyboard-controlled'])
                        // entity.removeComponent(entity.components.movable)
                    }
                }
            }


        }
    }

    window.addEventListener('keydown', keyPress);
    // window.addEventListener('keyup', keyRelease);

    let api = {
        update: update
    };

    return api;
}());
