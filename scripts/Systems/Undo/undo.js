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
            for (let id in top) {
                for (let i = 0; i < top[id].length; i++) {
                    let change = top[id][i];
                    // console.log(top[id]);
                    if (change.type === 'add') {
                        // console.log(top[id]);
                        deleteList[change.entity.id] = true;
                        addList[change.entity.id] = { position: { ...change.entity.components['board-position'] }, addType: change.nounType }
                    }
                    else if (change.type === 'delete') {
                        // console.log("undoing delete");
                        let mEnt = change.entity;
                        if (mEnt.components.noun) {
                            // console.log("undoing delete for")
                            // console.log(mEnt);
                            let entityPosition = mEnt.components['board-position'];
                            addList[mEnt.id] = { position: { ...entityPosition }, addType: mEnt.components.noun.valueType, entity: {...mEnt} };
                        }
                    }
                   
            }
            for (let id in deleteList) {
                delete entities[id];
            }
            // if(Object.keys(addList).length > 0){
            //     console.log(addList);
            // }
            for (let id in addList) {
                /// for when things that can move get deleted.
                if(addList[id].entity && addList[id].entity.components.properties && //addList[id].entity.components.movable){ 
                    (addList[id].entity.components.properties.is('YOU') || addList[id].entity.components.properties.is('PUSH'))){
                    entities[id] = addList[id].entity;
                }
                else{
                    nounCommandPat[addList[id].addType](addList[id].position.x, addList[id].position.y, entities)
                }
            }
            for (let id in top) {
                for (let i = 0; i < top[id].length; i++) {
                    let change = top[id][i];
                    // console.log(change);
                    if (change.type === 'move') {
                        if (entities[id]) {
                            let entityPosition = entities[id].components['board-position'];
                            board.cells[entityPosition.x][entityPosition.y].removeContent(entities[id]);
                            entityPosition.x = change.position.x;
                            entityPosition.y = change.position.y;
                            addEntityToBoard(entities[id], board)
                        }
                        // else if (addList[id]){
                        //     // mStack.push({type: 'move', position: {ch}})
                        // }
                    }
                }
                }
            }
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