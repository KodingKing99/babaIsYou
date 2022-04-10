MyGame.components.Text = function(spec){
    'use strict'
    const valueTypes = {
        WALL: 'Wall',
        STOP: 'Stop',
        PUSH: 'Push',
        IS: 'Is',
    }
    return {
        get name(){return 'text';},
        get key(){return spec.key;},
        get valueType(){return valueTypes[spec.key];},
    }
}