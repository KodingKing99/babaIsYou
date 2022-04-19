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
    function doUndo(entities, board) {
        if (mStack.length > 0) {
            let top = mStack.pop();
            for (let id in entities) {
                if (top[id]) {
                    let entityPosition = entities[id].components['board-position'];
                    board.cells[entityPosition.x][entityPosition.y].removeContent(entities[id]);
                    entityPosition.x = top[id].x;
                    entityPosition.y = top[id].y;
                    addEntityToBoard(entities[id], board)
                }
            }
        }

    }
    function update(entities, elapsedTime, board, changed) {
        // console.log(changeList);
        if (Object.keys(changed).length > 0) {
            mStack.push(changed);
            // console.log(mStack);
        }
        for (let id in entities) {
            let entity = entities[id];
            if (entity.components.undo) {
                if (entity.components.undo.type === MyGame.constants.undo.UNDO) {
                    doUndo(entities, board);
                    entity.removeComponent(entity.components.undo)
                }
            }
        }
    }
    return {
        update: update
    };
}())