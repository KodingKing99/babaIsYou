MyGame.screens['levelsScreen'] = (function(game) {
    function initialize() {
        // 
        // put all the information about each level in its own list
        //
        let levelsTxt = MyGame.assets['levels-all'].split('\n');
        let levelNames = [];
        // levelsTxt = levelsTxt.split('\n')
        let levelIndex = 0;
        let levelList = [];
        for (let i = 0; i < levelsTxt.length; i++) {
            if (levelsTxt[i].match(/\d\d x \d\d/)) {
                levelList.pop();
                MyGame.levelInfo[levelIndex] = levelList;
                levelIndex ++;
                levelList = [];
                levelNames.push(levelsTxt[i-1]);
            }
            levelList.push(levelsTxt[i]);
        }

        let levels = document.getElementById("levels");        
        for (let l = 0; l < levelNames.length; l++) {
            let li = document.createElement("li");
            li.innerText = levelNames[l];
            li.className = "default";
            li.addEventListener(
                'click',
                function(){
                    MyGame.level = l+1;
                    game.showScreen('gamePlayScreen');
                }
            )
            levels.appendChild(li);
        }

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
