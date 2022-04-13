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
    function moveUp(entity, board) {
        let entityPosition = entity.components['board-position'];
        // console.log(`in move up. entity position is ${entityPosition}`)
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.y > 0) {
            entityPosition.y = entityPosition.y - 1;
            pushUp(entityPosition, board, moveUp)
            addEntityToBoard(entity, board);
        }
    }
    function moveDown(entity, board) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.y < board.height - 1) {
            entityPosition.y = entityPosition.y + 1;
            pushUp({ ...entityPosition }, board, moveDown)
            addEntityToBoard(entity, board);
        }
    }
    function moveLeft(entity, board) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.x > 0) {
            entityPosition.x = entityPosition.x - 1;
            pushUp(entityPosition, board, moveLeft)
            addEntityToBoard(entity, board);
        }
    }
    function moveRight(entity, board) {
        let entityPosition = entity.components['board-position'];
        // console.log(entityPosition);
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.x < board.width - 1) {
            entityPosition.x = entityPosition.x + 1;
            pushUp({ ...entityPosition }, board, moveRight)
            addEntityToBoard(entity, board);
        }
    }
    // Set the sprite of the bunny to face the right direction
    function setFacing(entity, direction) {
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
                }
                // entity.components.sprite.key = 'bunnyUp';


            }
        }
    }
    function moveEntityOnBoard(entity, board) {
        let movable = entity.components.movable;
        switch (movable.moveDirection) {
            case MyGame.constants.direction.UP:
                // if (canMove) {
                    movable.moveDirection = MyGame.constants.direction.STOPPED;
                    moveUp(entity, board);
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
                    moveDown(entity, board);
                    setFacing(entity, MyGame.constants.direction.DOWN);
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
                    moveRight(entity, board);
                    setFacing(entity, MyGame.constants.direction.RIGHT);
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
                    moveLeft(entity, board);
                    setFacing(entity, MyGame.constants.direction.LEFT);
                    // canMove = false;
                    break;
                // }
                // else {
                //    canMove = true;
                //    break; 
                // }


        }

    }
    function update(elapsedTime, entities, gameBoard) {
        // moveTime -= elapsedTime;
        // if(moveTime <= 0){
        //     moveTime += 750
        //     canMove = true;
        // }
        for (let key in entities) {
            let entity = entities[key];
            if (entity.components.movable) {
                moveEntityOnBoard(entity, gameBoard);
            }
        }
    }

    return {
        update: update
    }
}());