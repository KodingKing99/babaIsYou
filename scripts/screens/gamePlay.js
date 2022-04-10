MyGame.screens['gamePlayScreen'] = (function(game){
    let cancelNextRequest = true;
    let lastTimeStamp;
    let model = null;

    function run(){
        // do nothing for now
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        // parseLevelsFile();
        model = MyGame.gameModel();
        gameLoop(lastTimeStamp);
    }
    function initialize(){
        // do nothing for now
        window.addEventListener(
            'keydown', function stopFrame(e) {
                if (e.key === 'Escape') {
                    cancelNextRequest = true;
                    // console.log('stop')
                }
            }
        );
    }
    function update(elapsedTime){
        // do nothing for now
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