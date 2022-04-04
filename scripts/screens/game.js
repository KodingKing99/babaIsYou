// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------

MyGame.game = (function (screens) {
    'use strict';

    //------------------------------------------------------------------
    //
    // This function is used to change to a new active screen.
    //
    //------------------------------------------------------------------
    function showScreen(id) {

        // Remove the active state from all screens.  There should only be one...
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }
        // Tell the screen to start actively running
        console.log(screens[id]);
        screens[id].run();
        //
        // Then, set the new screen to be active
        document.getElementById(id).classList.add('active');
    }
    
    //------------------------------------------------------------------
    //
    // This function performs the one-time game initialization.
    //
    //------------------------------------------------------------------
    function initialize() {
        let screen = null;
        //
        // Go through each of the screens and tell them to initialize
        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }

        // Make the main-menu screen the active one
        showScreen('mainMenu');
        window.addEventListener(
            'keydown', function goBack(e) {
                if (e.key === 'Escape') {
                    showScreen('mainMenu');
                    // screens['gamePlayScreen'].cancelNextRequest = true;
                }

            }
        );
    }

    return {
        initialize: initialize,
        showScreen: showScreen,
    };
}(MyGame.screens));
