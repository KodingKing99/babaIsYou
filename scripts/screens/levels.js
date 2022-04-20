MyGame.screens['levelsScreen'] = (function(game) {
    function initialize() {
        // Setup each of menu events for the screens
        document.getElementById('level1').addEventListener(
            'click',
            function(){
                MyGame.level = 1;
                game.showScreen('gamePlayScreen'); 
            }
        )
        document.getElementById('level2').addEventListener(
            'click',
            function(){
                MyGame.level = 2;
                game.showScreen('gamePlayScreen');
            }
        )
        document.getElementById('level3').addEventListener(
            'click',
            function(){
                MyGame.level = 3;
                game.showScreen('gamePlayScreen');
            }
        )
        document.getElementById('level4').addEventListener(
            'click',
            function(){
                MyGame.level = 4;
                game.showScreen('gamePlayScreen');
            }
        )
        document.getElementById('level5').addEventListener(
            'click',
            function(){
                MyGame.level = 5;
                game.showScreen('gamePlayScreen');
            }
        )
        document.getElementById('levelsBackButton').addEventListener(
            'click',
            () => {game.showScreen('mainMenu')}
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
