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
        let addList = {}
        if (mStack.length > 0) {
            let top = mStack.pop();
            for (let id in entities) {
                if (top[id]) {
                    for (let i = 0; i < top[id].length; i++) {
                        let change = top[id][i];
                        if (change.type === 'move') {
                            console.log(change)
                            let entityPosition = entities[id].components['board-position'];
                            board.cells[entityPosition.x][entityPosition.y].removeContent(entities[id]);
                            // let changePosition = change.entity.components['board-position'];
                            entityPosition.x = change.position.x;
                            entityPosition.y = change.position.y;
                            addEntityToBoard(entities[id], board)
                            // console.log
                        }
                        else if (change.type === 'add') {
                            deleteList[change.entity.id] = true;
                            addList[change.entity.id] = {position: {...change.entity.components['board-position']}, addType: change.nounType}
                        }
                        else if (change.type === 'delete') {
                            let mEnt = change.entity;
                            if (mEnt.components.noun) {
                                let entityPosition = mEnt.components['board-position'];
                                addList[mEnt.id] = {position: {...entityPosition}, addType: mEnt.components.noun.valueType};
                            }
                        }
                    }

                }
            }
        }
        for (let id in deleteList) {
            delete entities[id];
        }
        // if(Object.keys(addList).length > 0){
        //     console.log(addList);
        // }
        for (let id in addList){
            // console.log(addList[id]);
            // console.log(nounCommandPat);
            nounCommandPat[addList[id].addType](addList[id].position.x, addList[id].position.y, entities);
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
                else if (entity.components.undo.type === MyGame.constants.undo.RESET) {
                    reInitializeFunct();
                }
            }
        }
    }
    return {
        update: update
    };
}())