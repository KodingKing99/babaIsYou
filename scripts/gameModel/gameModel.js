MyGame.game.gameModel = (function(){
    'use strict';
    let GRID_SIZE = 30;
    let GAME_WIDTH = function(){}
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
            addContents: addContents,
            removeContent: removeContent
        }
    }
    function Board(numCells){
        let mArray = [];
        for(let i = 0; i < numCells; i++){
            mArray.push([])
            for(let j = 0; j < numCells; j++){
                mArray[i].push(Cell({x: i, y: j}))
            }
        }
        return mArray;
    }
    let mBoard = Board(GRID_SIZE)
    console.log(mBoard)

    ///////////////////
    // Inititialize baba
    ///////////////////
    function initializeBaba(){

    }
    function update(elapsedTime){
        // do nothing for now
    }
    return {
        update: update
    }
}())