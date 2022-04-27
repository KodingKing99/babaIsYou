MyGame.screens['gamePlayScreen'] = (function(game){
    let cancelNextRequest = true;
    let lastTimeStamp;
    let model = null;
    let inputBuffer = {};

    function run(){
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        model = MyGame.gameModel();
        gameLoop(lastTimeStamp);
    }
    function initialize(){
        window.addEventListener(
            'keydown', function stopFrame(e) {
                if (e.key === 'Escape') {
                    cancelNextRequest = true;
                }
            }
        );
        document.getElementById('canvasBack').addEventListener(
            'click', () => { game.showScreen('mainMenu'); }
        );
    }
    function update(elapsedTime){
        model.update(elapsedTime);
        if (MyGame.hasWon) {
            window.addEventListener('keyup', function(event) {
                inputBuffer[event.key] = event.key;
            })
            for (let input in inputBuffer) {
                if (input === 'Enter') {
                    cancelNextRequest = true;
                    MyGame.level++
                    if (MyGame.level === MyGame.levelInfo.length) {
                        MyGame.level = 1;
                    }
                    run();
                }
            }
            inputBuffer = {};
        }
    }
    
    function gameLoop(time){
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        update(elapsedTime);
        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        } else {
            MyGame.assets['backgroundMusic'].pause();
        }
    }
    return {
        run: run,
        initialize: initialize
    }
}(MyGame.game))