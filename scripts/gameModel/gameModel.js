MyGame.game.gameModel = (function(){
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
    /// TODO: don't hardcode this
    let mBoard = Board(30)
    console.log(mBoard)
    function update(elapsedTime){
        // do nothing for now
    }
    return {
        update: update
    }
}())