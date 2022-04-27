MyGame.systems['movement'] = (function () {
    'use strict';
    let canMove = false;
    let moveTime = 750;
    function addEntityToBoard(entity, board) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].addContent(entity);
        let boardCenterY = board.cells[entityPosition.x][entityPosition.y].center.y;
        let boardCenterX = board.cells[entityPosition.x][entityPosition.y].center.x;
        entity.components.position.y = boardCenterY;
        entity.components.position.x = boardCenterX;
    }
    function pushUp(entityPosition, board, callback, particleRequests, updateList, toDelete) {
        // console.log(`cell contents at ${board.cells[entityPosition.x][entityPosition.y].x}, ${board.cells[entityPosition.x][entityPosition.y].y}`)
        // console.log(board.cells[entityPosition.x][entityPosition.y].contents)
        for (let index in board.cells[entityPosition.x][entityPosition.y].contents) {
            let mEntity = board.cells[entityPosition.x][entityPosition.y].contents[index];
            if (mEntity.components.properties) {
                if (mEntity.components.properties.is('PUSH')) {
                    callback(mEntity, board, particleRequests, updateList, toDelete);
                }
            }
        }
    }
    function checkForPreMoveEvents(entity, particleRequests, contents) {
        if (entity.components['noun']) {
            if (entity.components.noun.valueType === 'Baba') {
                let mpos = { ...entity.components['board-position'] };
                particleRequests.push({ effectCall: 'BABAWALK', position: { x: mpos.x, y: mpos.y } });
            }
        }
    }
    function checkForProperty(contents, property, log=false) {
        let found = false;
        for (let i = 0; i < contents.length; i++) {
            if (contents[i].components.properties) {
                if (contents[i].components.properties.is(property)) {
                    found = true;
                }
            }
        }
        if(log){
            // console.log(contents);
        }
        return found;
    }
    function getIndexWithProperty(contents, property) {
        for (let i = 0; i < contents.length; i++) {
            if (contents[i].components.properties) {
                if (contents[i].components.properties.is(property)) {
                    return i;
                }
            }
        }
        return -1;
    }
    function checkForWins(position, board) {
        let hasWon = false;
        let contents = board.cells[position.x][position.y].contents;
        // console.log(contents);
        for (let i = 0; i < contents.length; i++) {
            // console.log(contents[i])
            if (contents[i].components.properties) {
                if (contents[i].components.properties.is('WIN')) {
                    hasWon = true;
                }
            }
        }
        return hasWon;
    }
    function checkSink(entity, particleRequests, updateList, toDelete, board){
        // sink events
        let pos = entity.components['board-position'];
        let contents = board.cells[pos.x][pos.y].contents
        // let foundWin = checkForWins(entity.components['board-position'], board)
        let foundSink = checkForProperty(contents, 'SINK');
        if (foundSink) {
            // console.log(contents);
            toDelete[entity.id] = true;
            checkUndo(entity, updateList, 'delete');
            let index = getIndexWithProperty(contents, 'SINK');
            let mEntPos = entity.components['board-position']; 
            board.cells[mEntPos.x][mEntPos.y].removeContent(entity)
            if (index != -1) {
                toDelete[contents[index].id] = true;
                checkUndo(contents[index], updateList, 'delete')
                mEntPos = contents[index].components['board-position'];
                board.cells[mEntPos.x][mEntPos.y].removeContent(contents[index])
            }
            particleRequests.push({ effectCall: 'DEATH', position: { x: mEntPos.x, y: mEntPos.y } });
        }
    }
    function checkKill(entity, particleRequests, updateList, toDelete, board){
        // sink events
        let pos = entity.components['board-position'];
        let contents = board.cells[pos.x][pos.y].contents
        // let foundWin = checkForWins(entity.components['board-position'], board)
        let foundKill = checkForProperty(contents, 'KILL');
        if (foundKill) {
            toDelete[entity.id] = true;
            checkUndo(entity, updateList, 'delete');
            let mEntPos = entity.components['board-position']; 
            board.cells[mEntPos.x][mEntPos.y].removeContent(entity);
            particleRequests.push({ effectCall: 'DEATH', position: { x: mEntPos.x, y: mEntPos.y } });
            // let index = getIndexWithProperty(contents, 'SINK');
            // if (index != -1) {
            //     toDelete[contents[index].id] = true;
            //     checkUndo(contents[index], updateList, 'delete')
            //     mEntPos = contents[index].components['board-position'];
            //     board.cells[mEntPos.x][mEntPos.y].removeContent(contents[index])
            // }
            // console.log(board.cells[mEntPos.x][mEntPos.y].contents);
            // console.log(updateList);
        }
    }
    function checkForPostMoveEvents(entity, particleRequests, board, toDelete, updateList) {

        if (entity.components.noun) {
            if (entity.components.properties) {
                if (entity.components.properties.is('YOU')) {
                    let pos = entity.components['board-position'];
                    let contents = board.cells[pos.x][pos.y].contents;
                    // let foundWin = checkForWins(entity.components['board-position'], board)
                    let foundWin = checkForProperty(contents, 'WIN');
                    if (foundWin) {
                        particleRequests.push({ effectCall: 'WON', position: { x: 5, y: 10 } });
                        particleRequests.push({ effectCall: 'WON', position: { x: 10, y: 5 } });
                        particleRequests.push({ effectCall: 'WON', position: { x: 15, y: 15 } });
                        particleRequests.push({ effectCall: 'WON', position: { x: 3, y: 5 } });
                        MyGame.hasWon = true;
                    }
                }
                checkSink(entity, particleRequests, updateList, toDelete, board);
                checkKill(entity, particleRequests, updateList, toDelete, board);
            }
        }
    }
    function checkUndo(entity, undoList, type) {
        if (type === 'move') {
            if (undoList[entity.id]) {
                undoList[entity.id].push({ type: type, position: { ...entity.components['board-position'] } });
            }
            else {
                undoList[entity.id] = [{ type: type, position: { ...entity.components['board-position'] } }]
            }
        }
        else if (type === 'delete') {
            if (undoList[entity.id]) {
                undoList[entity.id].push({ type: type, entity: { ...entity } });
            }
            else {
                undoList[entity.id] = [{ type: type, entity: { ...entity }}]
            }
        }
    }
    function moveUp(entity, board, particleRequests, updateList, toDelete) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        if (entityPosition.y > 0 && !checkForProperty(board.cells[entityPosition.x][entityPosition.y - 1].contents, 'STOP')) {
            // updateList[entity.id] = { ...entityPosition };
            checkUndo(entity, updateList, 'move')
            entityPosition.y = entityPosition.y - 1;
            checkForPostMoveEvents(entity, particleRequests, board, toDelete, updateList)
            pushUp(entityPosition, board, moveUp, particleRequests, updateList, toDelete)
            addEntityToBoard(entity, board);
        }
    }
    function moveDown(entity, board, particleRequests, updateList, toDelete) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        // if (entityPosition.y < board.height - 1) {
        if (entityPosition.y < board.height - 1 && !checkForProperty(board.cells[entityPosition.x][entityPosition.y + 1].contents, 'STOP')) {
            // updateList[entity.id] = {type: 'move', position: { ...entityPosition } };
            checkUndo(entity, updateList, 'move')
            entityPosition.y = entityPosition.y + 1;
            checkForPostMoveEvents(entity, particleRequests, board, toDelete, updateList)
            pushUp({ ...entityPosition }, board, moveDown, particleRequests, updateList, toDelete)
            addEntityToBoard(entity, board);
        }
    }
    function moveLeft(entity, board, particleRequests, updateList, toDelete) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        // if (entityPosition.x > 0) {
        if (entityPosition.x > 0 && !checkForProperty(board.cells[entityPosition.x - 1][entityPosition.y].contents, 'STOP')) {
            // updateList[entity.id] = {type: 'move', position: { ...entityPosition } };
            checkUndo(entity, updateList, 'move')
            entityPosition.x = entityPosition.x - 1;
            checkForPostMoveEvents(entity, particleRequests, board, toDelete, updateList)
            pushUp(entityPosition, board, moveLeft, particleRequests, updateList, toDelete)
            addEntityToBoard(entity, board);
        }
    }
    function moveRight(entity, board, particleRequests, updateList, toDelete) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        if (entityPosition.x < board.width - 1 && !checkForProperty(board.cells[entityPosition.x + 1][entityPosition.y].contents, 'STOP')) {
            // updateList[entity.id] = {type: 'move', position: { ...entityPosition } };
            checkUndo(entity, updateList, 'move')
            entityPosition.x = entityPosition.x + 1;
            checkForPostMoveEvents(entity, particleRequests, board, toDelete, updateList)
            pushUp({ ...entityPosition }, board, moveRight, particleRequests, updateList, toDelete)
            addEntityToBoard(entity, board);
        }
    }
    // Set the sprite of the bunny to face the right direction
    function setFacing(entity, direction, particleRequests) {
        if (entity.components.sprite) {
            // if we are rendering the bunny
            if (entity.components.noun) {
                if (entity.components.noun.valueType === 'Baba') {
                    switch (direction) {
                        case MyGame.constants.direction.UP:
                            entity.components.sprite.key = 'bunnyUp';
                            entity.components.sprite.animateExtra = true;
                            break;
                        case MyGame.constants.direction.DOWN:
                            entity.components.sprite.key = 'bunnyDown';
                            entity.components.sprite.animateExtra = true;
                            break;
                        case MyGame.constants.direction.RIGHT:
                            entity.components.sprite.key = 'bunnyRight';
                            entity.components.sprite.animateExtra = true;
                            break;
                        case MyGame.constants.direction.LEFT:
                            entity.components.sprite.key = 'bunnyLeft';
                            entity.components.sprite.animateExtra = true;
                            break;

                    }
                    // Add walking particle effect to requests for baba
                    // particleRequests.push({})
                }
                // entity.components.sprite.key = 'bunnyUp';


            }
        }
    }
    function moveEntityOnBoard(entity, board, particleRequests, updateList, toDelete) {
        let movable = entity.components.movable;
        switch (movable.moveDirection) {
            case MyGame.constants.direction.UP:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveUp(entity, board, particleRequests, updateList, toDelete);
                setFacing(entity, MyGame.constants.direction.UP);
                break;

            case MyGame.constants.direction.DOWN:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveDown(entity, board, particleRequests, updateList, toDelete);
                setFacing(entity, MyGame.constants.direction.DOWN, particleRequests);
                break;


            case MyGame.constants.direction.RIGHT:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveRight(entity, board, particleRequests, updateList, toDelete);
                setFacing(entity, MyGame.constants.direction.RIGHT, particleRequests);
                break;


            case MyGame.constants.direction.LEFT:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveLeft(entity, board, particleRequests, updateList, toDelete);
                setFacing(entity, MyGame.constants.direction.LEFT, particleRequests);
                break;


        }

    }
    function update(elapsedTime, entities, gameBoard, particleRequests, updateList) {
        let toDelete = {}
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.movable) {
                moveEntityOnBoard(entity, gameBoard, particleRequests, updateList, toDelete);
                // console.log(updateList)
            }
        }
        for (let id in toDelete) {
            delete entities[id];
        }
    }

    return {
        update: update
    }
}());