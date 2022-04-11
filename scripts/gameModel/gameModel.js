MyGame.gameModel = function () {
    'use strict';
    let GRID_SIZE = 30;
    ///////// 
    // Setting game width to canvas width
    /////////
    function parseLevelsFile(entities) {
        let levelsTxt = MyGame.assets['levels-all'];
        console.log(levelsTxt);
        let s = ""
        s.split()
        levelsTxt = levelsTxt.split(/Level-\d/)
        console.log("level1 text after split")
        console.log(levelsTxt[MyGame.level]);
        levelsTxt = levelsTxt[MyGame.level].split('\n')
        console.log(levelsTxt);
        let levelCount;
        for (let i = 0; i < levelsTxt.length; i++) {
            if (levelsTxt[i].match(/\d\d x \d\d/)) {
                console.log(`Grid is ${levelsTxt[i]}`)
                GRID_SIZE = levelsTxt[i].split('x')[0];
                CELL_SIZE = GAME_WIDTH / GRID_SIZE;
                levelCount = 0;
            }
            else if (levelsTxt[i] === '\r' || levelsTxt === "") {
                continue;
            }
            else {
                for (let j = 0; j < levelsTxt[i].length; j++) {
                    console.log(levelCount);
                    if (levelCount >= 0) {
                        switch (levelsTxt[i][j]) {
                            case 'b':
                                // console.log(`I found baba at ${j}, ${levelCount}`)
                                addBaba(j, levelCount % 20, entities);
                                break;
                            case 'w':
                                // console.log(`I found wall at ${levelCount}, ${j}`)
                                addWall(j, levelCount % 20, entities);
                                break;
                            case 'r':
                                addRock(j, levelCount % 20, entities);
                                break;
                            case 'h':
                                addHedge(j, levelCount % 20, entities);
                                break;
                            case 'f':
                                let flag = initializeFlag(j, levelCount % 20);
                                entities[flag.id] = flag;
                                break;
                            case 'r':
                                let rock = initializeRock(j, levelCount % 20);
                                entities[rock.id] = rock;
                                break;
                            case 'l':
                                let floor = initializeFloor(j, levelCount % 20);
                                entities[floor.id] = floor;
                                break;
                            case 'B':
                                let wordBaba = initializeWordBaba(j, levelCount % 20);
                                entities[wordBaba.id] = wordBaba;
                                break;
                            case 'I':
                                let wordIs = initializeWordIs(j, levelCount % 20);
                                entities[wordIs.id] = wordIs;
                                break;
                            case 'Y':
                                let wordYou = initializeWordYou(j, levelCount % 20);
                                entities[wordYou.id] = wordYou;
                                break;
                            case 'F':
                                let wordFlag = initializeWordFlag(j, levelCount % 20);
                                entities[wordFlag.id] = wordFlag;
                                break;
                            case 'X':
                                let wordWin = initializeWordWin(j, levelCount % 20);
                                entities[wordWin.id] = wordWin;
                                break;
                            case 'R':
                                let wordRock = initializeWordRock(j, levelCount % 20);
                                entities[wordRock.id] = wordRock;
                                break;
                            case 'P':
                                let wordPush = initializeWordPush(j, levelCount % 20);
                                entities[wordPush.id] = wordPush;
                                break;
                            case 'W':
                                let wordWall = initializeWordWall(j, levelCount % 20);
                                entities[wordWall.id] = wordWall;
                                break;
                            case 'S':
                                let wordStop = initializeWordStop(j, levelCount % 20);
                                entities[wordStop.id] = wordStop;
                                break;
                        }
                    }
                }
                levelCount++;
            }
        }
    }

    let GAME_WIDTH = MyGame.systems.render.graphics.width;
    let CELL_SIZE;
    let entities = {};
    let mBoard;
    ////////////////
    // Game Board Code
    ////////////////
    function Cell(spec) {
        let contents = []
        function addContent(content) {
            contents.push(content);
        }
        function removeContent(content) {
            let index = contents.indexOf(content);
            if (index != -1) {
                // console.log(`removing entity at index ${index}`)
                contents.splice(index, 1);
            }
        }
        return {
            get x() { return spec.x },
            get y() { return spec.y },
            get contents() { return contents },
            get center() { return spec.center; },
            addContent: addContent,
            removeContent: removeContent
        }
    }
    function getCenter(i, j, width, height) {
        let x = i * CELL_SIZE;
        let y = j * CELL_SIZE;
        return { x: (x + (width / 2)), y: (y + (height / 2)) };
    }
    function Board(numCells) {
        // let that = {};
        let mArray = [];
        for (let i = 0; i < numCells; i++) {
            mArray.push([])
            for (let j = 0; j < numCells; j++) {
                let center = getCenter(i, j, CELL_SIZE, CELL_SIZE);
                mArray[i].push(Cell({ x: i, y: j, center: center }));
            }
        }
        return {
            get cells() { return mArray },
            get height() { return numCells },
            get width() { return numCells },
        }

    }
    function addThingsToBoard(board, entities) {
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components['board-position']) {
                let component = entity.components['board-position'];
                // Set baba's position to be the board cells position;
                entity.addComponent(MyGame.components.Position(board.cells[component.x][component.y].center));
                board.cells[component.x][component.y].addContent(entity);
                // console.log(board[component.x][component.y])

            }
        }
    }
    ///////////////////
    // Inititialize wall 
    ///////////////////
    function initializeWall(x, y) {
        let wall = MyGame.systems.entityFactory.createEntity();
        wall.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wall is supposed to go on the board
        wall.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wall.addComponent(MyGame.components.Sprite({ assetKey: 'wall', animationTime: 200, spriteCount: 3, spritesToAnimate: 3 }))
        wall.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        console.log('adding wall as noun')
        wall.addComponent(MyGame.components.Noun({ key: 'WALL' }))
        // console.log(wall.components.noun.valueType)
        // wall.addComponent(MyGame.components.Properties({ keys: ['PUSH'] }))
        // // console.log(wall.components.properties.toString())
        // console.log(wall.components.properties.toString());
        return wall;
    }

    ///////////////////
    // Inititialize baba
    ///////////////////
    function initializeBaba(x, y) {
        let baba = MyGame.systems.entityFactory.createEntity();
        baba.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where baba is supposed to go on the board
        baba.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        baba.addComponent(MyGame.components.Sprite({ assetKey: 'bunnyRight', animationTime: 150, spriteCount: 15, spritesToAnimate: 3 }))
        baba.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        baba.addComponent(MyGame.components.Noun({ key: 'BABA' }))
        //-------------------------------------------------------------
        // Initialize the input
        // TODO: parse the keys from local storage for customizing the controls.
        //-------------------------------------------------------------
        baba.addComponent(MyGame.components.KeyboardControlled({
            keys: {
                'ArrowUp': MyGame.constants.direction.UP,
                'ArrowDown': MyGame.constants.direction.DOWN,
                'ArrowLeft': MyGame.constants.direction.LEFT,
                'ArrowRight': MyGame.constants.direction.RIGHT,
            },
        }))
        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        baba.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
                facing: MyGame.constants.direction.RIGHT,
            }
        ))
        return baba;
    }
    ///////////////////////////
    // Inititialize rock
    ///////////////////////////
    function initializeRock(x, y) {
        let rock = MyGame.systems.entityFactory.createEntity();
        rock.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        console.log("game width: ", GAME_WIDTH, "grid size: ", GRID_SIZE, "x: ", GAME_WIDTH / GRID_SIZE);
        // Set where rock is supposed to go on the board
        rock.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        rock.addComponent(MyGame.components.Sprite({ assetKey: 'rock', animationTime: 200, spriteCount: 3, spritesToAnimate: 3 }))
        rock.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        rock.addComponent(MyGame.components.Noun({ key: 'ROCK' }))
        // console.log(wall.components.noun.valueType)
        rock.addComponent(MyGame.components.Properties({ keys: ['PUSH'] }))
        return rock;
    }

    ///////////////////////////
    // Inititialize flag
    ///////////////////////////
    function initializeFlag(x, y) {
        let flag = MyGame.systems.entityFactory.createEntity();
        flag.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where flag is supposed to go on the board
        flag.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        flag.addComponent(MyGame.components.Sprite({ assetKey: 'flag', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        flag.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        flag.addComponent(MyGame.components.Noun({ key: 'FLAG' }))
        return flag;
    }


    ///////////////////////////
    // Inititialize floor
    ///////////////////////////
    function initializeFloor(x, y) {
        let floor = MyGame.systems.entityFactory.createEntity();
        floor.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where floor is supposed to go on the board
        floor.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        floor.addComponent(MyGame.components.Sprite({ assetKey: 'floor', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        floor.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return floor;
    }

    ///////////////////////////
    // Inititialize wordBaba
    ///////////////////////////
    function initializeWordBaba(x, y) {
        let wordBaba = MyGame.systems.entityFactory.createEntity();
        wordBaba.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wordBaba is supposed to go on the board
        wordBaba.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordBaba.addComponent(MyGame.components.Sprite({ assetKey: 'word-baba', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordBaba.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return wordBaba;
    }

    ///////////////////////////
    // Inititialize wordIs
    ///////////////////////////
    function initializeWordIs(x, y) {
        let wordIs = MyGame.systems.entityFactory.createEntity();
        wordIs.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wordIs is supposed to go on the board
        wordIs.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordIs.addComponent(MyGame.components.Sprite({ assetKey: 'word-is', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordIs.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return wordIs;
    }

    ///////////////////////////
    // Inititialize wordYou
    ///////////////////////////
    function initializeWordYou(x, y) {
        let wordYou = MyGame.systems.entityFactory.createEntity();
        wordYou.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wordYou is supposed to go on the board
        wordYou.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordYou.addComponent(MyGame.components.Sprite({ assetKey: 'word-you', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordYou.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return wordYou;
    }

    ///////////////////////////
    // Inititialize wordRock
    ///////////////////////////
    function initializeWordRock(x, y) {
        let wordRock = MyGame.systems.entityFactory.createEntity();
        wordRock.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wordRock is supposed to go on the board
        wordRock.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordRock.addComponent(MyGame.components.Sprite({ assetKey: 'word-rock', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordRock.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return wordRock;
    }

    ///////////////////////////
    // Inititialize wordPush
    ///////////////////////////
    function initializeWordPush(x, y) {
        let wordPush = MyGame.systems.entityFactory.createEntity();
        wordPush.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wordPush is supposed to go on the board
        wordPush.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordPush.addComponent(MyGame.components.Sprite({ assetKey: 'word-push', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordPush.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return wordPush;
    }

    ///////////////////////////
    // Inititialize wordFlag
    ///////////////////////////
    function initializeWordFlag(x, y) {
        let wordFlag = MyGame.systems.entityFactory.createEntity();
        wordFlag.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wordFlag is supposed to go on the board
        wordFlag.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordFlag.addComponent(MyGame.components.Sprite({ assetKey: 'word-flag', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordFlag.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return wordFlag;
    }

    ///////////////////////////
    // Inititialize wordWin
    ///////////////////////////
    function initializeWordWin(x, y) {
        let wordWin = MyGame.systems.entityFactory.createEntity();
        wordWin.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wordWin is supposed to go on the board
        wordWin.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordWin.addComponent(MyGame.components.Sprite({ assetKey: 'word-win', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordWin.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return wordWin;
    }

    ///////////////////////////
    // Inititialize wordWall
    ///////////////////////////
    function initializeWordWall(x, y) {
        let wordWall = MyGame.systems.entityFactory.createEntity();
        wordWall.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wordWall is supposed to go on the board
        wordWall.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordWall.addComponent(MyGame.components.Sprite({ assetKey: 'word-wall', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordWall.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return wordWall;
    }

    ///////////////////////////
    // Inititialize wordStop
    ///////////////////////////
    function initializeWordStop(x, y) {
        let wordStop = MyGame.systems.entityFactory.createEntity();
        wordStop.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where wordStop is supposed to go on the board
        wordStop.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordStop.addComponent(MyGame.components.Sprite({ assetKey: 'word-stop', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordStop.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        return wordStop;
    }

    // Inititialize Hedge 
    ///////////////////////////
    function initializeHedge(x, y) {
        let mEntity = MyGame.systems.entityFactory.createEntity();
        mEntity.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where mEntity is supposed to go on the board
        mEntity.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        mEntity.addComponent(MyGame.components.Sprite({ assetKey: 'hedge', animationTime: 200, spriteCount: 3, spritesToAnimate: 3 }))
        mEntity.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        mEntity.addComponent(MyGame.components.Noun({ key: 'HEDGE' }))
        console.log(`hedge at ${x}, ${y}`)
        // console.log(wall.components.noun.valueType)
        // mEntity.addComponent(MyGame.components.Properties({ keys: ['PUSH'] }))
        return mEntity;
    }
    //------------------------------------------------------------------
    //  for calling the correct initialize function
    //------------------------------------------------------------------
    function addWall(x, y, entities) {
        let wall = initializeWall(x, y);
        entities[wall.id] = wall;
    }
    function addRock(x, y, entities) {
        let rock = initializeRock(x, y);
        entities[rock.id] = rock;
    }
    function addBaba(x, y, entities) {
        let baba = initializeBaba(x, y);
        entities[baba.id] = baba;
    }
    function addHedge(x, y, entities) {
        let mEntity = initializeHedge(x, y);
        entities[mEntity.id] = mEntity;
    }
    function initialize() {
        parseLevelsFile(entities);
        mBoard = Board(GRID_SIZE);
        addThingsToBoard(mBoard, entities);
        console.log(mBoard)

    }
    function update(elapsedTime) {
        MyGame.systems.render.renderAnimatedSprite.update(elapsedTime, entities);
        MyGame.systems.keyboardInput.update(elapsedTime, entities);
        MyGame.systems.movement.update(elapsedTime, entities, mBoard);
    }
    initialize();
    return {
        update: update
    }
}