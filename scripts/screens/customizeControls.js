MyGame.screens['customizeControlsScreen'] = (function (game, keyboard) {

    function initialize() {
        document.getElementById('customizeControlsBackButt').addEventListener(
            'click', () => { game.showScreen('mainMenu'); }
        );
        run();
    }

    function changeControl(domElement, control) {
        domElement.innerHTML = "";
        domElement.innerHTML += "Press Key to Change Control";
        window.addEventListener(
            'keydown',
            function changeKey(e) {
                keyboard.registerControl(e.key, control);
                window.removeEventListener('keydown', changeKey)
                render();
            }
        );
    }
    function render() {
        keyboard = MyGame.systems.keyboardInput;
        if (keyboard.controls[MyGame.constants.direction.UP]) {
            let myKey = document.getElementById('currentMoveUp');
            // clear innerHTML
            myKey.innerHTML = "";
            myKey.innerHTML += keyboard.controls[MyGame.constants.direction.UP]
        }
        if (keyboard.controls[MyGame.constants.direction.DOWN]) {
            let myKey = document.getElementById('currentMoveDown');
            // clear innerHTML
            myKey.innerHTML = "";
            myKey.innerHTML += keyboard.controls[MyGame.constants.direction.DOWN]
        }
        if (keyboard.controls[MyGame.constants.direction.RIGHT]) {
            let myKey = document.getElementById('currentMoveRight');
            myKey.innerHTML = "";
            myKey.innerHTML += keyboard.controls[MyGame.constants.direction.RIGHT]
        }
        if (keyboard.controls[MyGame.constants.direction.LEFT]) {
            let myKey = document.getElementById('currentMoveLeft');
            myKey.innerHTML = "";
            myKey.innerHTML += keyboard.controls[MyGame.constants.direction.LEFT]
        }
    }
    function run() {
        render();
        if (keyboard.controls[MyGame.constants.direction.UP]) {
            let myKey = document.getElementById('currentMoveUp');
            myKey.addEventListener(
                'click', () => { changeControl(myKey, MyGame.constants.direction.UP) }
            )
        }
        if (keyboard.controls[MyGame.constants.direction.DOWN]) {
            let myKey = document.getElementById('currentMoveDown');
            myKey.addEventListener(
                'click', () => { changeControl(myKey, MyGame.constants.direction.DOWN) }
            )
        }
        if (keyboard.controls[MyGame.constants.direction.RIGHT]) {
            let myKey = document.getElementById('currentMoveRight');
            myKey.addEventListener(
                'click', () => { changeControl(myKey, MyGame.constants.direction.RIGHT) }
            )
        }
        if (keyboard.controls[MyGame.constants.direction.LEFT]) {
            let myKey = document.getElementById('currentMoveLeft');
            myKey.addEventListener(
                'click', () => { changeControl(myKey, MyGame.constants.direction.LEFT) }
            )
        }
        if (keyboard.controls[MyGame.constants.undo.UNDO]) {
            let myKey = document.getElementById('currentUndo');
            myKey.addEventListener(
                'click', () => { changeControl(myKey, MyGame.constants.undo.UNDO) }
            )
        }
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game, MyGame.systems.keyboardInput))