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
        keysDown[e.key] = e.timeStamp;
    }

    function keyRelease(e) {
        delete keysDown[e.key];
    }
    function keyRelease2(key) {
        delete keysDown[key];
    }

    
    // function
    function moveAll(entities, key, input){
        for(let id in entities){
            let entity = entities[id];
            if(entity.components.movable){
                entity.components.movable.facing = input.keys[key];
                entity.components.movable.moveDirection = input.keys[key];
            }
        }
    }
    function doMove(entities) {
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components['keyboard-controlled']) {
                let input = entity.components['keyboard-controlled'];
                for (let key in input.keys) {
                    if (keysDown[key]) {
                        moveAll(entities, key, input);
                        keyRelease2(key);
                    }
                }
            }
        }
    }
    // function checkIsYou(entities){
    //     for (let id in entities) {
    //         let entity = entities[id];
    //         if (entity.components.properties) {
    //             if (entity.components.properties.is('YOU')) {
    //                 // console.log(`Entity is you: ${entity.components.noun.valueType}`)
    //                 addInputComponent(entity);
    //                 // console.log(entity);
    //             }
    //             else {
    //                 // console.log("hello");
    //                 // if (entity.components['keyboard-controlled']) {
    //                 //     console.log(`Removing keyboard input from entity:`)
    //                 //     entity.removeComponent(entity.components['keyboard-controlled']);
    //                 //     console.log(entity);
    //                 // }
    //                 // console.log('hello')
    //                 // console.log(entity.components.movable);
    //             }
    //         }
    //         else{
    //             if(entity.components.movable) {
    //                 console.log("removing moving component")
    //                 entity.removeComponent(entity.components.movable);
    //             }
    //         }
    //     }   
    // }
    // --------------------------------------------------------------
    //
    // Public interface used to update entities based on keyboard input.
    //
    // --------------------------------------------------------------
    function update(elapsedTime, entities) {
        // for (let id in entities) {
        //     let entity = entities[id];
        //     checkIsYou(entity);
        // }
        // checkIsYou(entities);
        doMove(entities);
        // for(let id in entities) {
        //     let entity = entities[id];
        //     doMove(entities, entity);
        // }

        
    }

    window.addEventListener('keydown', keyPress);
    // window.addEventListener('keyup', keyRelease);

    let api = {
        update: update
    };

    return api;
}());
