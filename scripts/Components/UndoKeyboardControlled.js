MyGame.components.UndoKeyboardControlled = function(spec) {
    'use strict';

    let api = {
        get name() { return 'undo-keyboard-controlled'; },
        get keys() { return spec.keys; }
    };

    return api;
};

