let MyGame = {
    screens: {},
    systems: {},
    render: {},
    assets: {},
    components: {},
    constants: {},
};
requirejs.config({
    baseUrl: 'scripts',
});
//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------
MyGame.loader = (function() {
    'use strict';
    let scriptOrder = [
        {
            scripts: ['screens/game'],
            message: 'game screen loaded',
            onComplete: null
        }, 
        {
            scripts: ['screens/mainMenu', 'screens/credits',
                    'screens/customizeControls', 'screens/gamePlay'],
            message: 'Other screens loaded',
            onComplete: null
        },
        {
            scripts: ['Components/KeyboardControlled', 'Components/Sprite',
                    'Components/Position','Components/Size', 'Components/Rotation', 
                    'Components/BoardPosition', 'Components/Movable', 'Components/Noun', 'Components/Properties',
                    'Components/Text'],
            message: 'Components loaded',
            onComplete: null
        },
        {
            scripts: ['Systems/Entity/entityFactory'],
            message: 'entity factory has loaded',
            onComplete: null
        }, 
        {
            scripts: ['Systems/Render/graphics'],
            message: 'Rendering graphics api loaded',
            onComplete: null
        },
        {
            scripts: ['Systems/Render/renderAnimatedSprite'],
            message: 'Animated sprite renderer loaded',
            onComplete: null
        },
        {
            scripts: ['Systems/Input/keyboardInput'],
            message: 'input system loaded',
            onComplete: null
        },
        {
            scripts: ['Systems/Movement/movement'],
            message: 'movement system loaded',
            onComplete: null
        },
        {
            scripts: ['Systems/Rules/rules'],
            message: 'rule system loaded',
            onComplete: null
        },
        {
            scripts: ['gameModel/DirectionConstants'],
            message: 'constants loaded',
            onComplete: null
        },
        {
            scripts: ['gameModel/gameModel'],
            message: 'gameModel has loaded',
            onComplete: null
        }, 
        // {
        //     scripts: ['Render/particle-system'],
        //     message: 'Particle system renderer loaded',
        //     onComplete: null
        // }, {
        //     scripts: ['game'],
        //     message: 'Game loop and model loaded',
        //     onComplete: null
        // }
    ];

    let assetOrder = [
        {
            key: 'backgroundImage',
            source: '../assets/babaIsYouBackground.png'
        }, 
        {
            key: 'bunnyDown',
            source: '/assets/bunnyDown.png'
        },
        {
            key: 'bunnyUp',
            source: '/assets/bunnyUp.png'
        },
        {
            key: 'bunnyLeft',
            source: '/assets/bunnyLeft.png'
        },
        {
            key: 'bunnyRight',
            source: '/assets/bunnyRight.png'
        },
        {
            key: 'wall',
            source: '/assets/wall_brown1.png'
        },
        {
            key: 'levels-all',
            source: '/assets/levels-all.txt'
        },
        {
            key: 'rock',
            source: '/assets/rock_tan1.png'
        },
        {
            key: 'hedge',
            source: '/assets/hedge_green1.png'
        },
        {
            key: 'word-wall',
            source: '/assets/word-wall.png'
        },
        {
            key: 'word-stop',
            source: '/assets/word-stop_red1.png'
        },
        {
            key: 'word-is',
            source: '/assets/word-is_cyan1.png'
        },
        {
            key: 'word-push',
            source: '/assets/word-push_orange1.png'
        },
        {
            key: 'word-wall',
            source: '/assets/word-wall_green1.png'
        },
    ];

    //------------------------------------------------------------------
    //
    // Helper function used to load scripts in the order specified by the
    // 'scripts' parameter.  'scripts' expects an array of objects with
    // the following format...
    //    {
    //        scripts: [script1, script2, ...],
    //        message: 'Console message displayed after loading is complete',
    //        onComplete: function to call when loading is complete, may be null
    //    }
    //
    //------------------------------------------------------------------
    function loadScripts(scripts, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function() {
                console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.shift();    // Alternatively: scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // Helper function used to load assets in the order specified by the
    // 'assets' parameter.  'assets' expects an array of objects with
    // the following format...
    //    {
    //        key: 'asset-1',
    //        source: 'asset/.../asset.png'
    //    }
    //
    // onSuccess is invoked per asset as: onSuccess(key, asset)
    // onError is invoked per asset as: onError(error)
    // onComplete is invoked once per 'assets' array as: onComplete()
    //
    //------------------------------------------------------------------
    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function(asset) {
                    onSuccess(entry, asset);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function(error) {
                    onError(error);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest();
        let fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = (fileExtension === 'txt') ? 'text' : 'blob';

            xhr.onload = function() {
                let asset = null;
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3') {
                        asset = new Audio();
                    } else if (fileExtension === 'txt') {
                        if (onSuccess) { onSuccess(xhr.responseText); }
                    }
                    else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    if (xhr.responseType === 'blob') {
                        asset.onload = function() {
                            window.URL.revokeObjectURL(asset.src);
                            if (onSuccess) { onSuccess(asset); }
                        };
                        asset.src = window.URL.createObjectURL(xhr.response);
                    }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
            xhr.send();
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }
    }

    function setBackgroundImage(){
        // console.log("setting background image")
        // let mString = `url('${MyGame.assets['backgroundImage'].src}')`
        document.body.style.backgroundImage = "url(../assets/babaIsYouBackground.png)";
        // console.log(MyGame.assets['backgroundImage'])

    }
    //------------------------------------------------------------------
    //
    // Called when all the scripts are loaded, it kicks off the demo app.
    //
    //------------------------------------------------------------------
    function mainComplete() {
        console.log('It is all loaded up');
        MyGame.game.initialize();
        // MyGame.main.initialize();
    }

    //
    // Start with loading the assets, then the scripts.
    console.log('Starting to dynamically load project assets');
    loadAssets(assetOrder,
        function(source, asset) {    // Store it on success
            // console.log(this);
            MyGame.assets[source.key] = asset;
        },
        function(error) {
            console.log(error);
        },
        function() {
            console.log('All game assets loaded');
            console.log('Starting to dynamically load project scripts');
            setBackgroundImage();
            loadScripts(scriptOrder, mainComplete);
        }
    );

}());

