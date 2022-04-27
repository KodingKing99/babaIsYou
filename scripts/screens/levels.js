MyGame.screens['levelsScreen'] = (function(game) {
    function initialize() {
        let levelNames = parseLevelNames();
        createLevelButtons(levelNames);

        document.getElementById('levelsBackButton').addEventListener(
            'click',
            () => {game.showScreen('mainMenu')}
        )
    }

    // 
    // put all the information about each level in its own list
    //
    function parseLevelNames() {
        let levelNames = [];
        let levelsTxt = MyGame.assets['levels-all'].split('\n');
        let levelIndex = 0;
        let levelList = [];
        for (let i = 0; i < levelsTxt.length; i++) {
            if (levelsTxt[i].match(/\d\d x \d\d/) || i == levelsTxt.length - 1) {
                levelList.pop();
                MyGame.levelInfo[levelIndex] = levelList;
                levelIndex ++;
                levelList = [];
                levelNames.push(levelsTxt[i-1]);
            }
            levelList.push(levelsTxt[i]);
        }
        return levelNames;
    }

    //
    // create a button for each level
    //
    function createLevelButtons(levelNames) {
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
