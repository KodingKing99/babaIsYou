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
    function moveUp(entity, board) {
        let entityPosition = entity.components['board-position'];
        // console.log(`in move up. entity position is ${entityPosition}`)
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.y > 0) {
            entityPosition.y = entityPosition.y - 1;
            addEntityToBoard(entity, board);
        }
    }
    function moveDown(entity, board) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.y < board.height - 1) {
            entityPosition.y = entityPosition.y + 1;
            addEntityToBoard(entity, board);
        }
    }
    function moveLeft(entity, board) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.x > 0) {
            entityPosition.x = entityPosition.x - 1;
            addEntityToBoard(entity, board);
        }
    }
    function moveRight(entity, board) {
        let entityPosition = entity.components['board-position'];
        board.cells[entityPosition.x][entityPosition.y].removeContent(entity);
        if (entityPosition.x < board.width - 1) {
            entityPosition.x = entityPosition.x + 1;
            addEntityToBoard(entity, board);
        }
    }
    // Set the sprite of the bunny to face the right direction
    function setFacing(entity, direction) {
        if (entity.components.sprite) {
            // if we are rendering the bunny
            console.log(entity.components)
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
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveUp(entity, board);
                setFacing(entity, MyGame.constants.direction.UP);
                break;
            case MyGame.constants.direction.DOWN:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveDown(entity, board);
                setFacing(entity, MyGame.constants.direction.DOWN);
                break;
            case MyGame.constants.direction.RIGHT:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveRight(entity, board);
                setFacing(entity, MyGame.constants.direction.RIGHT);
                break;
            case MyGame.constants.direction.LEFT:
                movable.moveDirection = MyGame.constants.direction.STOPPED;
                moveLeft(entity, board);
                setFacing(entity, MyGame.constants.direction.LEFT);
                break;
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