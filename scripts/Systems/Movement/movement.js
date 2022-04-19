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
    function pushUp(entityPosition, board, callback, particleRequests, updateList) {
        // console.log(`cell contents at ${board.cells[entityPosition.x][entityPosition.y].x}, ${board.cells[entityPosition.x][entityPosition.y].y}`)
        // console.log(board.cells[entityPosition.x][entityPosition.y].contents)
        for (let index in board.cells[entityPosition.x][entityPosition.y].contents) {
            let mEntity = board.cells[entityPosition.x][entityPosition.y].contents[index];
            if (mEntity.components.properties) {
                if (mEntity.components.properties.is('PUSH')) {
                    callback(mEntity, board, particleRequests, updateList);
                }
            }
        }
    }
    function checkForPreMoveEvents(entity, particleRequests, contents) {
        if (entity.components['noun']) {
            if (entity.components.noun.valueType === 'Baba') {
                let mpos = { ...entity.components['board-position'] };
                particleRequests.push({ effectCall: 'BABAWALK', position: { x: mpos.x, y: mpos.y } })
            }
        }
    }
    function checkForProperty(contents, property) {
        let found = false;
        for (let i = 0; i < contents.length; i++) {
            if (contents[i].components.properties) {
                if (contents[i].components.properties.is(property)) {
                    found = true;
                }
            }
        }
        return found;
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
    function checkForPostMoveEvents(entity, particleRequests, board) {

        if (entity.components.noun) {
            if (entity.components.properties) {
                if (entity.components.properties.is('YOU')) {
                    let pos = entity.components['board-position'];
                    let contents = board.cells[pos.x][pos.y].contents
                    // let foundWin = checkForWins(entity.components['board-position'], board)
                    let foundWin = checkForProperty(contents, 'WIN')
                    if (foundWin) {
                        particleRequests.push({ effectCall: 'WON', position: { x: 5, y: 10 } })
                        particleRequests.push({ effectCall: 'WON', position: { x: 10, y: 5 } })
                        particleRequests.push({ effectCall: 'WON', position: { x: 15, y: 15 } })
                        particleRequests.push({ effectCall: 'WON', position: { x: 3, y: 5 } })
                        MyGame.hasWon = true;
                    }
                }
            }
        }
    }
    function moveUp(entity, board, particleRequests, updateList) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        if (entityPosition.y > 0 && !checkForProperty(board.cells[entityPosition.x][entityPosition.y - 1].contents, 'STOP')) {
            // let mChange = {};
            // mChange[entity.id] = {...entityPosition}
            updateList[entity.id] = { ...entityPosition };
            entityPosition.y = entityPosition.y - 1;
            checkForPostMoveEvents(entity, particleRequests, board)
            pushUp(entityPosition, board, moveUp, particleRequests, updateList)
            addEntityToBoard(entity, board);
        }
    }
    function moveDown(entity, board, particleRequests, updateList) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        // if (entityPosition.y < board.height - 1) {
        if (entityPosition.y < board.height - 1 && !checkForProperty(board.cells[entityPosition.x][entityPosition.y + 1].contents, 'STOP')) {
            updateList[entity.id] = { ...entityPosition };
            entityPosition.y = entityPosition.y + 1;
            checkForPostMoveEvents(entity, particleRequests, board)
            pushUp({ ...entityPosition }, board, moveDown, particleRequests, updateList)
            addEntityToBoard(entity, board);
        }
    }
    function moveLeft(entity, board, particleRequests, updateList) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        // if (entityPosition.x > 0) {
        if (entityPosition.x > 0 && !checkForProperty(board.cells[entityPosition.x - 1][entityPosition.y].contents, 'STOP')) {
            updateList[entity.id] = { ...entityPosition };
            entityPosition.x = entityPosition.x - 1;
            checkForPostMoveEvents(entity, particleRequests, board)
            pushUp(entityPosition, board, moveLeft, particleRequests, updateList)
            addEntityToBoard(entity, board);
        }
    }
    function moveRight(entity, board, particleRequests, updateList) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        if (entityPosition.x < board.width - 1 && !checkForProperty(board.cells[entityPosition.x + 1][entityPosition.y].contents, 'STOP')) {
            updateList[entity.id] = { ...entityPosition };
            entityPosition.x = entityPosition.x + 1;
            checkForPostMoveEvents(entity, particleRequests, board)
            pushUp({ ...entityPosition }, board, moveRight, particleRequests, updateList)
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
    function moveEntityOnBoard(entity, board, particleRequests, updateList) {
        let movable = entity.components.movable;
        switch (movable.moveDirection) {
            case MyGame.constants.direction.UP:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveUp(entity, board, particleRequests, updateList);
                setFacing(entity, MyGame.constants.direction.UP);
                break;

            case MyGame.constants.direction.DOWN:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveDown(entity, board, particleRequests, updateList);
                setFacing(entity, MyGame.constants.direction.DOWN, particleRequests);
                break;


            case MyGame.constants.direction.RIGHT:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveRight(entity, board, particleRequests, updateList);
                setFacing(entity, MyGame.constants.direction.RIGHT, particleRequests);
                break;


            case MyGame.constants.direction.LEFT:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveLeft(entity, board, particleRequests, updateList);
                setFacing(entity, MyGame.constants.direction.LEFT, particleRequests);
                break;


        }

    }
    function update(elapsedTime, entities, gameBoard, particleRequests, updateList) {
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.movable) {
                moveEntityOnBoard(entity, gameBoard, particleRequests, updateList);
            }
        }
    }

    return {
        update: update
    }
}());