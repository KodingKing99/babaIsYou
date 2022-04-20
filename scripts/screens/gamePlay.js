MyGame.screens['gamePlayScreen'] = (function(game){
    let cancelNextRequest = true;
    let lastTimeStamp;
    let model = null;

    function run(){
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        // parseLevelsFile();
        model = MyGame.gameModel();
        gameLoop(lastTimeStamp);
    }
    function initialize(){
        window.addEventListener(
            'keydown', function stopFrame(e) {
                if (e.key === 'Escape') {
                    cancelNextRequest = true;
                    // console.log('stop')
                }
            }
        );
        document.getElementById('canvasBack').addEventListener(
            'click', () => { game.showScreen('mainMenu'); }
        );
    }
    function update(elapsedTime){
        model.update(elapsedTime);
    }
    
    function gameLoop(time){
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        update(elapsedTime);
        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }
    return {
        run: run,
        initialize: initialize
    }
}(MyGame.game))