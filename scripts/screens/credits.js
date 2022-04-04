MyGame.screens['creditsScreen'] = (function(game){
    function initialize(){
        document.getElementById('creditsBackButt').addEventListener(
            'click', () => {game.showScreen('mainMenu')}
        );
    }
    function run(){
        // do something
    }
    return{
        initialize: initialize,
        run: run
    }
}(MyGame.game));