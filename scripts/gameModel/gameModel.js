MyGame.gameModel = function(){
    'use strict';
    let GRID_SIZE = 30;
    ///////// 
    // Setting game width to canvas width
    /////////
    let GAME_WIDTH = MyGame.systems.render.graphics.width;
    let CELL_SIZE = GAME_WIDTH / GRID_SIZE;
    let entities = {};
    let mBoard;
    ////////////////
    // Game Board Code
    ////////////////
    function Cell(spec){
        let contents = []
        function addContents(content){
            contents.push(content)
        }
        function removeContent(content){
            let index = contents.indexOf(content);
            if(index != -1){
                contents.splice(index, 1);
            }
        }
        return{
            get x(){return spec.x},
            get y(){return spec.y},
            get contents(){return contents},
            get center(){return spec.center;},
            addContents: addContents,
            removeContent: removeContent
        }
    }
    function getCenter(i, j, width, height){
        let x = i * CELL_SIZE;
        let y = j * CELL_SIZE;
        return {x: (x + (width / 2)), y: (y + (height / 2))};
    }
    function Board(numCells){
        let mArray = [];
        for(let i = 0; i < numCells; i++){
            mArray.push([])
            for(let j = 0; j < numCells; j++){
                let center = getCenter(i, j, CELL_SIZE, CELL_SIZE);
                mArray[i].push(Cell({x: i, y: j, center: center}))
            }
        }
        return mArray;
    }
    function addThingsToBoard(board, entities){
        for(let key in entities){
            let entity = entities[key];
            for(let componentKey in entity.components){
                let component = entity.components[componentKey];
                if(component.name === 'position'){
                    board[component.x][component.y].addContents(entity);
                    console.log(board[component.x][component.y])
                }
            }
        }
    }
    ///////////////////
    // Inititialize baba
    ///////////////////
    function initializeBaba(){
        let baba = MyGame.systems.entityFactory.createEntity();
        baba.addComponent(MyGame.components.Size({x: GAME_WIDTH / GRID_SIZE, y: GAME_WIDTH / GRID_SIZE}))
        baba.addComponent(MyGame.components.Position({x: GRID_SIZE - 10, y: GRID_SIZE - 10}))
        baba.addComponent(MyGame.components.Sprite({assetKey: 'bunnyDown', animationTimes: [25, 25, 25, 25, 25, 25]}))
        baba.addComponent(MyGame.components.Rotation({rotation: 0}));
        return baba;
    }
    function initialize(){
        let baba = initializeBaba();
        entities[baba.id] = baba;
        mBoard = Board(GRID_SIZE);
        // mBoard[baba.components[]]
        addThingsToBoard(mBoard, entities);
        console.log(mBoard)

    }
    function update(elapsedTime){
        MyGame.systems.render.renderAnimatedSprite.update(elapsedTime, entities);
    }
    initialize();
    return {
        update: update
    }
}