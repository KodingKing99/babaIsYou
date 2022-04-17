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
    function pushUp(entityPosition, board, callback) {
        // console.log(`cell contents at ${board.cells[entityPosition.x][entityPosition.y].x}, ${board.cells[entityPosition.x][entityPosition.y].y}`)
        // console.log(board.cells[entityPosition.x][entityPosition.y].contents)
        for (let index in board.cells[entityPosition.x][entityPosition.y].contents) {
            let mEntity = board.cells[entityPosition.x][entityPosition.y].contents[index];
            if (mEntity.components.properties) {
                if (mEntity.components.properties.is('PUSH')) {
                    callback(mEntity, board);
                }
            }
        }
    }
    function checkForPreMoveEvents(entity, particleRequests) {
        if (entity.components['noun']) {
            if (entity.components.noun.valueType === 'Baba') {
                let mpos = {...entity.components['board-position']};
                particleRequests.push({ effectCall: 'BABAWALK', position: {x: mpos.x, y: mpos.y}})
            }
        }
    }
    function checkForWins(position, board){
        let hasWon = false;
        let contents = board.cells[position.x][position.y].contents;
        // console.log(contents);
        for(let i = 0; i < contents.length; i++){
            // console.log(contents[i])
            if(contents[i].components.properties){
                if(contents[i].components.properties.is('WIN')){
                    hasWon = true;
                }
            }
        }
        return hasWon;
    }
    function checkForPostMoveEvents(entity, particleRequests, board){
        if(entity.components.noun){
            let foundWin = checkForWins(entity.components['board-position'], board)
            if(foundWin){
                particleRequests.push({effectCall: 'WON', position: {x: 5, y: 10}})
                particleRequests.push({effectCall: 'WON', position: {x: 10, y: 5}})
                particleRequests.push({effectCall: 'WON', position: {x: 15, y: 15}})
                particleRequests.push({effectCall: 'WON', position: {x: 3, y: 5}})
                MyGame.hasWon = true;
            }
        }
    }
    function moveUp(entity, board, particleRequests) {
        let entityPosition = entity.components['board-position'];
        // console.log(`in move up. entity position is ${entityPosition}`)
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        if (entityPosition.y > 0) {
            entityPosition.y = entityPosition.y - 1;
            checkForPostMoveEvents(entity, particleRequests, board)
            pushUp(entityPosition, board, moveUp)
            addEntityToBoard(entity, board);
        }
    }
    function moveDown(entity, board, particleRequests) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        if (entityPosition.y < board.height - 1) {
            entityPosition.y = entityPosition.y + 1;
            pushUp({ ...entityPosition }, board, moveDown)
            addEntityToBoard(entity, board);
        }
    }
    function moveLeft(entity, board, particleRequests) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        if (entityPosition.x > 0) {
            entityPosition.x = entityPosition.x - 1;
            pushUp(entityPosition, board, moveLeft)
            addEntityToBoard(entity, board);
        }
    }
    function moveRight(entity, board, particleRequests) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        checkForPreMoveEvents(entity, particleRequests);
        if (entityPosition.x < board.width - 1) {
            entityPosition.x = entityPosition.x + 1;
            pushUp({ ...entityPosition }, board, moveRight)
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
    function moveEntityOnBoard(entity, board, particleRequests, hasWon) {
        let movable = entity.components.movable;
        switch (movable.moveDirection) {
            case MyGame.constants.direction.UP:
                // if (canMove) {
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveUp(entity, board, particleRequests, hasWon);
                setFacing(entity, MyGame.constants.direction.UP);
                // canMove = false;
                break;
            // }
            // else {
            //     canMove = true;
            //     break;
            // }

            case MyGame.constants.direction.DOWN:
                // if (canMove) {
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveDown(entity, board, particleRequests);
                setFacing(entity, MyGame.constants.direction.DOWN, particleRequests);
                // canMove = false;
                break;
            // }
            // else {
            //     canMove = true;
            //     break;
            // }


            case MyGame.constants.direction.RIGHT:
                // if (canMove) {
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveRight(entity, board, particleRequests);
                setFacing(entity, MyGame.constants.direction.RIGHT, particleRequests);
                // canMove = false;
                break;
            // }
            // else {
            //     canMove = true;
            //     break;
            // }

            case MyGame.constants.direction.LEFT:
                // if (canMove) {
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveLeft(entity, board, particleRequests);
                setFacing(entity, MyGame.constants.direction.LEFT, particleRequests);
                // canMove = false;
                break;
            // }
            // else {
            //    canMove = true;
            //    break; 
            // }


        }

    }
    function update(elapsedTime, entities, gameBoard, particleRequests) {
        // moveTime -= elapsedTime;
        // if(moveTime <= 0){
        //     moveTime += 750
        //     canMove = true;
        // }
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.movable) {
                moveEntityOnBoard(entity, gameBoard, particleRequests);
            }
        }
    }

    return {
        update: update
    }
}());