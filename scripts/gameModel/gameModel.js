MyGame.gameModel = function () {
    'use strict';
    let GRID_SIZE = 30;
    ///////// 
    // Setting game width to canvas width
    /////////
    function parseLevelsFile(entities) {
        let levelsTxt = MyGame.assets['levels-all'];
        // console.log(levelsTxt);
        levelsTxt = levelsTxt.split(/Level-\d/)

        levelsTxt = levelsTxt[MyGame.level].split('\n')
        let levelCount;
        for (let i = 0; i < levelsTxt.length; i++) {
            if (levelsTxt[i].match(/\d\d x \d\d/)) {
                GRID_SIZE = levelsTxt[i].split('x')[0];
                CELL_SIZE = GAME_WIDTH / GRID_SIZE;
                levelCount = 0;
            }
            else if (levelsTxt[i] === '\r' || levelsTxt === "") {
                continue;
            }
            else {
                for (let j = 0; j < levelsTxt[i].length; j++) {
                    // console.log(levelCount);
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
                            case 'W':
                                addWord_Wall(j, levelCount % 20, entities);
                                break;
                            case 'S':
                                addWord_Stop(j, levelCount % 20, entities);
                                break;
                            case 'I':
                                addWord_Is(j, levelCount % 20, entities)
                                break;
                            case 'P':
                                addWord_Push(j, levelCount % 20, entities)
                                break;
                            case 'f':
                                addFlag(j, levelCount % 20, entities)
                                break;
                            case 'l':
                                addFloor(j, levelCount % 20, entities)
                                break;
                            case 'B':
                                addWord_Baba(j, levelCount % 20, entities);
                                break;
                            case 'Y':
                                addWord_You(j, levelCount % 20, entities);
                                break;
                            case 'F':
                                addWord_Flag(j, levelCount % 20, entities);
                                break;
                            case 'X':
                                addWord_Win(j, levelCount % 20, entities);
                                break;
                            case 'R':
                                addWord_Rock(j, levelCount % 20, entities);
                                break;
                            case 'V':
                                addWord_Lava(j, levelCount % 20, entities);
                                break;
                            case 'A':
                                addWord_Water(j, levelCount % 20, entities);
                                break;
                            case 'N':
                                addWord_Sink(j, levelCount % 20, entities);
                                break;
                            case 'K':
                                addWord_Kill(j, levelCount % 20, entities);
                                break;
                            case 'v':
                                addLava(j, levelCount % 20, entities);
                                break;
                            case 'a':
                                addWater(j, levelCount % 20, entities);
                                break;
                            case 'g':
                                addGrass(j, levelCount % 20, entities);
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
                // console.log(contents[index]);
                // console.log(`removing entity at index ${index}`)
                contents.splice(index, 1);
            }
        }
        function has(entity) {
            let index = contents.indexOf(entity);
            return index === -1 ? false : true
        }
        return {
            get x() { return spec.x },
            get y() { return spec.y },
            get contents() { return contents },
            get center() { return { ...spec.center }; },
            has: has,
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
    function addThingsToBoard(board, entities, log=false) {
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components['board-position']) {
                let component = entity.components['board-position'];
                // Set baba's position to be the board cells position;
                // console.log(component)
                // debugger;

                if(!entity.components.position){
                    if(log){
                        console.log(component);
                        console.log(entity)
                        console.log(key);
                        // consol
                    }
                    entity.addComponent(MyGame.components.Position({...board.cells[component.x][component.y].center}));
                    if (!board.cells[component.x][component.y].has(entity)) {
                        board.cells[component.x][component.y].addContent(entity);
                    }
                }

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
        wall.addComponent(MyGame.components.Noun({ key: 'WALL' }))
        // wall.addComponent(MyGame.components.Properties({ keys: ['PUSH'] }))
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
        return baba;
    }
    ///////////////////////////
    // Inititialize rock
    ///////////////////////////
    function initializeRock(x, y) {
        let rock = MyGame.systems.entityFactory.createEntity();
        rock.addComponent(MyGame.components.Size({ x: (GAME_WIDTH / GRID_SIZE), y: (GAME_WIDTH / GRID_SIZE) }))
        // Set where rock is supposed to go on the board
        rock.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        rock.addComponent(MyGame.components.Sprite({ assetKey: 'rock', animationTime: 200, spriteCount: 3, spritesToAnimate: 3 }))
        rock.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        rock.addComponent(MyGame.components.Noun({ key: 'ROCK' }))
        // console.log(wall.components.noun.valueType)
        // rock.addComponent(MyGame.components.Properties({ keys: ['PUSH'] }))
        return rock;
    }

    ///////////////////////////
    // Inititialize flag
    ///////////////////////////
    function initializeFlag(x, y) {
        let flag = initializeEntityAtXY(x, y);
        flag.addComponent(MyGame.components.Sprite({ assetKey: 'flag', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        flag.addComponent(MyGame.components.Noun({ key: 'FLAG' }))
        // console.log(flag.components.noun)
        return flag;
    }


    ///////////////////////////
    // Inititialize floor
    ///////////////////////////
    function initializeFloor(x, y) {
        let floor = initializeEntityAtXY(x, y);
        floor.addComponent(MyGame.components.Sprite({ assetKey: 'floor', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }));
        return floor;
    }
    function initializeLava(x, y) {
        let lava = initializeEntityAtXY(x, y);
        lava.addComponent(MyGame.components.Sprite({ assetKey: 'lava', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        return lava;
    }
    function initializeWater(x, y) {
        let water = initializeEntityAtXY(x, y);
        water.addComponent(MyGame.components.Sprite({ assetKey: 'water', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        return water;
    }
    function initializeGrass(x, y) {
        let grass = initializeEntityAtXY(x, y);
        grass.addComponent(MyGame.components.Sprite({ assetKey: 'grass', animationTime: 150, spriteCount: 3, spritesToAnimate: 3 }))
        return grass;
    }

    ///////////////////////////
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
        // console.log(wall.components.noun.valueType)
        // mEntity.addComponent(MyGame.components.Properties({ keys: ['PUSH'] }))
        return mEntity;
    }
    function initializeEntityAtXY(x, y) {
        let mEntity = MyGame.systems.entityFactory.createEntity();
        mEntity.addComponent(MyGame.components.Size({ x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE }));
        mEntity.addComponent(MyGame.components.Rotation({ rotation: 0 }));
        // Set where mEntity is supposed to go on the board
        mEntity.addComponent(MyGame.components.BoardPosition({ x: x, y: y }))
        return mEntity;
    }
    ///////////////////////////
    // Inititialize Text  
    ///////////////////////////
    function initializeText(x, y, wordType, assetKey) {
        let mEntity = initializeEntityAtXY(x, y);
        mEntity.addComponent(MyGame.components.Sprite({ assetKey: assetKey, animationTime: 200, spriteCount: 3, spritesToAnimate: 3 }))
        mEntity.addComponent(MyGame.components.Text({ key: wordType }))
        mEntity.addComponent(MyGame.components.Properties({ keys: ['PUSH'] }))
        // console.log(mEntity);
        return mEntity;
    }

    //////////////////////////////
    // Initialize particle
    //////////////////////////////
    // function initializeParticle(x, y, assetKey) {
    //     let particle = MyGame.systems.entityFactory.createEntity();
    //     particle.addComponent(MyGame.components.Size({ x: 30, y: 30 }));
    //     // Set where particle is supposed to go on the board
    //     particle.addComponent(MyGame.components.BoardPosition({ x: x, y: y }));
    //     particle.addComponent(MyGame.components.Sprite({ assetKey: assetKey, animationTime: 200, spriteCount: 1, spritesToAnimate: 1 }));
    //     particle.addComponent(MyGame.components.Properties({ keys: ['PARTICLE'] }));
    //     return particle;
    // }
    function initializeParticleCall(x, y, type) {

        // console.log("adding new particle");
        let particle = initializeEntityAtXY(x, y);
        particle.addComponent(MyGame.components.ParticleEffect({ key: type }))
        // console.log(particle);
        return particle;
    }

    function addUndoKeybEntity(entities) {
        let mEntity = MyGame.systems.entityFactory.createEntity();
        mEntity.addComponent(MyGame.components.UndoKeyboardControlled({
            keys: {
                'z': MyGame.constants.undo.UNDO,
                'r': MyGame.constants.undo.RESET,
            }
        }));
        entities[mEntity.id] = mEntity;
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
    function addFlag(x, y, entities) {
        let mEntity = initializeFlag(x, y);
        entities[mEntity.id] = mEntity;
    }
    function addFloor(x, y, entities) {
        let mEntity = initializeFloor(x, y);
        entities[mEntity.id] = mEntity;
    }
    function addLava(x, y, entities) {
        let mEntity = initializeLava(x, y);
        entities[mEntity.id] = mEntity;
    }
    function addWater(x, y, entities) {
        let mEntity = initializeWater(x, y);
        entities[mEntity.id] = mEntity;
    }
    function addGrass(x, y, entities) {
        let mEntity = initializeGrass(x, y);
        entities[mEntity.id] = mEntity;
    }
    let nounCommandPat = {};
    nounCommandPat['Wall'] = addWall;
    nounCommandPat['Rock'] = addRock;
    nounCommandPat['Hedge'] = addHedge;
    nounCommandPat['Baba'] = addBaba;
    nounCommandPat['Flag'] = addFlag;
    nounCommandPat['Lava'] = addLava;
    nounCommandPat['Water'] = addWater;
    nounCommandPat['Grass'] = addGrass;
    nounCommandPat['Floor'] = addFloor;
    nounCommandPat['Add'] = addThingsToBoard;
    function addWord_Wall(x, y, entities) {
        let mEntity = initializeText(x, y, 'WALL', 'word-wall');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Stop(x, y, entities) {
        let mEntity = initializeText(x, y, 'STOP', 'word-stop');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Is(x, y, entities) {
        let mEntity = initializeText(x, y, 'IS', 'word-is');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Push(x, y, entities) {
        let mEntity = initializeText(x, y, 'PUSH', 'word-push');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Flag(x, y, entities) {
        let mEntity = initializeText(x, y, 'FLAG', 'word-flag');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Baba(x, y, entities) {
        let mEntity = initializeText(x, y, 'BABA', 'word-baba');
        entities[mEntity.id] = mEntity;
    }
    function addWord_You(x, y, entities) {
        let mEntity = initializeText(x, y, 'YOU', 'word-you');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Win(x, y, entities) {
        let mEntity = initializeText(x, y, 'WIN', 'word-win');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Rock(x, y, entities) {
        let mEntity = initializeText(x, y, 'ROCK', 'word-rock');
        entities[mEntity.id] = mEntity;
    }

    function addWord_Lava(x, y, entities) {
        let mEntity = initializeText(x, y, 'LAVA', 'word-lava');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Water(x, y, entities) {
        let mEntity = initializeText(x, y, 'WATER', 'word-water');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Sink(x, y, entities) {
        let mEntity = initializeText(x, y, 'SINK', 'word-sink');
        entities[mEntity.id] = mEntity;
    }
    function addWord_Kill(x, y, entities) {
        let mEntity = initializeText(x, y, 'KILL', 'word-kill');
        entities[mEntity.id] = mEntity;
    }
    function addParticleCall(x, y, entities, type) {
        // console.log("adding particle")
        let mEntity = initializeParticleCall(x, y, type);
        entities[mEntity.id] = mEntity;
    }
    function initialize() {
        parseLevelsFile(entities);
        mBoard = Board(GRID_SIZE);
        addThingsToBoard(mBoard, entities);
        addUndoKeybEntity(entities);
    }
    function reInitialize(){
        entities = {};
        parseLevelsFile(entities);
        mBoard = Board(GRID_SIZE);
        addThingsToBoard(mBoard, entities);
        addUndoKeybEntity(entities);
    }
    function makeParticleCalls(calls, entities) {
        for (let i = 0; i < calls.length; i++) {
            let call = calls[i];
            let x = call.position.x;
            let y = call.position.y;
            addParticleCall(x, y, entities, call.effectCall);
        }
        addThingsToBoard(mBoard, entities);
    }
    // let hasWon = false;
    MyGame.hasWon = false;
    function update(elapsedTime) {
        let particleCalls = [];
        let changed = {};
        MyGame.systems.rules.update(elapsedTime, entities, mBoard, particleCalls, nounCommandPat, changed);
        MyGame.systems.keyboardInput.update(elapsedTime, entities);
        MyGame.systems.movement.update(elapsedTime, entities, mBoard, particleCalls, changed);
        MyGame.systems.undo.update(entities, elapsedTime, mBoard, changed, reInitialize, nounCommandPat);
        MyGame.systems.render.renderAnimatedSprite.update(elapsedTime, entities);
        makeParticleCalls(particleCalls, entities);
        MyGame.systems.render.particles.update(entities, elapsedTime);
    }
    initialize();
    return {
        update: update
    }
}