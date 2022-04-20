MyGame.screens['mainMenu'] = (function(game) {
    'use strict';
    
    function initialize() {
        // do nothing for now
        // Setup each of menu events for the screens
        document.getElementById('new-game').addEventListener(
            'click',
            function(){ game.showScreen('levelsScreen') }
        )
        document.getElementById('customize-controls').addEventListener(
            'click', 
            function(){ game.showScreen('customizeControlsScreen') }
        )
        document.getElementById('credits').addEventListener(
            'click', 
            () => { game.showScreen('creditsScreen') }
        )
    }
    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
