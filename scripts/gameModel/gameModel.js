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
                levelCount = 0;
            }
            if (levelsTxt[i] === '\r' || levelsTxt === "") {
                continue;
            }
            else {
                for (let j = 0; j < levelsTxt[i].length; j++) {
                    console.log(levelCount);
                    if (levelCount >= 0) {
                        if (levelsTxt[i][j] === 'b') {
                            console.log(`I found baba at ${levelCount}, ${j}`)
                            addBaba(levelCount % 20, j, entities);
                        } else if (levelsTxt[i][j] === 'r') {
                            let rock = initializeRock(levelCount % 20, j);
                            entities[rock.id] = rock;
                        } else if (levelsTxt[i][j] === 'f') {
                            let flag = initializeFlag(levelCount % 20, j);
                            entities[flag.id] = flag;
                        } else if (levelsTxt[i][j] === 'w') {
                            let wall = initializeWall(levelCount % 20, j);
                            entities[wall.id] = wall;
                        } else if (levelsTxt[i][j] == 'l') {
                            let floor = initializeFloor(levelCount % 20, j);
                            entities[floor.id] = floor;
                        } else if (levelsTxt[i][j] == 'B') {
                            let wordBaba = initializeWordBaba(levelCount % 20, j);
                            entities[wordBaba.id] = wordBaba;
                        } else if (levelsTxt[i][j] == 'I') {
                            let wordIs = initializeWordIs(levelCount % 20, j);
                            entities[wordIs.id] = wordIs;
                        } else if (levelsTxt[i][j] == 'Y') {
                            let wordYou = initializeWordYou(levelCount % 20, j);
                            entities[wordYou.id] = wordYou;
                        }

                    }
                }
                levelCount++;
            }
        }
    }

    let GAME_WIDTH = MyGame.systems.render.graphics.width;
    let CELL_SIZE = GAME_WIDTH / GRID_SIZE;
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
    // Inititialize baba
    ///////////////////
    function initializeBaba(x, y) {
        let baba = MyGame.systems.entityFactory.createEntity();
        baba.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where baba is supposed to go on the board
        baba.addComponent(MyGame.components.BoardPosition({ x: x, y: y}))
        baba.addComponent(MyGame.components.Sprite({ assetKey: 'bunnyRight', animationTime: 150, spriteCount: 15, spritesToAnimate: 3 }))
        baba.addComponent(MyGame.components.Rotation({ rotation: 0 }));
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
        rock.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where rock is supposed to go on the board
        rock.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        rock.addComponent(MyGame.components.Sprite({ assetKey: 'rock', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        rock.addComponent(MyGame.components.Rotation({ rotation: 0 }));

        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        rock.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
            }
        ))
        return rock;
    }

    ///////////////////////////
    // Inititialize flag
    ///////////////////////////
    function initializeFlag(x, y) {
        let flag = MyGame.systems.entityFactory.createEntity();
        flag.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where flag is supposed to go on the board
        flag.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        flag.addComponent(MyGame.components.Sprite({ assetKey: 'flag', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        flag.addComponent(MyGame.components.Rotation({ rotation: 0 }));

        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        flag.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
            }
        ))
        return flag;
    }

    ///////////////////////////
    // Inititialize wall
    ///////////////////////////
    function initializeWall(x, y) {
        let wall = MyGame.systems.entityFactory.createEntity();
        wall.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where wall is supposed to go on the board
        wall.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wall.addComponent(MyGame.components.Sprite({ assetKey: 'wall', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wall.addComponent(MyGame.components.Rotation({ rotation: 0 }));

        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        wall.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
            }
        ))
        return wall;
    }

    ///////////////////////////
    // Inititialize floor
    ///////////////////////////
    function initializeFloor(x, y) {
        let floor = MyGame.systems.entityFactory.createEntity();
        floor.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where floor is supposed to go on the board
        floor.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        floor.addComponent(MyGame.components.Sprite({ assetKey: 'floor', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        floor.addComponent(MyGame.components.Rotation({ rotation: 0 }));

        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        floor.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
            }
        ))
        return floor;
    }

    ///////////////////////////
    // Inititialize wordBaba
    ///////////////////////////
    function initializeWordBaba(x, y) {
        let wordBaba = MyGame.systems.entityFactory.createEntity();
        wordBaba.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where wordBaba is supposed to go on the board
        wordBaba.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordBaba.addComponent(MyGame.components.Sprite({ assetKey: 'word-baba', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordBaba.addComponent(MyGame.components.Rotation({ rotation: 0 }));

        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        wordBaba.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
            }
        ))
        return wordBaba;
    }

    ///////////////////////////
    // Inititialize wordIs
    ///////////////////////////
    function initializeWordIs(x, y) {
        let wordIs = MyGame.systems.entityFactory.createEntity();
        wordIs.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where wordIs is supposed to go on the board
        wordIs.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordIs.addComponent(MyGame.components.Sprite({ assetKey: 'word-is', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordIs.addComponent(MyGame.components.Rotation({ rotation: 0 }));

        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        wordIs.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
            }
        ))
        return wordIs;
    }

    ///////////////////////////
    // Inititialize wordYou
    ///////////////////////////
    function initializeWordYou(x, y) {
        let wordYou = MyGame.systems.entityFactory.createEntity();
        wordYou.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }))
        // Set where wordYou is supposed to go on the board
        wordYou.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        wordYou.addComponent(MyGame.components.Sprite({ assetKey: 'word-you', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        wordYou.addComponent(MyGame.components.Rotation({ rotation: 0 }));

        //-------------------------------------------------------------
        // Initialize movable componenet 
        // Initially set to be stopped and facing down
        //-------------------------------------------------------------
        wordYou.addComponent(MyGame.components.Movable(
            {
                moveDirection: MyGame.constants.direction.STOPPED,
            }
        ))
        return wordYou;
    }

    function addBaba(x, y, entities){
        let baba = initializeBaba(x, y);
        entities[baba.id] = baba;
    }

    function initialize() {
        parseLevelsFile(entities);
        mBoard = Board(GRID_SIZE);

        // mBoard[baba.components[]]
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