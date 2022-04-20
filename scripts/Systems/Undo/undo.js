MyGame.systems.undo = (function () {
    let mStack = [];
    function addEntityToBoard(entity, board) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].addContent(entity);
        let boardCenterY = board.cells[entityPosition.x][entityPosition.y].center.y;
        let boardCenterX = board.cells[entityPosition.x][entityPosition.y].center.x;
        entity.components.position.y = boardCenterY;
        entity.components.position.x = boardCenterX;
    }
    function doUndo(entities, board, nounCommandPat) {
        let deleteList = {}
        if (mStack.length > 0) {
            let top = mStack.pop();
            for (let id in entities) {
                if (top[id]) {
                    if(top[id].type === 'move'){
                        let entityPosition = entities[id].components['board-position'];
                        board.cells[entityPosition.x][entityPosition.y].removeContent(entities[id]);
                        entityPosition.x = top[id].position.x;
                        entityPosition.y = top[id].position.y;
                        addEntityToBoard(entities[id], board)
                    }
                    else if(top[id].type === 'add'){
                        deleteList[top[id].entity.id] = true;
                    }
                    else if(top[id].type === 'delete'){
                        let mEnt = top[id].entity;
                        if(mEnt.components.noun){
                            let entityPosition = mEnt.components['board-position'];
                            nounCommandPat[mEnt.components.noun.valueType](entityPosition.x, entityPosition.y, entities); 
                        }
                    }
                }
            }
        }
        for(let id in deleteList){
            delete entities[id];
        }

    }
    function update(entities, elapsedTime, board, changed, reInitializeFunct, nounCommandPat) {
        // console.log(changeList);
        if (Object.keys(changed).length > 0) {
            mStack.push(changed);
            // console.log(mStack);
        }
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components.undo) {
                if (entity.components.undo.type === MyGame.constants.undo.UNDO) {
                    doUndo(entities, board, nounCommandPat);
                    entity.removeComponent(entity.components.undo)
                }
                else if (entity.components.undo.type === MyGame.constants.undo.RESET){
                    reInitializeFunct();
                }
            }
        }
    }
    return {
        update: update
    };
}())